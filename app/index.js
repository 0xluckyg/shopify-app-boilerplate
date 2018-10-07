require('./config/config');
require('./db/mongoose');
let express = require("express");
const http = require('http');

const app = express();
const server = http.createServer(app);

server.listen(3000, () => {
    console.log('Started on port: ', 3000);
});