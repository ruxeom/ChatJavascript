function JSONObjectConverter() {
	this.counter = 1;
	this.validator;
	$.extend(this, {
		"createLoginObject": function(nickname) {
			if(nickname === undefined) {
				nickname = "User"+this.counter;
				this.counter++;
			}
			var loginobj = {};
			loginobj.To = "NickBot";
			loginobj.Message = nickname;
			console.log(loginobj);
			return loginobj;
		},
		"createMessageObject": function(to, message) {
			if(to === undefined) {
				return;
			}
			var messageobj = {};
			messageobj.To = to;
			messageobj.Message = message;
			console.log(messageobj);
			return messageobj;
		},
		"createGroupMessageObject": function(to, message) {
		}
	}
	);
}