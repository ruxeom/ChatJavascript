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
		"sendMessage": function(e) {
			var input = $('#inputtextarea');
			if(guimanager.selectedcontact === undefined) {
				return;
			}
			var message = input.val();
			var to = guimanager.contactList[guimanager.selectedcontact].name;
			var messageobj = guimanager.JSONConverter.createJSONMessage(to,message);
			input.val("");
			guimanager.displayOutgoingMessage(to, message);
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
			$('#creategroupbutton').on("click", function() {
				var contactstring = prompt("Type the contacts you want in the group:");
				if(contactstring != null && contactstring.length > 0) {
					var contactnames = contactstring.split(" ");
					var message = this.JSONConverter.createGroupValidationMessage(contactnames);
					this.communicator.sendMessage(message);
					if(contact != null && contact.length > 0) {
						manager.blockContact(contact);
					}
				}
			});
			$('#blockcontactbutton').on("click", function () {
				var contactname = prompt("Type the contact you want to ignore:");
				
			});
			this.communicator.addListener('message',guimanager.messageListener);
			$('#inputtextarea').on("keydown", this.onType);	
			$('#sendbutton').on("click", guimanager.sendMessage);
			$('#logbutton').on("click", 
				function() {
					$('#log').toggleClass('visible');
				}
			);
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
					guimanager.displayIncomingMessage(obj);
				}
				else {
					if(obj.From == 'GroupBot') {
						//we will use a "group" as another contact 
						//and the server will be in charge of redirecting it
						guimanager.addContact(obj.Message);
						return;
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
					guimanager.displayIncomingMessage(obj);
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
		"displayIncomingMessage":function(messageobj) {
			var message = messageobj.Message;
			var chatlog = $('#contactlog');
			chatlog.append('<span id="from"></span><br/>');
			chatlog.append('<span id="newspan"></span><br/>');
			$('#newspan').text(message);
			if(test) {
				$('#from').text("From " + messageobj.To + ":");
			}
			else {
				$('#from').text("From " + messageobj.From + ":");
			}
			$('#from').removeAttr('id');
			$('#newspan').removeAttr('id');
		},
		"displayOutgoingMessage": function(to, message) {
			var chatlog = $('#contactlog');
			chatlog.append('<span id="to"></span><br/>');
			chatlog.append('<span id="newspan"></span><br/>');
			$('#newspan').text(message);
			$('#to').text("To " + to + ":");
			$('#to').removeAttr('id');
			$('#newspan').removeAttr('id');
		}
	}
	);	
}