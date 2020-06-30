const chatForm = $("#chat-form");
const chatMessages = $(".chat-messages");
const roomName = $("#room-name");
var trix = document.querySelector("trix-editor")
const socket = io();

socket.on("message", (message) => {
  //console.log(message.text);
  outputsMessage(message);
});

$(".openSideBar").on("click", function (e) {
  $(".chat-sidebar").css("display", "block");
  $(".closeSideBar").css("display", "block");
  $(".openSideBar").css("display", "none");
});

$(".closeSideBar").on("click", function (e) {
  $(".openSideBar").css("display", "inline");
  $(".closeSideBar").css("display", "none");
  $(".chat-sidebar").css("display", "none");
});

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

socket.on("formattedMessage", (message) => {
  chatMessages.append(message)
  chatMessages.scrollTop(chatMessages.get(0).scrollHeight);
});
//If user uploads the file get it..inside attachment variable
//Disable from further upload..!!
var attachment;
var temp;
var cc = 0;

document.addEventListener("trix-file-accept", function (event) {
  if (cc != 0) {
    event.preventDefault();
    alert("Can't add more than 1 image...");
  }
  cc += 1
});
document.addEventListener("trix-attachment-add", function (event) {
  attachment = event.attachment;
  if (attachment.file) {
    // console.log(attachment.file)
    $(".trix-button--icon-attach").attr("disabled", true);
  }
});

document.addEventListener("trix-attachment-remove", function (event) {
  attachment = "";
  cc = 0;
  $(".trix-button--icon-attach").attr("disabled", false);
});

// Message submit to backend
chatForm.on("submit", function (e) {
  e.preventDefault();
  var file, fileName, fileType, leftContent, rightContent, msg;
  $(".trix-button--icon-attach").attr("disabled", false);

  //Get The File From User
  if (attachment) {
    file = attachment.file;
    fileName = attachment.file.name;
    fileType = attachment.file.type.split('/')[0];
    leftContent = $("trix-editor").html().split('<span data-trix-cursor-target="left" data-trix-serialize="false">')[0]
    rightContent = $("trix-editor").html().split('<span data-trix-cursor-target="right" data-trix-serialize="false">')[1].substring(8)
    console.log(fileName)
    //Resetting few things after sending the data
    cc = 0;
    attachment = ''
    $('#chat-form')[0].reset();
    // Emit message to server
    socket.emit("chat_message", [file, fileName, fileType, leftContent, rightContent]);
  } else {
    //Only message without atachment
    msg = $('#msg').val()
    //Resetting few things after sending the data
    cc = 0;
    attachment = ''
    $('#chat-form')[0].reset();
    // Emit message to server
    socket.emit("chat_message", [msg]);
  }

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
    if (message.text[1].split(".")[1] != "pdf") {
      chatMessages.append(
        $('<div class="message">').append(
          '<p class="meta">' +
          message.username +
          "  <span>" +
          message.time +
          '</span></p><img src="' +
          message.text[1] +
          '"alt="face" height="100" width="100"><p class="text">' +
          message.text[0] +
          "</p>"
        )
      );
    } else {
      // console.log(message.text[1])
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

//Display Previous Stored messages from database initially
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
      if (url.split(".")[1] == "pdf") {
        items.push(
          '<div class="message"><p class="meta">' +
          item.from +
          "  <span>" +
          item.date +
          '</span></p><iframe src="' +
          url +
          '"width="100%" height="300px"></iframe></div>'
        );
      } else {
        items.push(
          '<div class="message"><p class="meta">' +
          item.from +
          "  <span>" +
          item.date +
          '</span></p><img src="' +
          url +
          '" alt="face" height="100" width="100%"></div>'
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

//If any error ,trigger this
socket.on("alert", (message) => {
  alert(message)
});


// Run On close of the button..!!
function close_window() {
  if (confirm("Leave the discussion?")) {
    window.open("/", _self);
  }
}