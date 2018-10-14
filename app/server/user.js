
function login(app) {
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
}

function signup(app) {
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
}

function getUser(app) {
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
}

module.exports = {
    login,
    signup,
    getUser
};