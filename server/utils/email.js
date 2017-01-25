var nodeMailer = require('nodemailer');
var config = require('../../config.json');
var helper = require('sendgrid').mail;
var sg = require('sendgrid')( process.env.SENDGRID_API_KEY);


var from_email = new helper.Email(process.env.mailAdd);

function sendMail(to, subject, content) {
    var to_email = new helper.Email(to);
    var subject = subject;
    var content = new helper.Content('text/plain',content);
    var mail = new helper.Mail(from_email, subject, to_email,content);
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });
    sg.API(request, function (error, info) {
        if (error) {
            console.log(error);
            return;
        }
        console.log('Message sent: ' + info.response);
    });
}

module.exports = {

    tokenEmail:  function (to, name, token) {
        var body =" יש להזין אותו בטופס ההרשמה על מנת לסיים את התהליך בהצלחה "+token+ " המפתח שלך הוא "+"https://accountingshoulder.herokuapp.com/#/signUp"+" על מנת להרשם לאתר יש להיכנס אל הקישור הבא "+name+" שלום ";
        sendMail(to, "מפתח הרשמה עבור אפליקצית כתף אל כתף ", body);
    },

    welcomeEmail : function (to, username) {
        var body = ", ברוך הבא "+username+" ברכות על ההצטרפות לשרות החדש שלנו ";
        sendMail(to, "ברכות על הצטרפותך", body);
    },
    recoveryMail :function (to, username, tempPassword){
        var body = tempPassword+" הסיסמא הזמנית שלך היא: "+username+" שלום ";
        sendMail(to, "שחזור סיסמא כתף אל כתף", body);
    },
    changeEmail : function(to, username, token) {
        var body = "הזן אותו בטופס שינוי המייל"+token+"המפתח שלך הוא: "+username+" שלום ";
        sendMail(to, "שחזור סיסמא כתף אל כתף", body);
    }

};
