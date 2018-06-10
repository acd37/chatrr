$(function () {

  var socket = io.connect();

  $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');

    socket.emit('send user', 'alec')
    return false;
  });



  socket.on('chat message', function(new_msg){

    console.log(new_msg);

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": window.location.origin + "/api/user_data",
      "method": "GET"
    }

    $.ajax(settings).done(function (response) {
      console.log(response);

      $('#messages').append('<span class="user_name">' + new_msg.user + ':</span> ' + '<li>' + new_msg.msg + '</li>');
      scrollToBottom();

    });
  });
});

function scrollToBottom(){
  var objDiv = document.getElementById("chatbox");
  objDiv.scrollTop = objDiv.scrollHeight;
}
