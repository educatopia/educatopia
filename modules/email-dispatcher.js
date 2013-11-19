// ---- module dependencies --------------------- 
var EM = {}
module.exports = EM

// ---- module attributes -----------------------
var mailsettings = {
	host 	 : '',
	user 	 : '',
	password : '',
    sender   : '',
    ssl      : true
}

EM.server = require("emailjs/email").server.connect({
	host 	 : mailsettings.host,
	user 	 : mailsettings.user,
	password : mailsettings.password
    //ssl      : mail.ssl
})

// ---- module exports --------------------------
EM.dispatchRegistrationMail = function(account, callback) {
    var text = "welcome to educatopia\n" +
               "please click the link below!" +
               "http://educatopia.org/profile?email=" + atob(account.email) + "#finish-registration"

	EM.server.send({
		from         : mailsettings.sender,
		to           : account.email,
		subject      : 'educatopia registration',
		text         : text,
		attachment   : []
	}, callback )
}

/* TODO: here is a template that can be built upon for sending HTML emails 
 * look at zurb's ink
EM.composeEmail = function(o) {
	var link = 'http://node-login.braitsch.io/reset-password?e='+o.email+'&p='+o.pass
	var html = "<html><body>"
		html += "Hi "+o.name+",<br><br>"
		html += "Your username is :: <b>"+o.user+"</b><br><br>"
		html += "<a href='"+link+"'>Please click here to reset your password</a><br><br>"
		html += "Cheers,<br>"
		html += "<a href='http://twitter.com/braitsch'>braitsch</a><br><br>"
		html += "</body></html>"
	return  [{data:html, alternative:true}]
}*/
