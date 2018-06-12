module.exports = function(app, passport) {

  //API Routes
  app.get('/api/user_data', function(req, res) {
    if (req.user === undefined) {
      res.json ({});
    } else {
      res.json({
        username: req.user.local.email
      });
    }
  });


    // Home Page
    app.get('/', (req,res) => {
        res.render('main');
    });

    // Login
    app.get('/login', (req,res) => {
        res.render('login', {message: req.flash('loginMessage')});
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/chat',
        failureRedirect: '/login',
        failureFlash: true
    }));

    // Signup
    app.get('/register', (req,res) => {
        res.render('register', {message: req.flash('signupMessage')});
    });

    // Process Signup Form
    app.post('/register', passport.authenticate('local-signup', {
        successRedirect: '/chat',
        failureRedirect: '/register',
        failureFlash: true
    }));

    // Chat Home
    app.get('/chat', isLoggedIn, (req,res) => {
        res.render('chat', {
            user: req.user,
            email: req.user.local.email
        });
    });


    // Logout
    app.get('/logout', (req,res) => {
        req.logout();
        res.redirect('/');
    });

    // settings
    app.get('/settings', isLoggedIn, (req, res) => {
      res.render('settings', {
          user: req.user
      });
    })
};




// Route Middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/');
    }
}
