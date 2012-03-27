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
			});
		},
		"createChatGUI": function() {
			this.hideLoginGUI();
			this.addChatEvents();
		},
		"sendMessage": function() {
			var input = $('#inputtextarea');
			if(guimanager.selectedcontact === undefined) {
				return;
			}
			var messageobj = guimanager.JSONConverter.createJSONMessage(
										guimanager.contactList[guimanager.selectedcontact].name, 
										input.val());
			input.val("");
			guimanager.communicator.sendMessage(messageobj);
		},
		"addChatEvents": function(){
			var manager = this;
			$('#addcontactbutton').on("click", function() {
				var contact = prompt("Type the contact's name:");
				if(contact != null && contact.length > 0) {
					manager.addContact(contact);
				}
			});
			this.communicator.addListener('message', guimanager.messageListener);
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
			var obj = guimanager.JSONConverter.validateMessage(e.data);
			if(obj) {
				if(test) {
					//console.log("From "+obj.To+ ":\n"+obj.Message);
					
				}
				else {
					if(obj.From == GroupBot) {
						//we will use a "group" as another contact 
						//and the server will be in charge of redirecting it
						//guimanager.addContact();
					}
					//if contact is blocked, display nothing
					if(guimanager.getContactIndex(obj.From, guimanager.blockedContactList)){
						return;
					}
					//if the contact doesn't exist yet, create it
					if(guimanager.getContactIndex(obj.From, guimanager.contactList)) {
						guimanager.addContact(obj.From);
					}
					//display the message
					console.log("From "+obj.From+ ":\n"+obj.Message);
				}
			}
			
		},
		"onContactSelected": function() {
			//this "this" reffers to the object target of the event, in this case,
			//the list element target of the click
			guimanager.selectedcontact = this.id;
			console.log(guimanager.selectedcontact);
		},
		"getContactIndex": function(contactname, contactlist) {
			for (var i = 0; i < contactlist.length; i++) {
				if(contactname == contactlist[i].name) {
					return i;
				}
			}
			return -1;
		},
		
	}
	);	
}