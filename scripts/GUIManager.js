function GUIManager () {
	this.JSONConverter = undefined;
	this.communicator = undefined;
	this.selectedcontact = undefined;
	$.extend(this, {
		"contactList": new Array(),
		"blockedContactList": new Array(),
		"hideLoginGUI":function() {
			$('.login').css('display', 'none');
		},
		"createLoginGUI": function(loginmngr) {
			var nickbtn = $('#nickbutton');
			nickbtn.on("click",function() {
				var nick = $('#nickbox').val();
				if(nick.length > 0) {
					loginmngr.testNickname(nick);
					$('#nickname').text(nick);
				}
				console.log(nick);
			});
		},
		"createChatGUI": function() {
			this.hideLoginGUI();
			this.addChatEvents();
		},
		"sendMessage": function() {
			var input = $('#inputtextarea');
			if(this.selectedcontact === undefined) {
				return;
			}
//			console.log($.type(this.contactList));
			var messageobj = this.JSONConverter.createMessageObject(this.contactList[this.selectedcontact].name, input.val());
			input.val("");
			this.communicator.sendMessage(messageobj);
		},
		"addChatEvents": function(){
			var manager = this;
			$('#addcontactbutton').on("click", function() {
				var contact = prompt("Type the contact's name:");
				if(contact != null && contact.length > 0) {
					alert ('correct username');
					manager.addContact(contact);
				}
			});
			this.communicator.addListener(guimanager.messageListener);
			$('#inputtextarea').on("keydown", this.onType);	
			$('#sendbutton').on("click", this.sendMessage);
		},
		"updateUserName": function(nickname) {
			$('#nickname').text(nickname);
		},
		"addContact": function (contactname) {
			var newcontact = new Contact(contactname);
			if(this.contactList.length < 1) {
				this.selectedcontact = 0;
			}
			this.contactList.push(newcontact);
			var list = '<li id="new"></li>';
			$('#contactlist').append(list);
			var newitem = $('#new');
			newitem.attr('id', this.contactList.length - 1);
			newitem.text(contactname);
			newitem.on("click", this.onContactSelected);
		},
		"blockContact":function(contactname) {
			this.blockedContactList.push(contactname);
		},
		"onType": function(e) {
			//console.log(e.keyCode);
			if(e.keyCode == 13) {
				guimanager.sendMessage();
			}
		},
		"messageListener":function(e) {
			console.log("gui listened to message");
			console.log(e.data);
			
		},
		"onContactSelected": function() {
			//this "this" reffers to the object target of the event, in this case,
			//the list element target of the click
			guimanager.selectedcontact = this.id;
			console.log(guimanager.selectedcontact);
		}
	}
	);	
}