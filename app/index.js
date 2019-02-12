require('./config/config');
require('./db/mongoose');
const bodyParser = require('body-parser');
const express = require("express");
const http = require('http');

const { shopifyAuth } = require('./auth/shopify-auth');

const app = express();
const port = process.env.PORT;
const server = http.createServer(app);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, GET, FETCH, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Expose-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    next()    
});

app.use(bodyParser.json());

shopifyAuth(app);

server.listen(port, () => {
    console.log('Started on port: ', port);
});

module.exports = { app };