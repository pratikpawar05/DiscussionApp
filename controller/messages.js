const moment = require('moment');

//A function which returns an object 
function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('MMMM Do YYYY,h:mm a'),
    };
}

function createMessage(userName,message=undefined,{file,fileName,fileType,leftContent,rightContent}={}) {
    var msg,attachment;
    if(message){
        msg=`<div class="message"><p class="meta">${userName} <span>${moment().format('MMMM Do YYYY,h:mm a')}</span></p>${message}</div>`
       return msg;
    }else{
        if(fileType=='image'){
            attachment=`<div class="message"><p class="meta">${userName} <span>${moment().format('MMMM Do YYYY,h:mm a')}</span></p>${leftContent} <img src="storage/image/${fileName}" alt="face" height="200" width="100%">${rightContent}</div>`
        }else{
            attachment=`<div class="message"><p class="meta">${userName} <span>${moment().format('MMMM Do YYYY,h:mm a')}</span></p>${leftContent} <iframe src="storage/application/${fileName}" alt="face" height="300" width="100%">${rightContent}`
            console.log(attachment)
        }
        return attachment;
    }
}
module.exports = {
    formatMessage,
    createMessage
};