const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;;

const loginErrorMessage = 'The email or password was incorrect.';
const secret = 'a872e724-5e5e-46e6-bd04-11756695f10c'; //TODO: Move to config file

const mockUser = {
  email: 'test@test.com',
  password: bcrypt.hashSync('my-password', bcrypt.genSaltSync(10)),
  id: 1
}; //TODO: Remove

// TODO: Get User from database
function findUserByEmail (email, callback) {
    if (email === mockUser.email) {
      return callback(null, mockUser);
    }
    return callback(null);
}

// TODO: Get User from database
function findUserById (id, callback) {
    if (id === mockUser.id) {
      return callback(null, mockUser);
    }
    return callback(null);
}

function login (req, res, next) {
    passport.authenticate('local', (err, user) => {
        if (err || !user) {
            return res.status(400).send("There was an unexpected error.");
        } else {
            req.login(user, { session: false }, err => {
                if (err) {
                    res.send(err);
                }

                const token = jwt.sign(user, secret, { expiresIn: 60 * 30 });

                return res.json({ user, token });
            })
        }
    })(req, res);
}

function authenticationMiddleware () {
    return passport.authenticate('jwt', { session: false });
}

function initialize (app) {
    passport.use(new LocalStrategy(
        {usernameField: 'email', passwordField: 'password', session: false}, 
        (email, password, done) => {
            findUserByEmail(email, (err, user) => {
                if (err) {
                    return done(err);
                }

                // User not found
                if (!user) {
                    return done(null, false, {message: loginErrorMessage});
                }

                // Always use hashed passwords and fixed time comparison
                bcrypt.compare(password, user.password, (err, isValid) => {
                    if (err) {
                        return done(err);
                    }
                    if (!isValid) {
                        return done(null, false, {message: loginErrorMessage});
                    }
                    return done(null, user);
                })
            });
        }
    ));
    passport.use(new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey   : secret
        },
        (jwtPayload, done) => {
            findUserById(jwtPayload.id, (err, user) => {
                if (err) {
                    return done(err);
                }

                return done(null, user);
            });
        }
    ));
    app.use(passport.initialize());
}

module.exports = {
    login,
    authenticationMiddleware,
    initialize
};