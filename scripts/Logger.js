function Logger (communicationmanager) {
	this.log = $('#log');
	communicationmanager.addListener('message', 
		function(e) {
			logger.dumpToLog(e.data+"\n");
			console.log(e.data);
		}
	);
	$.extend(communicationmanager, {
		"sendMessage": function(message) {
			logger.dumpToLog(message);
			console.log(message);
			socket.send(message);
		}
	});
	$.extend(this, {
		"dumpToLog":function(string) {
			logger.log.append(string);
		}
	});
}