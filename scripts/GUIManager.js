 function GUIManager () {
	this.JSONConverter = undefined;
	this.communicator = undefined;
	this.selectedcontact = undefined;
	
	$.extend(this, {
	    "contactList": new Array(),
	    "blockedContactList": new Array(),
	    "hideLoginGUI": function () {
	        $('.login').css('display', 'none');
			$('#nickbox').unbind('keydown', guimanager.keyPressedLogin);
	    },
	    "createLoginGUI": function (/*loginmngr*/) {
			/*var func = function () {
	            var nick = $('#nickbox').val();
	            if (nick.length > 0) {
	                loginmngr.testNickname(nick);
	                $('#nickname').text(nick);
	            }
	        }*/
	        var nickbtn = $('#nickbutton');
	        nickbtn.on('click', guimanager.testNickname);
			var nickbox = $('#nickbox');
			nickbox.on('keydown', guimanager.keyPressedLogin);
	    },
		"testNickname": function() {
			var nick = $('#nickbox').val();
	        if (nick.length > 0) {
	            login.testNickname(nick);
	            $('#nickname').text(nick);
	        }
		},
	    "createChatGUI": function () {
	        this.hideLoginGUI();
			this.showElements();
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
					alert("Connection lost, please refresh the page");
				}
			);
	        $('#inputtextarea').on("keydown", this.keyPressedChat);
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
			console.log('contact added');
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
					//guimanager.makeOnlyVisibleContact(id);
					console.log('doing it right');
	        	}
				//here we can add a 'color' property for each contact
				return id;
			}
			return null;
	    },
	    "blockContact": function (contactname) {
	        this.blockedContactList.push(contactname);
	    },
	    "keyPressedChat": function (e) {
	        if (e.keyCode == 13) {
	            guimanager.sendMessage();

	        }
	    },
		"keyPressedLogin": function (e) {
			if (e.keyCode == 13) {
				guimanager.testNickname();
			}
		},
	    "messageListener": function (e) {
			
	        var obj = guimanager.JSONConverter.validateMessage(e.data);
	        if (obj) {
	            if (test) {
					//guimanager.addContact(obj.To);
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
	                    //guimanager.addContact(obj.From);
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
			var contactid = this.id;
			var id = contactid.replace("contact","")
			if(id != guimanager.selectedcontact) {
				guimanager.removeSelectedClass();
				
				var str = "#"+contactid;
				guimanager.selectedcontact = id;
				$(str).removeClass('alerted');
				$(str).addClass('selected');
				//guimanager.makeOnlyVisibleContact(id);	
				$("#contactlog").scrollTop($("#contactlog")[0].scrollHeight);	
			}
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
			var from = (test)? messageobj.To : messageobj.From;
			var index = guimanager.getContactIndex(from);
			
			$(span).text("From " + from + ":");
			var p = $(document.createElement('p'));
			p.append(span);
			p.append(document.createElement('br'));
			p.append(displaymessage);
			p.append(document.createElement('br'));
			p.addClass('chatitem c'+index);			
			/*if(index == guimanager.selectedcontact){
				p.addClass('visible');
			}
			else {
				//give the label a "new message" font-color with a css class
				var str = '#contact'+index;
				//$(str).addClass('alerted');
			}*/

			var timeout = setTimeout(function(){
				chatlog.append(p);
	        	$("#contactlog").scrollTop($("#contactlog")[0].scrollHeight);
			}, 1000);
			//chatlog.append(p);
	        //$("#contactlog").scrollTop($("#contactlog")[0].scrollHeight);
	      
	    },
	    "displayOutgoingMessage": function (to, message) {
	        var chatlog = $('#contactlog');

	        var txtmnger = new textNodeManager(message);
	        var tree = txtmnger.manageText(txtmnger.root);
	        var displaymessage = txtmnger.createDisplayMessage(tree);
			
			var p = $(document.createElement('p'));
	        var span = document.createElement('span');
			var index = guimanager.getContactIndex(to);
			
	        $(span).text("To " + to + ":");
	        p.append(span);
	        p.append(document.createElement('br'));
	        p.append(displaymessage);
	        p.append(document.createElement('br'));
			p.addClass("chatitem c"+this.getContactIndex(to));
			
			if(index == guimanager.selectedcontact){
				p.addClass('visible');
			}
			
			var timeout = setTimeout(function(){
				chatlog.append(p);
	        	$("#contactlog").scrollTop($("#contactlog")[0].scrollHeight);
			}, 1000);
			//chatlog.append(p);
	        //$("#contactlog").scrollTop($("#contactlog")[0].scrollHeight);     
	    },
		"showElements": function () {
   			var ele = document.getElementById("chatpanel");
			var ele2 = document.getElementById("contactpanel");
			//var ele3 = document.getElementById("logpanel");
		
			var text = document.getElementById("nickbutton");
		
			/*if (ele.style.display == "block") {
				ele.style.display = "none";
				text.innerHTML = "show";
			}
			if (ele2.style.display == "block") {
				ele2.style.display = "none";
				text.innerHTML = "show";
			}*/
			/*if (ele3.style.display == "block") {
				ele3.style.display = "none";
				text.innerHTML = "show";
			}*/
			//else {
				ele.style.display = "block";
				ele2.style.display = "block";
				//ele3.style.display = "block";
				text.innerHTML = "hide";
			//}*/
		},
		"makeOnlyVisibleContact": function(id) {
			var chatitems = $('.chatitem');
			for(var i = 0; i < chatitems.length; i++) {
				$(chatitems[i]).removeClass('visible');
			}
			
			chatitems = $('.c'+id);
			for(var i = 0; i < chatitems.length; i++) {
				$(chatitems[i]).addClass('visible');
			}
		}
	}
	);	
}