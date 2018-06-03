const passport = require('passport');
var config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const RolesModel = require('../user/roles.model');
const dbContainer = require('../../database');
const queries = dbContainer.queries;

const loginErrorMessage = 'The email or password was incorrect.';
const jwtSecret = config.get('jwtSecret');

function signup(req, res) {
    const userData = req.body;
    return queries.UserQueries.getUserByEmail(userData.email).then(foundUser => {
        if (!foundUser) {
            userData.password = bcrypt.hashSync(userData.password, bcrypt.genSaltSync(12));
            userData.role = RolesModel.USER;
            return queries.AuthQueries.signup(userData)
                .then(user => {
                    return res.json(user);
                }).catch(err => {
                    return res.status(500).send(err);
                });
        } else {
            return res.status(500).json({ error: "An account with this email address already exists." });
        }
    }).catch(err => {
        return res.status(500).send(err);
    });
}

function login (req, res, next) {
    passport.authenticate('local', (err, user, message) => {
        if (err) {
            return res.status(500).send(err);
        } else if (!user) {
            return res.status(401).send(message);
        } else {
            req.login(user, { session: false }, err => {
                if (err) {
                    res.status(500).send(err);
                }

                const token = jwt.sign(user, jwtSecret, { expiresIn: 60 * 60 * 24 });

                return res.json({ user: _.omit(user, ['password']), token });
            });
        }
    })(req, res);
}

function authenticateUserMiddleware (req, res, next) {
    passport.authenticate('jwt', (err, user) => {
        if (err || !user || (user.role !== RolesModel.USER && user.role !== RolesModel.ADMIN)) {
            return res.status(401).send("Unauthorized.");
        }

        return next();
    })(req, res, next);
}

function authenticateAdminMiddleware (req, res, next) {
    passport.authenticate('jwt', (err, user) => {
        if (err || !user || user.role !== RolesModel.ADMIN) {
            return res.status(401).send("Unauthorized.");
        }

        return next();
    })(req, res, next);
}

function initialize (app) {
    passport.use(new LocalStrategy(
        {usernameField: 'email', passwordField: 'password', session: false}, 
        (email, password, done) => {
            return queries.UserQueries.getUserByEmail(email).then(user => {

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
            }).catch(err => {
                return done(err);
            });
        }
    ));
    passport.use(new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey   : jwtSecret
        },
        (jwtPayload, done) => {
            return queries.UserQueries.getUserById(jwtPayload.id).then(user => {
                return done(null, user);
            }).catch(err => {
                return done(err);
            });
        }
    ));
    app.use(passport.initialize());
}

module.exports = {
    login,
    signup,
    authenticateUserMiddleware,
    authenticateAdminMiddleware,
    initialize
};