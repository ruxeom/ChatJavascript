function Logger (communicationmanager) {
	this.log = $('#log');
	communicationmanager.addListener('message', 
		function(e) {
			logger.dumpToLog(e.data);
		}
	);
	$.extend(communicationmanager, {
		"sendMessage": function(message) {
			logger.dumpToLog(message);
			socket.send(message);
		}
	});
	$.extend(this, {
		"dumpToLog":function(string) {
			logger.log.append(string);
		}
	});
}