$(function () {

  var socket = io.connect();

  $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');

    socket.emit('send user')
    return false;
  });

  socket.on('chat message', function(new_msg){

    console.log(new_msg);

        $('#messages').append('<li><span class="user_name">' + new_msg.user + ':</span><span class="msg">' + new_msg.msg + '</span></li>');
      scrollToBottom();
    });
});

function scrollToBottom(){
  var objDiv = document.getElementById("chatbox");
  objDiv.scrollTop = objDiv.scrollHeight;
}
