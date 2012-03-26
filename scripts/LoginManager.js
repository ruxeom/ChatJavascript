function LoginManager () {
	this.communicator;
	this.JSONConverter = new JSONObjectConverter();
	$.extend(this, {
		"onMessage": function(event) {
			console.log('login listened to communicator.onMessage');
			/*
			*/
			//"this" will be the websocket and so the function to be called
			//must be out of the scope
			//console.log(this);
			validateLogin(event.data);
			},
		"openConnection": function(serverurl) {
			if(this.communicator === undefined) {
				this.communicator = new CommunicationManager();
				this.communicator.openConnection(serverurl);
				this.communicator.addListener(this.onMessage);
			}
		},
		"testNickname": function(nickname) {
			this.communicator.sendMessage(this.JSONConverter.createLoginObject(nickname));
		},
		"removeListener": function() {
			this.communicator.removeListener(this.onMesage);
		}
	}
	);
}

