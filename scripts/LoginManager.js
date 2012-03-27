function LoginManager () {
	this.communicator = new CommunicationManager();
	this.JSONConverter = new JSONObjectConverter();
	$.extend(this, {		
		"openConnection": function(serverurl) {
			this.communicator.openConnection(serverurl);
			//in order to remove the listener, the function must be
			//out of the scope :<
			this.communicator.addListener('message', login.validateLogin);
		},
		"testNickname": function(nickname) {
			console.log("testing nickname");
			this.communicator.sendMessage(this.JSONConverter.createJSONLogin(nickname));
		},
		"removeListener": function(eventtype, func) {
			this.communicator.removeListener(eventtype, func);
		},
		"validateLogin": function validateLogin(event) {
			if(!test) {
				var jsonobj = login.JSONConverter.validateMessage(event.data)
				if(jsonobj){
					if (jsonobj.From == 'NickBot' && jsonobj.Message == 'Success') {
						login.removeListener('message', login.validateLogin);
						guimanager.createChatGUI();
					}
				}
			}
			else {
				login.removeListener('message', validateLogin);
				guimanager.createChatGUI();
			}
		}
	}
	);
}

