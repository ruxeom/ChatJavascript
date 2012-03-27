function CommunicationManager() {
	$.extend(this, {
		"onMessage": function(event) {
			console.log("received:" + event.data);
		},
		"addListener": function(funcname) {
			socket.addEventListener('message', funcname, false);
		},
		"openConnection": function(serverurl){
			var WEB_SOCKET_SWF_LOCATION = "WebSocketMain.swf";
			if(serverurl === undefined)
				serverurl = "ws://echo.websocket.org/";
			socket = new WebSocket(serverurl);
			this.addListener(this.onMessage);
			console.log('connection established');
		}, 
		"sendMessage": function(message){
			socket.send(message)
			console.log('sent: ' +message);
		},
		"closeConnection": function() {
			socket.close();
			console.log('connection closed');
		},
		"removeListener": function(listener) {
			socket.removeEventListener('message', listener, false);
		}
	});
}
