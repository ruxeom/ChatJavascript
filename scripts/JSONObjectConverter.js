function JSONObjectConverter() {
	this.counter = 1;
	$.extend(this, {
		"createJSONLogin": function(nickname) {
			if(nickname === undefined) {
				nickname = "User"+this.counter;
				this.counter++;
			}
			var loginobj = {};
			loginobj.To = "NickBot";
			loginobj.Message = nickname;
			var messagestring = JSON.stringify(loginobj);
			return messagestring;
		},
		"createJSONMessage": function(to, message) {
			if(to === undefined) {
				return;
			}
			var messageobj = {};
			messageobj.To = to;
			messageobj.Message = message;
			var messagestring = JSON.stringify(messageobj);
			return messagestring;
		},
		"createGroupValidationMessage": function(message) {
			var groupvalidation = {};
			groupobj.To = "GroupBot";
			groupobj.Message = message;
			var messageobj = JSON.stringify(groupobj);
			return messageobj;
		},
		"validateMessage": function (jsonobj) {
			var validObject = this.validator(jsonobj);
			if(validObject) {
				return validObject;
			}
		}
	}
	);
	var isTest = test;
	this.schema;
	if(isTest) {
		this.schema = {
		"To": "string",
    	"Message": "string" 
		}
	}
	else {
		this.schema = {
		"From": "string",
    	"Message": "string" 
		}
	}
	this.validator = JSONValidator(this.schema);
}