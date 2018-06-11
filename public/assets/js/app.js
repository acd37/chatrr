$(function () {

  var socket = io.connect();

  $('form').submit(function(e){
      e.preventDefault()

      var submit_msg = {
        msg: $('#m').val(),
        user:  $("#user-name").text()
      }

      socket.emit('chat message', submit_msg);
      $('#m').val('');

      return false;
    });

    socket.on('chat message', function(new_msg){
      $('#messages').append('<li><span class="user_name">' + new_msg.user + ':</span><span class="msg">' + new_msg.msg + '</span></li>')
      scrollToBottom();
    });


    $("#m").keyup(function(e){
      if (e.keyCode != 13) {
        onKeyDownNotEnter()
      }
    });

    socket.on('is typing', function(data){

      var user = data.user;
      var msg = data.msg;

      $("#typing-user").html(user + " " + msg);
    });

    var typing = false;
    var timeout = undefined;

    function timeoutFunction(){
      typing = false;
      var typing_message = {
        user: $("#user-name").text(),
        msg: ' stopped typing'
      }
      socket.emit('is typing', typing_message);
    }

    function onKeyDownNotEnter(){
      if (typing == false) {
        typing = true;
        var typing_message = {
          user: $("#user-name").text(),
          msg: ' is typing'
        }
        socket.emit('is typing', typing_message);
        timeout = setTimeout(timeoutFunction, 1500);
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(timeoutFunction, 1500);
      }
    }


});


function scrollToBottom(){
  var objDiv = document.getElementById("chatbox");
  objDiv.scrollTop = objDiv.scrollHeight;
}
