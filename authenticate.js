const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const config = require('./config.js');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            //User.findOne({ _id: "61fe99f4554c1179b42ef1d0" }, (err, user) => {
            User.findOne({ _id: jwt_payload._id }, (err, user) => {
                // req.user._id
                //console.log(user);
                //console.log(err);
                console.log("_id: ", user._id);
                if (err) {
                    return done(err, false);
                } else if (user) {
                    console.log('HELLO', user._id);
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);

exports.verifyUser = passport.authenticate('jwt', { session: false });

exports.verifyAdmin = (req, res, next) => {
    //console.log(req.user);
    //console.log(req.body);
    if (req.user.admin) {
        return next()
    }
    const error = new Error('You are not authorized to perform this operation!');
    error.status = 403;
    return next(error);
};