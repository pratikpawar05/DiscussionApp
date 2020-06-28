const mongoose = require('mongoose');
const mydb_url = 'mongodb://localhost:27017/ChatApp?authSource=admin';
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

// require('./groupchats.model');