module.exports = function(app, passport) {
    // Home Page
    app.get('/', (req,res) => {
        res.render('main');
    });

    // Login
    app.get('/login', (req,res) => {
        res.render('login', {message: req.flash('loginMessage')});
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    // Signup
    app.get('/register', (req,res) => {
        res.render('register', {message: req.flash('signupMessage')});
    });

    // Process Signup Form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/chat',
        failureRedirect: '/register',
        failureFlash: true
    }));

    // Profile
    app.get('/chat', isLoggedIn, (req,res) => {
        res.render('chat', {
            user: req.user
        });
    });

    // Logout
    app.get('/logout', (req,res) => {
        req.logout();
        res.redirect('/');
    });
};

// Route Middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/');
    }
}
