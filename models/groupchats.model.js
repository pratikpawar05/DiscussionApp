const mongoose = require('mongoose');
const moment = require('moment');
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
        default:undefined,
    },
    date: {
        type: String,
        default: moment().format('MMMM Do YYYY, h:mm:ss a'),
    },
    
});

module.exports = {
   "GroupChats": GroupChatSchema,
}
