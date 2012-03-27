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
	this.logger = new Logger(guimanager.communicator);
}