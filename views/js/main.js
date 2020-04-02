const chatForm = $('#chat-form');
const chatMessages = $('.chat-messages');
const roomName = $('#room-name');


const socket = io();

socket.on('message', message => {
  //console.log(message.text);
  outputsMessage(message);
});

// socket.on('welcome', message => {
//   console.log(message);
//   welcomeMessage(message);
// });

// Get room and users
socket.on('roomUsers', ({
  users
}) => {
  $('#users').empty();
  var items = [];
  $.each(users, (i, item) => {
    items.push('<li>' + item.username + '</li>');

  }); // close each()

  $('#users').append(items.join(''));

});

// Message from server
socket.on('messages', message => {
  outputMessage(message);
  chatMessages.scrollTop(chatMessages.get(0).scrollHeight);
});


// Message submit
chatForm.on('submit', function (e) {
  e.preventDefault();

  //Get the input element by ID
  const msg = $('#msg').val()
  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  $('#msg').val('');
  //  e.target.elements.msg.focus();
});

// Current Output messages
function outputMessage(message) {
  chatMessages.append(
    $('<div class="message">').append(
      '<p class="meta">' + message.username + '  <span>' + message.time +
      '</span></p><p class="text">' + message.text + '</p>'));
}

// Previous Stored Output messages
function outputsMessage(message) {
  items = [];
  $.each(message, (i, item) => {
    items.push('<div class="message"><p class="meta">' + item.from + '  <span>' + item.date +
      '</span></p><p class="text">' + item.message + '</p></div>');

  }); // close each()

  chatMessages.append(items.join(''));
}

//Try After Some Time
// // Show A Div For Few Seconds
// function welcomeMessage(message) {
//   chatMessages.append(
//     setTimeout(function() { $('<div class="message">').append(
//       '<p class="meta">' + message.username + '  <span>' + message.time +
//       '</span></p><p class="text">' + message.text + '</p>').fadeOut('fast'); 
//     }, 5000));
// }