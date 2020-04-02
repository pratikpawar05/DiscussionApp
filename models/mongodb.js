const mongoose = require('mongoose');
const mydb_url = 'mongodb://admin:admin123@localhost:27017/ChatApp?authSource=admin';
mongoose.connect(mydb_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err) => {
        if (!err) {
            console.log('MongoDB Connected succesfully')
        } else {
            console.log('MongoDB Not Connected' + err)
        }
    });

require('./groups.model');
require('./groupchats.model');