const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./app/config/database');
const exphbs = require('express-handlebars');

//Connect to Database
mongoose.connect(config.database);

//On Connection
mongoose.connection.on('connected', () => {
    console.log("Connected to database " + config.database);
});

//On Error
mongoose.connection.on('error', (err) => {
    console.log("Database error: " + err);
});

const app = express();
const http = require('http').Server(app);
var io = require('socket.io')(http);

const users = require('./app/routes/users');

//Port Number
const port = 3000;

//CORS Middleware
app.use(cors());

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Body-parser Middleware
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./app/config/passport')(passport);

app.use('/users', users);

//For handlebars
app.set('views', './app/views');
app.engine('hbs', exphbs({
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

//Index Route
app.get('/', function(req,res) {
  res.render('./main');
});

app.get('/login', function(req,res) {
  res.render('./login');
});

app.get('/register', function(req,res) {
  res.render('./register');
});

app.get('/chat', function(req,res) {
  res.render('./chat');
});


io.on('connection', function(socket){
  console.log('a user connected');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});


//Start server
http.listen(port, () =>{
    console.log('Server started on port: ' + port);
});
