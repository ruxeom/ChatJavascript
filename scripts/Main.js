window.onload = function() {
	//Use a string containing the url of the websocketserver
	this.serverurl = "ws://localhost:8889/ws";
	this.test = undefined;
	if(!serverurl) {
		this.test = true;
	}
	this.login = new LoginManager();
	this.guimanager = new GUIManager();
	guimanager.JSONConverter = login.JSONConverter;
	guimanager.communicator = login.communicator;
	guimanager.createLoginGUI(login);
	login.openConnection(serverurl);
	this.logger = new Logger(guimanager.communicator);
}