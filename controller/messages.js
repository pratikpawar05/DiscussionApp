const moment = require('moment');

//A function which returns an object 
function formatMessage(userName, text) {
    msg=`<div class="message"><p class="meta">${userName} <span>${moment().utcOffset("+05:30").format('MMMM Do YYYY, h:mm:ss a')}</span></p>${text}</div>`
    return msg;
}

function createMessage(userName,message=undefined,{file,fileName,fileType,leftContent,rightContent}={}) {
    var msg,attachment;
    if(message){
        msg=`<div class="message"><p class="meta">${userName} <span>${moment().utcOffset("+05:30").format('MMMM Do YYYY, h:mm:ss a')}</span><i style="float:right;" class="fa fa-ellipsis-v" aria-hidden="true"></i></p>${message}</div>`
       return msg;
    }else{
        if(fileType=='image'){
            attachment=`<div class="message"><p class="meta">${userName} <span>${moment().utcOffset("+05:30").format('MMMM Do YYYY, h:mm:ss a')}</span></p>${leftContent} <img src="storage/image/${fileName}" alt="face" height="200" width="100%">${rightContent}</div>`
        }else{
            attachment=`<div class="message"><p class="meta">${userName} <span>${moment().utcOffset("+05:30").format('MMMM Do YYYY, h:mm:ss a')}</span></p>${leftContent} <iframe src="storage/application/${fileName}" alt="face" height="300" width="100%"></iframe>${rightContent}</div>`
            console.log(attachment)
        }
        return attachment;
    }
}
module.exports = {
    formatMessage,
    createMessage
};