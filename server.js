var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var configDB = require('./config/database.js');
var exphbs = require('express-handlebars');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var growl = require('growl');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
require('./config/passport')(passport);

// Configuration
mongoose.connect(configDB.url);

//Port Number
var port = process.env.PORT || 8080;

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Set up express app
app.use(bodyParser());
app.use(morgan('dev'));
app.use(cookieParser());

// Required for passport
app.use(session({secret: 'helloworld'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//For handlebars
app.set('views', './views');
app.engine('hbs', exphbs({
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Routes
require('./app/routes.js')(app,passport);

//Socket.IO
io.on('connection', function(socket){
      console.log(socket.id + ' connected');

  socket.on('disconnect', function(){
      console.log(socket.id + ' disconnected');
  });

  socket.on('chat message', function(msg){
    var new_msg = {
      user:msg.user,
      msg:msg.msg
    };
    io.emit('chat message', new_msg);
    growl('New message');
  });

  socket.on('leave', function(){

  });

  socket.on('is typing', function(data){

    var typing_message = {
      user: data.user,
      msg: data.msg
    };

    io.emit('is typing', typing_message);
  });

});

//Start server
server.listen(port, () =>{
    console.log('Server started on port: ' + port);
});
