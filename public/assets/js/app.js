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

    socket.on('connected', function(data){
      data = $(".side-nav p").attr("data-user");
      socket.emit('return username', data);
    });

    socket.on('emit user', function(data){
      // $('<li><span class="user_name">' + data + ' has connected.</span></li>').hide().appendTo('#messages').fadeIn(300);
      $('#user-list').empty();
      for (var i = 0; i < data.length; i++){
        $('#user-list').append('<li>' + data[i] + '</li>');
      }
      console.log('emit user ' + data);
    });





      socket.on('return disconnected user', function(data){
      var user_name = $(".side-nav p").attr("data-user");
      socket.emit('disconnected user', user_name);
    });

    socket.on('emit disconnected user', function(data){
      $('#user-list').empty();
      console.log(data);
      for (var i = 0; i < data.length; i++){
        $('#user-list').append('<li>' + data[i] + '</li>');
      }
      console.log('emit disconnected user ' + data);
    });





    socket.on('chat message', function(new_msg){
      $('<li><span class="user_name">' + new_msg.user + ':</span><div class="bubble"><span class="msg">' + new_msg.msg + '</span></div></li>').hide().appendTo('#messages').fadeIn(300);
      if (new_msg.user != $("#user-name").text()) {
        newMessage();
      }
      // newMessageInChatBox();
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


newMessage = (function newMessage(){
  var oldTitle = document.title;
  var msg = "New message...";
  var timeoutId;
  var blink = function () {document.title = document.title == msg ? ' ' : msg; };
  var clear = function() {
    clearInterval(timeoutId);
    document.title = oldTitle;
    window.onmousemove = null;
    timeoutId = null;
  };
  return function () {
    if (!timeoutId) {
      timeoutId = setInterval(blink, 1000);
      window.onmousemove = clear;
    }
  };
}());



//
// function newMessageInChatBox(){
//   var msg = "You have new messages!";
//   $('<li class="new_message">' + msg + '</li>').hide().prependTo('#messages').fadeIn();
//   $(window).mousemove(function(e){
//     setTimeout(function(){
//       $(".new_message").hide(); }, 2000);
//   });
// }
