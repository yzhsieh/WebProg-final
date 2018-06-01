

const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
// import message from 'message.js';
// [timestamp, sender, receiver, textcontent]
// 1526137011 <--->  2018/5/12 22:56:51
var bodyParser = require('body-parser');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1205",
  database : 'tetris'
});

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   con.query("CREATE DATABASE tetris", function (err, result) {
//     if (err) throw err;
//     console.log("Database created");
//   });
// });

var username;
io.on('connection', socket => {
  socket.on("set id", (msg) =>{
    console.log(msg, 'connected')
    username = msg;
    socket.join(msg)


    // io.to(msg).emit("set side win", rnt)
  })

  socket.on("request sideWinData", (name, fn) => {

    var rnt = getSideWinData(name)
    // console.log(rnt)
    fn(rnt)
  })

  function getSideWinData(name){
    var rnt = []
    console.log(name)
    
    for(let i = 0; i < database.length ; i++){
        if(database[i].sender == name || database[i].receiver == name){
            rnt.push([database[i].timestamp, database[i].sender, database[i].receiver, database[i].content]);
            // rnt.push(database[i]);
        }
    }
    return rnt
  }


  function getChatWinData(sender, receiver){ // sender and receiver is fake here
    var rnt = []
    for(let i = 0; i < database.length ; i++){
      if(database[i].sender == sender && database[i].receiver == receiver){
          rnt.push([database[i].timestamp, database[i].sender, database[i].receiver, database[i].content]);
      }
      else if(database[i].sender == receiver && database[i].receiver == sender){
        rnt.push([database[i].timestamp, database[i].sender, database[i].receiver, database[i].content]);
    }
  }
  return rnt;
  }
  socket.on("request chatWinData", (arr, fn) => {
    console.log(arr)
    var rnt = getChatWinData(arr[0], arr[1])
    console.log(rnt)
    fn(rnt)
  })

  // not test yet (especially for room function)
  socket.on("post chat", (arr, fn) => {
    database.push(new message(0, arr[0], arr[1], arr[2]))
    var rnt = getChatWinData(arr[0], arr[1])
    var sideData1 = getSideWinData(arr[0])
    var sideData2 = getSideWinData(arr[1])
    socket.to(arr[0]).emit("update chatWin", [rnt, sideData1])
    socket.to(arr[1]).emit("update chatWin", [rnt, sideData2])
  })


  socket.on('disconnect', () => {
    console.log(username, 'disconnected')
  })
})

server.listen(3010, function () {
    console.log('Chat server listen on port 3010!');
  });

