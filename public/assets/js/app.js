$(window).resize(function(){
  if ($(window).width() < 973) {
    $('.col-md-8.chat-box').removeClass('col-md-8').addClass('col-md-12');
    $('.navbar').css('display', 'block');
  }

  if ($(window).width() < 973) {
    $('#chatbox').css('height', 'calc(100vh - 160px) !important');
  }

  if ($(window).width() > 973) {
    $('.col-md-8.chat-box').removeClass('col-md-12').addClass('col-md-8');
    $('.navbar').css('display', 'none');
  }
});

$(function () {

  var socket = io.connect();

  $('form').submit(function(e){
      e.preventDefault();

      var submit_msg = {
        msg: $('#m').val(),
        user:  $("#user-name").text()
      };

      socket.emit('chat message', submit_msg);
      $('#m').val('');

      return false;
    });

    socket.on('chat message', function(new_msg){
      $('<li><span class="user_name">' + new_msg.user + ':</span><div class="bubble"><span class="msg">' + new_msg.msg + '</span></div></li>').hide().appendTo('#messages').fadeIn(300);
      scrollToBottom();
    });


    $("#m").keyup(function(e){
      if (e.keyCode != 13) {
        onKeyDownNotEnter();
      }
    });

    socket.on('is typing', function(data){

      var user = data.user;
      var msg = data.msg;

      $("#typing-user").html(user + " " + msg);
    });

    var typing = false;
    var timeout;

    function timeoutFunction(){
      typing = false;
      var typing_message = {
        user: '&nbsp;',
        msg: '&nbsp;'
      };
      socket.emit('is typing', typing_message);
    }

    function onKeyDownNotEnter(){
      if (typing == false) {
        typing = true;
        var typing_message = {
          user: $("#user-name").text(),
          msg: ' is typing'
        };
        socket.emit('is typing', typing_message);
        timeout = setTimeout(timeoutFunction, 750);
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(timeoutFunction, 750);
      }
    }


});


function scrollToBottom(){
  var objDiv = document.getElementById("chatbox");
  objDiv.scrollTop = objDiv.scrollHeight;
}
