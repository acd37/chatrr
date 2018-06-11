const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const configDB = require('./config/database.js');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server)
require('./config/passport')(passport);

// Configuration
mongoose.connect(configDB.url)

//Port Number
const port = process.env.PORT || 8080;

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
    let new_msg = {
      user:msg.user,
      msg:msg.msg
    }
    io.emit('chat message', new_msg);
  });

  socket.on('leave', function(){

  });

  socket.on('is typing', function(data){

    let typing_message = {
      user: data.user,
      msg: data.msg
    }

    io.emit('is typing', typing_message)
  });

});

//Start server
server.listen(port, () =>{
    console.log('Server started on port: ' + port);
});
