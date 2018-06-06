

const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
var bodyParser = require('body-parser');
var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 64,
  host: "localhost",
  user: "root",
  password: "1205",
  // host: "webprog.database.windows.net",
  // user: "yzhsieh@webprog",
  // password: "Smalldog1205",
  database : 'tetris',
  port: 3306,
});
////////////////////
// post = {name:"Jack", birth:"19941205", wincount:0, losecount:0, score:0}
// pool.query("INSERT INTO users SET ?", post, (err, result, fields) => {
//   if(err) throw err;
//   console.log('inserted');
//   console.log(result);
//   console.log(fields);
//   fn(result)            
// })
//////////////////////

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
var username;
///// room id generator
function* idMaker() {
  var index = 0;
  while(true)
    yield index++;
}
var gen = idMaker();
function genRoomId() {
  return gen.next().value
}
/////

getRoomById = (id) => {
  // TEST 
  for(let i = 0; i<currentRoom.length; i++){
    if(currentRoom[i][0] == id)
      return currentRoom[i]
  }
}

io.on('connection', socket => {
  socket.on("login", (msg, fn) =>{
    username = msg[0]
    name = msg[0];
    birth = msg[1];
    console.log(name, birth)
    //// make a SQL query
      var sql = mysql.format("SELECT * FROM `users` WHERE `name` = ? and `birth` = ?", [name, birth])
      pool.query(sql, (err, res) => {
        // console.log("in Login query")
        
        if( res.length !== 0){
          currentUser.push(res[0].name)
          rnt = {userData:res[0], lobbyData: currentRoom}
          console.log(rnt);
          io.emit("update sideWin", currentUser)
          fn(rnt)
          console.log(currentUser);
        }
        else{
          fn(0)
        }
      })
  })

  socket.on("register", (msg, fn) =>{
    name = msg[0];
    birth = msg[1];
    //// make a SQL query
      var sql = mysql.format("SELECT * FROM `users` WHERE `name` = ? and `birth` = ?", [name, birth])
      pool.query(sql, (err, res) => {
        // console.log("in Register query")
        // console.log(res);
        if( res.length === 0){
          console.log("new profile, insert to sql")
          post = {name:name, birth:birth, wincount:0, losecount:0, score:0}
          pool.query("INSERT INTO users SET ?", post, (err, result, fields) => {
            if(err) throw err;
            // console.log('inserted');
            // console.log(result);
            // console.log(fields);
            // fn(result)            
          })
        }
        else{
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
    if(roomPtr !== undefined){
      // check if room is full
      if(roomPtr.length == 4)
        fn(0)
      else{
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
    if(roomPtr != undefined){
      roomPtr.splice(roomPtr.indexOf(userId), 1)
      console.log('in leave room function');
      if(roomPtr.length == 2){
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


  socket.on("get sideWinData", (fn) => {
    fn(currentUser)
  })


  socket.on('disconnect', () => {
    console.log(username, 'disconnected')
    currentUser.splice(currentUser.indexOf(username), 1)
  })
})

server.listen(3010, function () {
    console.log('Chat server listen on port 3010!');
  });

