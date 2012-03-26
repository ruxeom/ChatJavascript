function GUIManager () {
	$.extend(this, {
		"hideLoginGUI":function() {
			$('.login').css('display', 'none');
		},
		"createLoginGUI": function(loginmngr) {
			$('#nickbutton').on("click",function() {
				var nick = $('#nickbox').val();
				if(nick.length > 0) {
					loginmngr.testNickname(nick);
				}
				console.log(nick);
			});
			console.log($('#nickbutton'));
		},
		"createChatGUI": function() {
			this.hideLoginGUI();
			alert('creating chat gui');
		},
		"addChatEvents": function( ){
			$('#addcontactbutton').addEventListener('mousedown', function() {
				alert($('#contactlist').innerHTML());
			},false);
		}
	}
	);	
}