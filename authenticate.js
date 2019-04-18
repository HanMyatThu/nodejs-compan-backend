const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('./models/user');
const config = require('./config/keys');

// local strategy
exports.local = passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// JWT strategy
exports.genToken = (user) => {
    return jwt.sign(user, config.SECRET_KEY, { expiresIn: 86400 });
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.SECRET_KEY;

exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
        if (err) {
            return done(err, false);
        }
        else if (user) {
            return done(null, user);
        }
        else {
            return done(null, false)
        }
    });
}));

// Google OAuth 2 Strategy
exports.googleOAuth2 = passport.use(new GoogleStrategy({
    clientID: config.GOOGLE.clientID,
    clientSecret: config.GOOGLE.clientSecret,
    callbackURL: '/auth/google/redirect',
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id })
        .then(user => {
            if (user) {
                return done(null, user);
            }
            else {
                User.create({
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        googleId: profile.id,
                        photo: profile.photos[0].value
                    })
                    .then(newUser => {
                        if (newUser) {
                            return done(null, newUser);
                        }
                    }, err => done(err, false))
                    .catch(err => done(err, false));
            }
        }, err => done(err, false))
        .catch(err => done(err, false));
}));

exports.verifyUser = passport.authenticate('jwt', { session: false });
