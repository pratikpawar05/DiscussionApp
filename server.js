const express = require('express')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const formatMessage = require('./controller/messages');
require('./models/mongodb');
const mongoose = require('mongoose');
require('events').EventEmitter.prototype._maxListeners = 0;


const {
	userJoin,
	userLeave,
	getRoomUsers,
} = require('./controller/users');

//Link To get the GroupChat Model & its Defined Schema In A Variable
//const Group = mongoose.model('Group');
const GroupChat = mongoose.model('GroupChat');

var room = '';
var username = '';

//Get the post data from client
app.use(express.urlencoded({
	extended: false
}))
app.use(express.json())

//Set View Engine To EJS
app.set('view engine', 'ejs');
//Set Static Directory
app.use(express.static(__dirname + '/views'));


//Socket Complete Logic
io.on('connection', (socket) => {
	const user = userJoin(socket.id, username, room);
	socket.join(user.room);
	GroupChat.find({
		roomName: user.room
	}, (err, docs) => {
		if (!err) {
			socket.emit('message', docs);
			//When User Gets Connected For The First Time
			socket.emit('messages', formatMessage(user.username, 'Welcome To Chat App'));
		} else {
			console.log('Error during record insertion : ' + err);
		}
	});


	//Notify other users in group about it
	socket.broadcast.to(user.room).emit('messages', formatMessage(user.username, 'Joined The Chat'));

	// Send users and room info
	io.to(user.room).emit('roomUsers', {
		users: getRoomUsers(user.room)
	});

	//Get user message & respond to all users in room
	socket.on('chatMessage', (msg) => {
		var groupchat = new GroupChat();
		groupchat.roomName = user.room;
		groupchat.message = msg;
		groupchat.from = user.username
		groupchat.socketId = socket.id;
		groupchat.save((err, doc) => {
			if (!err)
				console.log("Succesful");
			else
				console.log('Error during record insertion : ' + err);
		});

		//Send the message received from the Users to the collection group chats
		io.to(user.room).emit('messages', formatMessage(user.username, msg));
	});

	//When User Left the chat 
	socket.on('disconnect', () => {
		io.to(user.room).emit('messages', formatMessage(user.username, ' Left The Chat '));
		userLeave(socket.id);
		// Send users and room info
		io.to(user.room).emit('roomUsers', {
			users: getRoomUsers(user.room)
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


// Routes For Chats App
app.get('/', (req, res) => {
	res.render('index.ejs', {
		topicHead: 'Language Discussion Portal'
	});
});
app.post('/', (req, res) => {

	room = req.body.room
	username = req.body.username
	res.render('chat.ejs', {
		topicHead: 'Language Discussion Portal',
		room: room,
		username: username
	});
});