const LocalStrategy = require('passport-local').Strategy;
const User = require('../app/models/user');

module.exports = function(passport){

    // Serialize the user for the session
    passport.serializeUser((user,done) => {
        done(null, user.id);
    });

    // Deserialize the user
    passport.deserializeUser((id,done) => {
        User.findById(id, (err,user) => {
            done(err,user);
        });
    });

    // Local Signup
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done){
        process.nextTick(() => {
            User.findOne({'local.email': email}, (err,user) => {
                if (err){
                    return done(err);
                }

                if (user){
                    return done(null, false, req.flash('signupMessage', 'That email is already in use.'))
                } else{
                    let newUser = new User();
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);

                    newUser.save((err) => {
                        if (err) throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    // Local Login
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done){
        User.findOne({'local.email': email}, (err,user) => {
            if (err){
                return done(err);
            }

            if (!user){
                return done(null, false, req.flash("loginMessage", "No user found."))
            }

            if (!user.validPassword(password)){
                return done(null, false, req.flash('loginMessage', 'Opps! Wrong Password.'))
            }

            return done(null,user);
        });
    }));
};