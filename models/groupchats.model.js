const mongoose = require('mongoose');
const moment=require('moment');
const Schema = mongoose.Schema;
const GroupChatSchema = new Schema({
    from: {
        type: String,
    },
    roomName: {
        type: String,
    },
    message: {
        type: String,
    },
    socketId: {
        type: String,
    },
    date: {
        type: String,
        default: moment().format('h:mm a'),
    },
});

module.exports = mongoose.model('GroupChat', GroupChatSchema);