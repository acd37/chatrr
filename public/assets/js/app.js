$(function () {
  var socket = io.connect();
  $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg){

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": window.location.origin + "/api/user_data",
      "method": "GET"
    }

    $.ajax(settings).done(function (response) {
      console.log(response);
      $('#messages').append($('<li>').html(response.username + ": " + msg));
      scrollToBottom();
    });
  });
});

function scrollToBottom(){
  var objDiv = document.getElementById("chatbox");
  objDiv.scrollTop = objDiv.scrollHeight;
}

function getCurrentUser(){

}
