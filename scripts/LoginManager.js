function LoginManager () {
	this.communicator;
	this.JSONConverter = new JSONObjectConverter();
	$.extend(this, {
		"onMessage": function(event) {
			
		},
		"openConnection": function(servername) {
			if(this.communicator === undefined) {
				this.communicator = new CommunicationManager();
				this.communicator.openConnection(servername);
				this.communicator.onMessage = this.onMessage;
			}
		},
		"testNickname": function(nickname) {
			this.communicator.sendMessage(this.JSONConverter.createLoginObject(nickname));
		}, 
	}
	);
}