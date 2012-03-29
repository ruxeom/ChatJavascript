function GUIManager () {
	this.JSONConverter = undefined;
	this.communicator = undefined;
	this.selectedcontact = undefined;
	$.extend(this, {
	    "contactList": new Array(),
	    "blockedContactList": new Array(),
	    "hideLoginGUI": function () {
	        $('.login').css('display', 'none');
	    },
	    "createLoginGUI": function (loginmngr) {
	        var nickbtn = $('#nickbutton');
	        nickbtn.on("click", function () {
	            var nick = $('#nickbox').val();
	            if (nick.length > 0) {
	                loginmngr.testNickname(nick);
	                $('#nickname').text(nick);
	            }
	            console.log(nick);
	        });
	    },
	    "createChatGUI": function () {
	        this.hideLoginGUI();
	        this.addChatEvents();
	    },
	    "sendMessage": function (e) {
	        var input = $('#inputtextarea');
	        if (guimanager.selectedcontact === undefined) {
	            return;
	        }
	        var message = input.val();
	        var to = guimanager.contactList[guimanager.selectedcontact].name;
	        var messageobj = guimanager.JSONConverter.createJSONMessage(to, message);
	        input.val("");
	        guimanager.displayOutgoingMessage(to, message);
	        guimanager.communicator.sendMessage(messageobj);
	    },
	    "addChatEvents": function () {
	        var manager = this;
	        $('#addcontactbutton').on("click", function () {
	            var contact = prompt("Type the contact's name:");
	            if (contact != null && contact.length > 0) {
	                manager.addContact(contact);
	            }
	        });
	        $('#creategroupbutton').on("click", function () {
	            var contactstring = prompt("Type the contacts you want in the group:");
	            if (contactstring != null && contactstring.length > 0) {
	                var contactnames = contactstring.split(" ");
	                var message = this.JSONConverter.createGroupValidationMessage(contactnames);
	                this.communicator.sendMessage(message);
	                if (contact != null && contact.length > 0) {
	                    manager.blockContact(contact);
	                }
	            }
	        });
	        $('#blockcontactbutton').on("click", function () {
	            var contactname = prompt("Type the contact you want to ignore:");
	            guimanager.blockContact(contactname);
	        });
	        this.communicator.addListener('message', guimanager.messageListener);
	        $('#inputtextarea').on("keydown", this.onType);
	        $('#sendbutton').on("click", guimanager.sendMessage);
	        $('#logbutton').on("click",
				function () {
				    $('#log').toggleClass('visible');
				}
			);
	    },
	    "updateUserName": function (nickname) {
	        $('#nickname').text(nickname);
	    },
	    "addContact": function (contactname) {
	        var newcontact = new Contact(contactname);
	        if (this.contactList.length < 1) {
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
	    "blockContact": function (contactname) {
	        this.blockedContactList.push(contactname);
	    },
	    "onType": function (e) {
	        //console.log(e.keyCode);
	        if (e.keyCode == 13) {
	            guimanager.sendMessage();
	        }
	    },
	    "messageListener": function (e) {
	        var obj = guimanager.JSONConverter.validateMessage(e.data);
	        if (obj) {
	            if (test) {
	                //console.log("From "+obj.To+ ":\n"+obj.Message);
	                guimanager.displayIncomingMessage(obj);
	            }
	            else {
	                if (obj.From == 'GroupBot') {
	                    console.log(guimanager.getContactIndex(obj.From, guimanager.contactList));
	                    if (guimanager.getContactIndex(obj.Message, guimanager.contactList) < 0) {
	                        //we will use a "group" as another contact 
	                        //and the server will be in charge of redirecting it
	                        guimanager.addContact(obj.Message);
	                        return;
	                    }
	                }
	                //if contact is blocked, display nothing
	                console.log("blockd: " + guimanager.getContactIndex(obj.From, guimanager.blockedContactList));
	                console.log("blockedlist: " + guimanager.blockedContactList[0]);
	                console.log($.type(obj.From));
	                console.log($.type(guimanager.blockedContactList[0]));
	                console.log("obj.from, blocked[0]" + obj.From == guimanager.blockedContactList[0]);
	                if (guimanager.getBlockedContactIndex(obj.From, guimanager.blockedContactList) > -1) {
	                    return;
	                }
	                //if the contact doesn't exist yet, create it
	                console.log("contact[0] vs blocked[0]: " + guimanager.contactList[0] == guimanager.blockedContactList[0]);
	                console.log("need 2 add: " + guimanager.getContactIndex(obj.From, guimanager.contactList));
	                if (guimanager.getContactIndex(obj.From, guimanager.contactList) < 0) {
	                    guimanager.addContact(obj.From);
	                }
	                //display the message
	                console.log("From " + obj.From + ":\n" + obj.Message);
	                guimanager.displayIncomingMessage(obj);
	            }
	        }
	    },
	    "onContactSelected": function () {
	        //this "this" reffers to the object target of the event, in this case,
	        //the list element target of the click
	        guimanager.selectedcontact = this.id;
	        console.log(guimanager.selectedcontact);
	    },
	    "getContactIndex": function (contactname, contactlist) {
	        for (var i = 0; i < contactlist.length; i++) {
	            if (contactname == contactlist[i].name) {
	                return i;
	            }
	        }
	        return -1;
	    },
	    "getBlockedContactIndex": function (contactname, blockContactlist) {
	        for (var i = 0; i < blockContactlist.length; i++) {
	            if (contactname == blockContactlist[i]) {
	                return i;
	            }
	        }
	        return -1;
	    },
	    "displayIncomingMessage": function (messageobj) {
	        var message = messageobj.Message;
	        var chatlog = $('#contactlog');
	        var span = document.createElement('span');

	        var txtmngr = new textNodeManager(message);
	        var tree = txtmngr.manageText(txtmngr.root);
	        var displaymessage = txtmngr.createDisplayMessage(tree);

	        if (!test) {
	            $(span).text("From " + messageobj.From + ":");
	        }
	        else {
	            $(span).text("From " + messageobj.To + ":");
	        }
	        console.log(message);
	        chatlog.append(span);
	        chatlog.append(document.createElement('br'));
	        chatlog.append(displaymessage);
	        chatlog.append(document.createElement('br'));

	        $("#contactlog").scrollTop($("#contactlog")[0].scrollHeight);
	      
	    },
	    "displayOutgoingMessage": function (to, message) {
	        var chatlog = $('#contactlog');

	        var txtmnger = new textNodeManager(message);
	        var tree = txtmnger.manageText(txtmnger.root);
	        var displaymessage = txtmnger.createDisplayMessage(tree);

	        var span = document.createElement('span');
	        $(span).text("To " + to + ":");
	        chatlog.append(span);
	        chatlog.append(document.createElement('br'));
	        chatlog.append(displaymessage);
	        chatlog.append(document.createElement('br'));

	        $("#contactlog").scrollTop($("#contactlog")[0].scrollHeight);     
	    }
	}
	);	
}