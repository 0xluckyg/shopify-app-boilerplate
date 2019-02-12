const mongoose = require('mongoose');

//Tells mongoose we're using bluebird promise
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI, {
    useMongoClient: true
});

module.exports = {mongoose};