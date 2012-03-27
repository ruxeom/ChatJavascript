window.onload = function() {
	this.nickname = undefined;
	this.serverurl = undefined;
	this.login = new LoginManager();
	this.validator = JSONValidator(schema, true);
	this.guimanager = new GUIManager();
	guimanager.JSONConverter = login.JSONConverter;
	guimanager.communicator = login.communicator;
	guimanager.createLoginGUI(login);
	login.openConnection(serverurl);
}

var schema = {
	"From": "string",
    "To": "string",
    "Message": "string" 
}

function validateLogin(event) {
//TODO: validate the server login to know if our nickname is validated
//	if(JSONConverter.validator(event.data)){
//		var obj = JSONConverter.parse(event.data);
//		if (obj.From == 'NickBot' && obj.Message == 'Success') {
			login.removeListener(validateLogin);
			//alert('Login successful');
			guimanager.createChatGUI();
//		}
//	}
}

function manageMessage(messageobject) {
	
}