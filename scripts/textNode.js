function textNode(value, cssClass, id) {
	this.id = id;
	this.cssClass = cssClass;
	this.value = value;
	this.children = [];
	$.extend(this, 
	{
		"addChild":function(value, cssClass, id){
			this.children.push(new textNode(value, cssClass, id));
		}
	}
	);
}

function textNodeManager(text) {
	this.index = 0;
	this.root = new textNode(text, 0, this.index++);
	$.extend(this, {
		
		"manageText":function(node) {
			var boldindex = -1;
			var italicindex = -1;
			var rebold = new RegExp("(.)*\\*(.)*\\*(.)*");
			var reitalic = new RegExp("(.)*_{1}(.)*_{1}(.)*");
			var hasBold, hasItalic = false;
			
			if(hasBold = rebold.test(node.value)) {
				boldindex = text.indexOf('*');
			}
			if(hasItalic = reitalic.test(node.value)) {
				italicindex = text.indexOf('_');
			}
			
			if(hasBold && hasItalic) {
				if(boldindex < italicindex) {
					this.spliceText(node, node.value, '*');
				}
				else {
					this.spliceText(node, node.value, '_');
				}
				for (var i = 0; i < node.children.length; i++) {
					this.manageText(node.children[i]);
				}
			}
			else if(hasBold) {
				this.spliceText(node, node.value, '*');
				for (var i = 0; i < node.children.length; i++) {
					this.manageText(node.children[i]);
				}
			}
			else if (hasItalic) {
				this.spliceText(node, node.value, '_');
				for (var i = 0; i < node.children.length; i++) {
					this.manageText(node.children[i]);
				}
			}
			else {
				//node.cssClass = 0;
			}
			return node;
		},
		"spliceText": function(node, text, char) {
			var spliced = text.split(char,2);
			var rest = text.substring(spliced[0].length + spliced[1].length+2, text.length);
			var cssvalue = 0;
			if(char == '*') {
				cssvalue = 1;
			}
			else if(char =='_') {
				cssvalue = 2;
			}
			if(spliced[0].length > 0) {
				node.addChild(spliced[0], 0, this.index++);
			}
			if(spliced[1].length > 0) {
				node.addChild(spliced[1], cssvalue, this.index++);
			}
			if(rest.length > 0) {
				node.addChild(rest, 0, this.index++);
			}
			node.value = ""; 
		},
		"createDisplayMessage": function (node) {
				var span = this.createSpan(node);
				
				for (var a = 0; a < node.children.length; a++) {
					span.appendChild(this.createDisplayMessage(node.children[a]));
				}
				return span;
			},
		"createSpan": function (node) {
				var span = document.createElement('SPAN');
				var textnode = document.createTextNode(node.value);
				console.log(textnode);
				//$(span).attr('id', node.id);
				span.appendChild(textnode);
				var spanclass = '';
				switch (node.cssClass) 
				{
					case 1: 
						spanclass = 'bold';
						break;
					case 2:
						spanclass = 'italic';
						break;
					default:
						break;
				}
				$(span).addClass(spanclass);
				
				return span;
			}
	});
}