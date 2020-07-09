const chatForm = $("#chat-form");
const chatMessages = $(".chat-messages");
const roomName = $("#room-name");
var trix = document.querySelector("trix-editor")
const socket = io();

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

socket.on("message", (message) => {
  $.each(message, (i, item) => {
    chatMessages.append(item.message)
  });
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
    console.log(rightContent)
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

var toggle=0
var toggle_checker=false
 //vertical icon on hover show delete/copy icon/option
 $(document).on('click','.meta i',function(e){
  if(toggle%2==0){

    $(this).parent().next().attr('id','temp')
    $(this).after('<ul style="float:right;margin-right:10px;" class="toggle">\
    <li class="delete"><i class="fa fa-trash" aria-hidden="true"></i></i>Delete</li>\
    <li class="copy" data-clipboard-target="#temp"><i class="fa fa-copy" aria-hidden="true"></i>Copy</li> \
  </ul>')
  toggle_checker=true

  }
});

$(document).on('click',function(e){
  if(toggle_checker){
      toggle=1
  }
  else{
    $(this).find('p>.toggle').remove();
    toggle=0
    $('#temp').removeAttr('id')
  }
  toggle_checker=false
});


//On click delete the textbox 
$(document).on('click','.delete',function(e){
  console.log('del')
});
//On click copy the textbox text
$(document).on('click','.copy',function(e){
  // console.log($(this).closest('div').children().nextAll()[0]);
  var clipboard = new ClipboardJS('.copy');
    clipboard.on('success', function(e) {
    console.info('Text:', e.text);
    e.clearSelection();
});

clipboard.on('error', function(e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
});
$('#temp').removeAttr('id');

});
$(document).on('mouseup','.copy',function(e){
  e.preventDefault();
  x='<h1 style="margin-left:407px;positon:absolute;z-index: 1;">Copied</h1>'
})

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