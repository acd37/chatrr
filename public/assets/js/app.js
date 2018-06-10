$(function () {
  var socket = io.connect();


  $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg){
    $('#messages').prepend($('<li>').html(msg));
  });
});
