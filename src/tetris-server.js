

const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
var ROWS = 16;
var COLS = 16;
var board = [];
var players = [];
var playersNUM = 0;
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

function init() {
  for (var y = 0; y < ROWS; ++y) {
    board[y] = [];
    for (var x = 0; x < COLS; ++x) {
      board[y][x] = 0;
    }
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
  p.currentX = 5;
  p.currentY = 0;
}

function valid(p, offsetX, offsetY, newCurrent) {
  console.log('in valid');
  // console.log(p);
  // console.log(p);


  offsetX = offsetX || 0;
  offsetY = offsetY || 0;
  offsetX = p.currentX + offsetX;
  offsetY = p.currentY + offsetY;
  newCurrent = newCurrent || p.current;

  for (var y = 0; y < 4; ++y) {
    for (var x = 0; x < 4; ++x) {
      if (newCurrent[y][x]) {
        if (typeof board[y + offsetY] == 'undefined'
          || typeof board[y + offsetY][x + offsetX] == 'undefined'
          || board[y + offsetY][x + offsetX]
          || x + offsetX < 0
          || y + offsetY >= ROWS
          || x + offsetX >= COLS) {
          if (offsetY == 1 && p.freezed) {
            p.lose = true; // lose if the current shape is settled at the top most row
            document.getElementById('playbutton').disabled = false;
          }
          return false;
        }
      }
    }
  }
  return true;
}

function clearLines(p) {
  for (var y = ROWS - 1; y >= 0; --y) {
    var rowFilled = true;
    for (var x = 0; x < COLS; ++x) {
      if (board[y][x] == 0) {
        rowFilled = false;
        break;
      }
    }
    if (rowFilled) {
      for (var yy = y; yy > 0; --yy) {
        for (var x = 0; x < COLS; ++x) {
          board[yy][x] = board[yy - 1][x];
        }
      }
      ++y;
      p.score += 100

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



io.on('connection', socket => {

  console.log('someone connected');

  function tick() {
    console.log('in tick');

    for (var p = 0; p < playersNUM; p++) {
      if (valid(players[p], 0, 1)) {
        ++players[p].currentY;
      }
      // if the element settled
      else {
        freeze(players[p]);
        valid(players[p], 0, 1);
        clearLines(players[p]);
        if (players[p].lose) {
          // TODO
          return false;
        }
        // newShape();
      }
      io.emit("update", [players, board])
      // console.log(board);
      console.log(players[0].current);


    }
  }

  function freeze(p) {
    console.log('>> in freeze');

    for (var y = 0; y < 4; ++y) {
      for (var x = 0; x < 4; ++x) {
        if (p.current[y][x]) {
          board[y + p.currentY][x + p.currentX] = p.current[y][x];
        }
      }
    }
    p.freezed = true;
    p.score += 10;
    newShape(p)
  }

  socket.on("start", (data) => {
    console.log('game start!');
    console.log(data);

    players.push(data)
    playersNUM = players.length
    init()
    newShape(players[0])
    setInterval(tick, 400)
  })


  socket.on("move", (arr, fn) => {
    console.log('move');

    let p = players[arr[0]]
    let key = arr[1]
    console.log(key);

    switch (key) {
      case 'left':
        if (valid(p, -1)) {
          --p.currentX;
        }
        break;
      case 'right':
        if (valid(p, 1)) {
          ++p.currentX;
        }
        break;
      case 'down':
        if (valid(p, 0, 1)) {
          ++p.currentY;
        }
        break;
      case 'rotate':
        var rotated = rotate(p);
        if (valid(p, 0, 0, rotated)) {
          p.current = rotated;
        }
        break;
      // TODO : drop may have some bug
      case 'drop':
        while (valid(p, 0, 1)) {
          ++p.currentY;
        }
        tick();
        break;
    }
    io.emit("update", [players, board])
  })
  socket.on("get room list", (fn) => {
    fn(currentRoom)
  })

  socket.on("create room", (arr, fn) => {
    let user = arr[0]
    let roomName = arr[1]
    let roomId = genRoomId()
    let tmp = [roomId, roomName, user]
    socket.join(roomId)
    console.log(io.sockets.adapter.rooms);
    currentRoom.push(tmp)
    console.log('created room:', tmp);
    // return room data
    io.emit("update lobby", currentRoom)
    fn(tmp)
  })

  socket.on("enter room", (arr, fn) => {
    let user = arr[0]
    let roomId = arr[1]
    let roomPtr = getRoomById(roomId)
    socket.join(roomId)
    console.log('in enter room function');
    console.log('user:', user, "roomid:", roomId);
    console.log(roomPtr);
    if (roomPtr !== undefined) {
      // check if room is full
      if (roomPtr.length == 4)
        fn(0)
      else {
        console.log('entered');
        roomPtr.push(user)
        fn(roomPtr)
        io.emit("update lobby", currentRoom)
        io.to(roomId).emit("update room", roomPtr)
        console.log(io.sockets.adapter.rooms);

      }
    }
    console.log(roomPtr);
  })

  socket.on("leave room", (arr, fn) => {
    let userId = arr[0];
    let roomId = arr[1];
    socket.leave(roomId)
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
      console.log(io.sockets.adapter.rooms);

      io.emit("update lobby", currentRoom)
      fn(1)
    }
  })


  // socket.on('disconnect', () => {
  //   console.log(username, 'disconnected')
  //   currentUser.splice(currentUser.indexOf(username), 1)
  // })
})

server.listen(3010, function () {
  console.log('Chat server listen on port 3010!');
});

