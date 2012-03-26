function JSONObjectConverter() {
	this.counter = 1;
	$.extend(this, {
		"createLoginObject": function(nickname) {
			if(nickname === undefined) {
				nickname = "User"+counter;
				counter++;
			}
			var loginobj = {};
			loginobj.To = "NickBot";
			loginobj.Message = nickname;
			console.log(loginobj);
			return loginobj;
			
		}
	}
	);
}