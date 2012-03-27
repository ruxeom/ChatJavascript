window.onload = function() {
	//Change this to enter "real" mode
	this.test = true;
	//Use a string containing the url of the websocketserver
	this.serverurl = undefined;
	this.login = new LoginManager();
	this.guimanager = new GUIManager();
	guimanager.JSONConverter = login.JSONConverter;
	guimanager.communicator = login.communicator;
	guimanager.createLoginGUI(login);
	login.openConnection(serverurl);
	this.logger = new Logger(guimanager.communicator);
}