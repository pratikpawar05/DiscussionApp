const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const{formatMessage,createMessage}= require("./controller/messages");
const {
  GroupChats
} = require('./models/groupchats.model');
require("./models/mongodb");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
require("events").EventEmitter.prototype._maxListeners = 0;
const fs = require("fs");
const moment = require('moment');

const {
  userJoin,
  userLeave,
  getRoomUsers
} = require("./controller/users");

var GroupChat = mongoose.model("GroupChat", GroupChats);
var room = "";
var username = "";
app.use(fileUpload());
//Get the post data from client
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

//Set View Engine To EJS
app.set("view engine", "ejs");
//Set Static Directory

app.use(express.static(__dirname + "/views"));
app.use("/storage",express.static(__dirname + "/storage"));

//Socket Complete Logic
io.on("connection", (socket) => {
  const user = userJoin(socket.id, username, room); 
  socket.join(user.room);
  var GroupChat = mongoose.model("GroupChat", GroupChats, user.room);
  GroupChat.find({},
    (err, docs) => {
      if (!err) {
        socket.emit("message", docs);

        //When User Gets Connected For The First Time
        socket.emit(
          "formattedMessage",
          formatMessage(user.username, `Welcome To ${room} Discussion Portal!`)
        );
      } else {
        console.log("Error during record fetch : " + err);
      }
    }
  );

  //Notify other users in group about it
  socket.broadcast
    .to(user.room)
    .emit("formattedMessage", formatMessage(user.username, "Joined The Chat"));

  // Send users and room info
  io.to(user.room).emit("roomUsers", {
    users: getRoomUsers(user.room),
  });
    ///Get the message from the client side ..render it & save the message 7 render back the formatted message to user
    socket.on("chatMessage", (messageData) => {
    var GroupChat = mongoose.model("GroupChat", GroupChats, user.room);
    var temp;
      if(messageData.length==1){
        temp=createMessage(user.username,messageData[0])
          //Insert the message
          GroupChat.collection.insertOne({
            roomName: user.room,
            message: temp,
            from: user.username,
            socketId: socket.id,
            date:moment().utcOffset("+05:30").format('MMMM Do YYYY, h:mm:ss a'),
          }, (err,doc) => {
            if (!err) {
              io.to(user.room).emit("formattedMessage",temp);
              myCustomInput=` <input type="hidden" value="${doc.insertedId}">`
              io.to(user.room).emit("formattedMessage",myCustomInput);
              console.log("Succesfully message saved!!");
            }
            else{ console.log("Error during record insertion : " + err)};
          });

      }else{
        path = `${__dirname}/storage/${messageData[2]}/${messageData[1]}`;
        fs.writeFile(path + "", messageData[0], function (err) {
          if (err){
            io.emit("alert",`could not save the ${messageData[1]} plz try again!!`)
          }else{
            temp=createMessage(user.username,undefined,{file:messageData[0],fileName:messageData[1],fileType:messageData[2],leftContent:messageData[3],rightContent:messageData[4]})
            //Insert the message
            GroupChat.collection.insertOne({
              roomName: user.room,
              message: temp,
              from: user.username,
              socketId: socket.id,
              date:moment().utcOffset("+05:30").format('MMMM Do YYYY, h:mm:ss a'),
            }, (err,result) => {
              if (!err){ 
                io.to(user.room).emit("formattedMessage",temp)
                myCustomInput=` <input type="hidden" value="${doc.insertedId}">`
                io.to(user.room).emit("formattedMessage",myCustomInput);
                console.log("Succesfully message saved!!"+result)
            }
              else{ console.log("Error during record insertion : " + err)};
            });
            console.log("Saved!",temp);
          }
        });
      }
    });
socket.on('deleteMessage',(messageId) => {
  GroupChat.findByIdAndDelete(messageId,(err,doc)=>{
    if (!err){
      
      io.emit('alert','Message deleted sucesfully');
    }
    else{
      io.emit('alert','Error deleting message');
    }
  });
});

  //When User Left the chat
  socket.on("disconnect", () => {
    io.to(user.room).emit(
      "formattedMessage",
      formatMessage(user.username, " Left The Chat ")
    );
    userLeave(socket.id);
    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      users: getRoomUsers(user.room),
    });
  });
});

//Code To Start The Server using http/express
http.listen(3000, (err) => {
  if (!err) {
    console.log("Server Started");
  } else {
    console.log("Not Started");
  }
});

// Routes For Group Chat App
app.get("/", (req, res) => {
  res.render("index.ejs", {
    topicHead: "Language Discussion Portal",
  });
});
app.post("/", (req, res) => {
  room = req.body.room;
  username = req.body.username;
  res.render("chat.ejs", {
    topicHead: "Language Discussion Portal",
    room: room,
    username: username,
  });
});