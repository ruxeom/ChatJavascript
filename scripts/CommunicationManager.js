function CommunicationManager() {
	$.extend(this, {
		"onMessage": function(event) {
			console.log('recieved: '+ event.data);
		},
		"openConnection": function(servername){
			var WEB_SOCKET_SWF_LOCATION = "WebSocketMain.swf";
			if(servername === undefined)
				servername = "ws://echo.websocket.org/";
			socket = new WebSocket(servername);
			socket.onmessage = this.onMessage;
			console.log('connection established');
		}, 
		"sendMessage": function(message){
			socket.send(message)
			console.log('sent: ' +message);
		},
		"closeConnection": function() {
			socket.close();
			console.log('connection closed');
		}
	});
}
