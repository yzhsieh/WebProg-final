
const path = require('path');
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const port = process.env.PORT || 8080;
var mysql = require('mysql2');
var runningGame = []
var AGD = {}; // All Game Data
var config = {
	host: "webprog-mysql.mysql.database.azure.com",
	user: "yzhsieh@webprog-mysql",
	password: "Smalldog1205",
	database: 'tetris',
	port: 3306,
	ssl: true

}

const conn = new mysql.createConnection(config);
const WINSCORE = 800

// conn.connect(
//   function (err) { 
//   if (err) { 
//       console.log("!!! Cannot connect !!! Error:");
//       throw err;
//   }
//   });
//   conn.query('CREATE TABLE users (name VARCHAR(255), birth INTEGER, wincount INTEGER, losecount INTEGER, score INTEGER);', 
//   function (err, results, fields) {
//       if (err) throw err;
//   console.log('Created users table.');
// })
// variables
// [id, roomName, user1, user2 (if exist)]
var currentRoom = []
// var currentRoom = [
//   [0, "房名一號", "Jack"],
//   [1, "這也是房名", "John"],
//   [2, "這還是房名", "Dick"],
//   [3, "這又是房名", "Kevin"],
// ]
var currentUser = []
// var username;
var ROWS = 20;
var COLS = 20;
var board = [];
var shapes = [
	[1, 1, 1, 1],
	[1, 1, 1, 0,
		1],
	[1, 1, 1, 0,
		0, 0, 1],
	[1, 1, 0, 0,
		1, 1],
	[1, 1, 0, 0,
		0, 1, 1],
	[0, 1, 1, 0,
		1, 1],
	[0, 1, 0, 0,
		1, 1, 1]
];
var colors = [
	'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple'
];
///// room id generator
function* idMaker() {
	var index = 0;
	while (true)
		yield index++;
}
var gen = idMaker();
function genRoomId() {
	return gen.next().value
}
/////
var roomId = undefined;


getRoomById = (id) => {
	for (let i = 0; i < currentRoom.length; i++) {
		if (currentRoom[i][0] == id)
			return currentRoom[i]
	}
}
////////////////////////// socketio /////////////////////
io.on('connection', socket => {
	let user = undefined;
	let userIDinRoom = undefined;
	socket.on("login", (msg, fn) => {
		user = msg[0];
		// username = msg[0]
		name = msg[0];
		birth = msg[1];
		console.log(name, birth)
		//// make a SQL query
		var sql = mysql.format("SELECT * FROM `users` WHERE `name` = ? and `birth` = ?", [name, birth])
		conn.query(sql, (err, res) => {
			if(err) throw err;
			console.log("in Login query")
			// console.log(err);
			// console.log(res);
			if (res.length !== 0) {
				currentUser.push(res[0].name)
				rnt = { userData: res[0], lobbyData: currentRoom }
				// console.log(rnt);
				io.emit("update sideWin", currentUser)
				fn(rnt)
				console.log(currentUser);
			}
			else {
				fn(0)
			}
		})
	})

	function init(players, roomId) {
		// put all date into AGD
		// playersNUM = players.length
		// console.log('init');
		// console.log(roomId);
		AGD[roomId] = { board: [], players: players }
		for (var y = 0; y < ROWS; ++y) {
			AGD[roomId].board[y] = [];
			for (var x = 0; x < COLS; ++x) {
				AGD[roomId].board[y][x] = 0;
			}
		}
		newShape(AGD[roomId].players[0])
		newShape(AGD[roomId].players[1])
	}

	function tick(roomId) {
		// console.log('in tick, roomId : ', roomId);
		if (!AGD[roomId].players[0].lose && !AGD[roomId].players[1].lose) {
			// console.log(AGD[roomId]);
			// console.log('in tick');
			for (var p = 0; p < 2; p++) {
				if (valid(AGD[roomId].players[p], roomId, 0, 1)) {
					++AGD[roomId].players[p].currentY;
				}
				// if the element settled
				else {
					freeze(AGD[roomId].players[p], roomId);
					valid(AGD[roomId].players[p], roomId, 0, 1);
					clearLines(AGD[roomId].players[p], roomId);
					if (AGD[roomId].players[p].lose) {
						// TODO
						return false;
					}
					// newShape();
				}
				io.to(roomId).emit("update", [AGD[roomId].players, AGD[roomId].board])
				// console.log(board);
				// console.log(AGD[roomId].players[0].current);

			}
		}
		else {
			console.log('game done!!');
			clearInterval(runningGame[roomId])
			io.to(roomId).emit("game over", AGD[roomId].players)

			delete AGD[roomId]

		}
	}
	function freeze(p, roomId) {
		// console.log('>> in freeze');
		for (var y = 0; y < 4; ++y) {
			for (var x = 0; x < 4; ++x) {
				if (p.current[y][x]) {
					AGD[roomId].board[y + p.currentY][x + p.currentX] = p.current[y][x];
				}
			}
		}
		p.freezed = true;
		p.score += 10;
		checkWin(roomId)
		//TODO : insert lost condiction here
		if (p.currentY == 0) {
			p.lose = true
			console.log('player', p.id, "lose!!!");
		}
		else {
			newShape(p)

		}
	}

	function checkWin(roomId){
		if(AGD[roomId].players[0].score >= WINSCORE){
			AGD[roomId].players[1].lose = true
		}
		else if(AGD[roomId].players[1].score >= WINSCORE){
			AGD[roomId].players[0].lose = true
		}
	}

	function newShape(p) {
		var id = Math.floor(Math.random() * shapes.length);
		var shape = shapes[id]; // maintain id for color filling

		p.current = [];
		for (var y = 0; y < 4; ++y) {
			p.current[y] = [];
			for (var x = 0; x < 4; ++x) {
				var i = 4 * y + x;
				if (typeof shape[i] != 'undefined' && shape[i]) {
					p.current[y][x] = id + 1;
				}
				else {
					p.current[y][x] = 0;
				}
			}
		}

		// new shape starts to move
		p.freezed = false;
		// position where the shape will evolve
		p.currentX = p.initCurrentX;
		p.currentY = 0;
	}

	function valid(p, roomId, offsetX, offsetY, newCurrent) {
		// console.log('>> in valid');
		// console.log(p);


		offsetX = offsetX || 0;
		offsetY = offsetY || 0;
		offsetX = p.currentX + offsetX;
		offsetY = p.currentY + offsetY;
		newCurrent = newCurrent || p.current;

		for (var y = 0; y < 4; ++y) {
			for (var x = 0; x < 4; ++x) {
				if (newCurrent[y][x]) {
					if (typeof AGD[roomId].board[y + offsetY] == 'undefined'
						|| typeof AGD[roomId].board[y + offsetY][x + offsetX] == 'undefined'
						|| AGD[roomId].board[y + offsetY][x + offsetX]
						|| x + offsetX < 0
						|| y + offsetY >= ROWS
						|| x + offsetX >= COLS) {
						if (offsetY == 1 && p.freezed) {
							console.log('lose!!');
							p.lose = true; // lose if the current shape is settled at the top most row
						}
						return false;
					}
				}
			}
		}
		return true;
	}

	function clearLines(p, roomId) {
		for (var y = ROWS - 1; y >= 0; --y) {
			var rowFilled = true;
			for (var x = 0; x < COLS; ++x) {
				if (AGD[roomId].board[y][x] == 0) {
					rowFilled = false;
					break;
				}
			}
			if (rowFilled) {
				for (var yy = y; yy > 0; --yy) {
					for (var x = 0; x < COLS; ++x) {
						AGD[roomId].board[yy][x] = AGD[roomId].board[yy - 1][x];
					}
				}
				++y;
				p.score += 100
				checkWin(roomId)
			}
		}
	}

	function rotate(p) {
		var newCurrent = [];
		for (var y = 0; y < 4; ++y) {
			newCurrent[y] = [];
			for (var x = 0; x < 4; ++x) {
				newCurrent[y][x] = p.current[3 - x][y];
			}
		}

		return newCurrent;
	}




	socket.on("start", (data) => {
		console.log(user, 'in', data[1], 'press game start!');
		// console.log(data);
		// players.push(data)
		// playersNUM = players.length
		init(data[0], data[1])

		runningGame[data[1]] = setInterval(() => { tick(data[1]) }, 400)
		// console.log(io.sockets.adapter.rooms);

		io.to(data[1]).emit("game start")
	})


	socket.on("move", (arr, fn) => {
		// console.log('>>> move');

		let roomId = arr[2]
		if (AGD[roomId]) {
			let p = AGD[roomId].players[arr[0]]
			let key = arr[1]
			// console.log(key);

			switch (key) {
				case 'left':
					if (valid(p, roomId, -1)) {
						--p.currentX;
					}
					break;
				case 'right':
					if (valid(p, roomId, 1)) {
						++p.currentX;
					}
					break;
				case 'down':
					if (valid(p, roomId, 0, 1)) {
						++p.currentY;
					}
					break;
				case 'rotate':
					var rotated = rotate(p);
					if (valid(p, roomId, 0, 0, rotated)) {
						p.current = rotated;
					}
					break;
				case 'drop':
					while (valid(p, roomId, 0, 1)) {
						++p.currentY;
					}
					tick(roomId);
					break;
			}
			if(AGD[roomId])
				io.to(roomId).emit("update", [AGD[roomId].players, AGD[roomId].board])
		}
	})

	socket.on("update user data", (d => {
		var sql = mysql.format("UPDATE `users` SET wincount = ?, losecount = ? WHERE name = ?", [d.wincount, d.losecount, d.name])
		conn.query(sql, (err, res) =>{
			if(err) throw err;
			console.log('in update user data');
			console.log(d);
		})

	}))

	socket.on("register", (msg, fn) => {
		name = msg[0];
		birth = msg[1];
		//// make a SQL query
		var sql = mysql.format("SELECT * FROM `users` WHERE `name` = ? and `birth` = ?", [name, birth])
		conn.query(sql, (err, res) => {
			console.log("in Register query")
			console.log(res);
			if (res === undefined || res.length === 0) {
				console.log("new profile, insert to sql")
				post = { name: name, birth: birth, wincount: 0, losecount: 0, score: 0 }
				conn.query("INSERT INTO users SET ?", post, (err, result, fields) => {
					if (err) throw err;
					// console.log('inserted');
					// console.log(result);
					// console.log(fields);
					// fn(result)            
				})
			}
			else {
				console.log('The account is already exist');
				fn(0)
			}
		})
	})

	socket.on("get room list", (fn) => {
		fn(currentRoom)
	})

	socket.on("create room", (arr, fn) => {
		let user = arr[0]
		let roomName = arr[1]
		roomId = genRoomId()
		let tmp = [roomId, roomName, user]
		socket.join(roomId)
		// this.roomId = roomId
		// console.log(io.sockets.adapter.rooms);
		currentRoom.push(tmp)
		console.log('created room:', tmp);
		// return room data
		io.emit("update lobby", currentRoom)
		fn(tmp)
	})

	socket.on("enter room", (arr, fn) => {
		user = arr[0]
		roomId = arr[1]
		let roomPtr = getRoomById(roomId)
		console.log('in enter room function');
		console.log('user:', user, "roomId:", roomId);
		console.log(roomPtr);
		if (roomPtr !== undefined) {
			// check if room is full
			if (roomPtr.length == 4)
				fn(0)
			else {
				console.log('entered');
				socket.join(roomId)
				this.roomId = roomId
				roomPtr.push(user)
				fn(roomPtr)
				io.emit("update lobby", currentRoom)
				io.to(roomId).emit("update room", roomPtr)
				// console.log(io.sockets.adapter.rooms);

			}
		}
		console.log(roomPtr);
		console.log(user, "enter the room #", roomId);

	})

	socket.on("leave room", (arr, fn) => {
		let userId = arr[0];
		roomId = arr[1];
		socket.leave(roomId)
		console.log(user, "leave the room #", roomId);
		this.roomId = undefined
		let roomPtr = getRoomById(roomId);
		if (roomPtr != undefined) {
			roomPtr.splice(roomPtr.indexOf(userId), 1)
			console.log('in leave room function');
			if (roomPtr.length == 2) {
				console.log('there is no person in room, remove it');
				currentRoom.splice(currentRoom.indexOf(roomPtr), 1)
			}
			console.log(currentRoom);
			io.to(roomId).emit("update room", roomPtr)
			// console.log(io.sockets.adapter.rooms);
			io.emit("update lobby", currentRoom)
			fn(1)
		}
	})


	socket.on("get sideWinData", (fn) => {
		fn(currentUser)
	})


	socket.on('disconnect', () => {
		console.log(user, 'disconnected')
		currentUser.splice(currentUser.indexOf(user), 1)
	})

	socket.on('error', (e) => {
		console.log("WOOOOOO in error function")
		console.log(console.error(e.message));
		
	});

})

/////////

app.use(express.static(path.join(__dirname, "../../build")));

app.get('/', (req, res, next) => 
	res.sendFile(__dirname + './index.html'));

server.listen(port, function () {
	console.log('Tetris server listen on port', port);
});

