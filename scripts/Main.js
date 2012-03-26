window.onload = function() {
	this.serverurl = undefined;
	this.login = new LoginManager();
	this.validator = JSONValidator(schema, true);
	login.onAcknowledged = createGUI;
	login.openConnection(serverurl);
}

var schema = {
	"From": "string",
    "To": "string",
    "Message": "string" 
}

function createGUI() {
//TODO: set visible GUI
	alert('gui created');
}

function validateLogin(eventdata) {
//TODO: validate the server login to know if our nickname is validated
//	if(JSONConverter.validator(eventdata)){
//		var obj = JSONConverter.parse(event.data);
//		if (obj.From == 'NickBot' && obj.Message == 'Success') {
			login.removeListener();
			createGUI();
//		}
//	}
}