function GUIManager () {
	this.JSONConverter = undefined;
	this.communicator = undefined;
	this.selectedcontact = undefined;
	var that = this;
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
	        });
	    },
	    "createChatGUI": function () {
	        this.hideLoginGUI();
	        this.addChatEvents();
	    },
	    "sendMessage": function (e) {
	        var input = $('#inputtextarea');
	        if (that.selectedcontact === undefined) {
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
					var message = guimanager.JSONConverter.createGroupValidationMessage(contactstring);
	                guimanager.communicator.sendMessage(message);
	            }
	        });
	        $('#blockcontactbutton').on("click", function () {
	            var contactname = prompt("Type the contact you want to ignore:");
	            guimanager.blockContact(contactname);
	        });
	        this.communicator.addListener('message', guimanager.messageListener);
			this.communicator.addListener('close',  function () {
					alert("Connection lost, please refresh");
				}
			);
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
			if(guimanager.getContactIndex(contactname) < 0) {
				var newcontact = new Contact(contactname);
				this.contactList.push(newcontact);
				var list = '<li id="new"></li>';
				$('#contactlist').append(list);
				var newitem = $('#new');
				var id = this.contactList.length-1;
				var str = "contact"+id;
				newitem.attr('id', str);
				newitem.text(contactname);
				newitem.on("click", this.onContactSelected);
				 if (this.contactList.length < 2) {
	            	this.selectedcontact = 0;
					newitem.addClass('selected');
	        	}
			}
	    },
	    "blockContact": function (contactname) {
	        this.blockedContactList.push(contactname);
	    },
	    "onType": function (e) {
	        if (e.keyCode == 13) {
	            guimanager.sendMessage();
	        }
	    },
	    "messageListener": function (e) {
	        var obj = guimanager.JSONConverter.validateMessage(e.data);
	        if (obj) {
	            if (test) {
	                guimanager.displayIncomingMessage(obj);
	            }
	            else {
	                if (obj.From == 'GroupBot') {
	                    //if (guimanager.getContactIndex(obj.Message, guimanager.contactList) < 0) {
	                        //we will use a "group" as another contact 
	                        //and the server will be in charge of redirecting it
	                        guimanager.addContact(obj.Message);
	                        return;
	                    //}
	                }
	                //if contact is blocked, display nothing
	                if (guimanager.getBlockedContactIndex(obj.From) > -1) {
	                    return;
	                }
	                //if the contact doesn't exist yet, create it
	                //else {
	                    guimanager.addContact(obj.From);
	                //}
	                //display the message
	                guimanager.displayIncomingMessage(obj);
	            }
	        }
	    },
		"removeSelectedClass": function() {
			var list = $("ul.main > li");
			for(var i = 0; i < list.length; i++) {
				var li = list[i];
				$(li).removeClass('selected');
			}
		},
	    "onContactSelected": function () {
	        //this "this" reffers to the object target of the event, in this case,
	        //the list element target of the click
			guimanager.removeSelectedClass();
			var contactid = this.id;
			var str = "#"+contactid;
	        guimanager.selectedcontact = contactid.replace("contact","");
			$(str).addClass('selected');
			
	    },
	    "getContactIndex": function (contactname) {
			var contactlist = this.contactList;
	        for (var i = 0; i < contactlist.length; i++) {
	            if (contactname == contactlist[i].name) {
	                return i;
	            }
	        }
	        return -1;
	    },
	    "getBlockedContactIndex": function (contactname) {
			var blockContactList = this.blockedContactList;
	        for (var i = 0; i < blockContactList.length; i++) {
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