function LoginManager () {
	this.communicator = new CommunicationManager();
	this.JSONConverter = new JSONObjectConverter();
	$.extend(this, {		
		"openConnection": function(serverurl) {
			this.communicator.openConnection(serverurl);
			//in order to remove the listener, the function must be
			//out of the scope :<
			this.communicator.addListener(validateLogin);
		},
		"testNickname": function(nickname) {
			console.log("testing nickname");
			this.communicator.sendMessage(this.JSONConverter.createLoginObject(nickname));
		},
		"removeListener": function(func) {
			this.communicator.removeListener(func);
		}
	}
	);
}

