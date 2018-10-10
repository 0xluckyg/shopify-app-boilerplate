require('./config/config');
require('./db/mongoose');
const bodyParser = require('body-parser');
let express = require("express");
const http = require('http');

const app = express();
const port = process.env.PORT;
const server = http.createServer(app);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, GET, FETCH, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Expose-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(bodyParser.json());

app.post('/user/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.send({ token, user });
        });
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.post('/user/signup', (req, res) => {
    const user = new User(req.body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then(token => {
        res.send({ token, user });
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/user/me', (req, res) => {
    const queryToken = req.query.token;
    
    User.findByToken(queryToken)
    .then(user => {
        user.removeToken(queryToken);
        return user.generateAuthToken().then((token) => {
            res.send({ token, user });
        });
    });
});

server.listen(port, () => {
    console.log('Started on port: ', port);
});

module.exports = { app };