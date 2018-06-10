$(function () {

  var socket = io.connect();

  $('form').submit(function(){

    var submit_msg = {
      msg: $('#m').val(),
      user:  $("#user-name").text()
    }

    socket.emit('chat message', submit_msg);
    $('#m').val('');

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
