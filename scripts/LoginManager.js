function LoginManager () {
	this.communicator;
	this.JSONConverter = new JSONObjectConverter();
	$.extend(this, {		
		"openConnection": function(serverurl) {
			if(this.communicator === undefined) {
				this.communicator = new CommunicationManager();
				this.communicator.openConnection(serverurl);
				//in order to remove the listener, the function must be
				//out of the scope :<
				this.communicator.addListener(validateLogin);
			}
		},
		"testNickname": function(nickname) {
			this.communicator.sendMessage(this.JSONConverter.createLoginObject(nickname));
		},
		"removeListener": function() {
			this.communicator.removeListener(validateLogin);
		}
	}
	);
}

