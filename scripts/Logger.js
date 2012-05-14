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
			console.log(socket.readyState);
			socket.send(message);
		}
	});
	$.extend(this, {
		"dumpToLog":function(string) {
			var cleanstring = document.createTextNode(string);
			logger.log.append(cleanstring);
		}
	});
}