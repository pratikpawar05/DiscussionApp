const chatForm = $("#chat-form");
const chatMessages = $(".chat-messages");
const roomName = $("#room-name");

const socket = io();



socket.on("message", (message) => {
  //console.log(message.text);
  outputsMessage(message);
});

// socket.on('welcome', message => {
//   console.log(message);
//   welcomeMessage(message);
// });

// Get room and users
socket.on("roomUsers", ({
  users
}) => {
  $("#users").empty();
  var items = [];
  $.each(users, (i, item) => {
    items.push("<li>" + item.username + "</li>");
  }); // close each()

  $("#users").append(items.join(""));
});

// Message from server
socket.on("messages", (message) => {
  outputMessage(message);
  chatMessages.scrollTop(chatMessages.get(0).scrollHeight);
});

// Message submit
chatForm.on("submit", function (e) {
  e.preventDefault();
  var file = "";
  var fileName = "";
  //Get the input element by ID
  const msg = $("#msg").val();

  //Get The File From User
  var file = document.getElementById("myFile").files[0];
  if (file != undefined) {
    var fileName = document.getElementById("myFile").files[0].name;
  }

  // Emit message to server
  socket.emit("chatMessage", [msg, file, fileName]);
  $("#myFile").val("");
  // Clear input
  $("#msg").val("");
  //  e.target.elements.msg.focus();
});

// Current Output messages
function outputMessage(message) {
  if (message.text.length == 1) {
    chatMessages.append(
      $('<div class="message">').append(
        '<p class="meta">' +
        message.username +
        "  <span>" +
        message.time +
        '</span></p><p class="text">' +
        message.text[0] +
        "</p>"
      )
    );
  } else {
    if (message.text[1].split('.')[1] != 'pdf') {
      chatMessages.append(
        $('<div class="message">').append(
          '<p class="meta">' +
          message.username +
          "  <span>" +
          message.time +
          '</span></p><img src="' +
          message.text[1] +
          '"alt="face" height="100" width="100"><p class="+text+">' +
          message.text[0] +
          "</p>"
        )
      );
    } else {
      console.log(message.text[1])
      chatMessages.append(
        $('<div class="message">').append(
          '<p class="meta">' +
          message.username +
          "<span>" +
          message.time +
          '</span></p><iframe src="' +
          message.text[1] +
          '"width="100%" height="300px"></iframe><p class="+text+">' +
          message.text[0] +
          "</p>"
        )
      );
    }
  }
}

// Previous Stored Output messages
function outputsMessage(message) {
  items = [];
  $.each(message, (i, item) => {
    if (item.message.split("/")[1] != "home") {
      items.push(
        '<div class="message"><p class="meta">' +
        item.from +
        "  <span>" +
        item.date +
        '</span></p><p class="text">' +
        item.message +
        "</p></div>"
      );
    } else {
      var url = item.message.split("/views/")[1];
      if (url.split('.')[1] == 'pdf') {
        items.push(
          '<div class="message"><p class="meta">' +
          item.from +
          "  <span>" +
          item.date +
          '</span></p><iframe src="' +
          url +
          '"width="100%" height="300px"></iframe></div>'
        );
      }
      else{
        items.push(
          '<div class="message"><p class="meta">' +
          item.from +
          "  <span>" +
          item.date +
          '</span></p><img src="' +
          url +
          '" alt="face" height="100" width="100"></div>'
        );
      }

    }
  }); // close each()

  chatMessages.append(items.join(""));
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


// Run On close of the button..!!
function close_window(){
  if (confirm("Leave the discussion?")) {
      window.open('/',_self)
    }
}
