/*
* 
* JSON schema data validation.
* Requires json.js (http://json.org)
* Author: Maxim Derkachev (max.derkachev@gmail.com)
* http://www.ragbag.ru/2007/05/03/json_validator/lang/en/
* 
Schema is a JSON-compliant string or JavaScript object, is an example of a valid data structure.
Example schemas:
*   '["string", "number"]'
    '["anything", 1]'
    Valid for [], [3], [""], ["something", 4, "foo"]
    Invalid for {}, 1, "", [true], [1, false]

*   {"one": 1, "two": {"three":"string?"}}
    Valid for {one:0, two:{}}, {one:0, two:{three:"something"}}, {one:2, two:{three:""}}
    Invalid for 1, "", [], {}, {one:0}, {one:0, two:{three:1}}, {one:0, two:{}, foo:"bar"}

The following schemas are equivalent:
1. {"a":"there can be a string"}, {"a": "string"}, {"a": ""}
2. {"b":4563}, {"b": 0}, {"b": "number"}

Value types can be defined as:
*  literals of that type, e.g. {} for object, [] for array, 
   1 for number, "anything" for string, null for null, false or true for boolean; 
* "string" for string, "number" for number, "bool" for boolean. In this case you can add "?"
  to indicate that the value can be undefined or null. E.g. "number?" is matched by numbers,
  undefined values and nulls


* API:
// JSON string
var schema = '["string", "number"]'
// or an object:
var schema = ["any string", 1]
var validator = JSONValidator(schema, true);
var isValid = validator(data) // data is a JavaScript object  or a JSON string
// isValid is data or false if invalid.

* If debug parameter is passed to JSONValidator (the second argument) and is true:
  validator = JSONValidator(schema, true);
  And you have Firebug installed, the error is printed to console if validation failed.

* If throwError parameter (the second) is passed to validator function, and it's true,
  then, if an error occured, it will be raised, so you can wrap the call with try .. catch 
  and read the error message:
  try {
    isValid = validator(data, true);
  } catch (e) {
    alert (e.message);
  } 

*/

/*
Software License Agreement (BSD License)

Copyright (c) 2007, Maxim Derkachev.
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:
  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.
  * Neither the name of the Maxim Derkachev nor the names of its contributors
    may be used to endorse or promote products derived from this software
    without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var JSONValidator = (function () {
    
    /* extend is slightly modified YAHOO UI's YAHOO.extend 
     http://developer.yahoo.net/yui/
     */
    var extend = function(subc, superc, overrides) {
        var F = function() {};
        F.prototype=superc.prototype;
        subc.prototype=new F();
        subc.prototype.constructor=subc;
        subc.superclass=superc.prototype;
        if (superc.prototype.constructor == Object.prototype.constructor) {
            superc.prototype.constructor=superc;
        }
    
        if (overrides) {
            for (var i in overrides) {
                subc.prototype[i]=overrides[i];
            }
        }
        return subc;
    };
    
    var JSONValidationError = function (message) {
        this.message = message;
        this.name = "JSONValidationError";
    };
    
    var getType = function (value, lookInStrings) {
        switch (typeof(value)) {
            case "undefined":
                return ["null", false];
            case "boolean":
                return ["bool", true];
            case "number":
                return ["number", true];
            case "object":
                if (value === null) {
                    return ["null", false];
                }
                if (value instanceof Array) {
                    return ["array", true];
                }            
                return ["object", true];
            case "string":
                if (!lookInStrings) {
                    return ["string", true];
                }
                // look in string
                required = true;
                switch (value) {
                    case "number?":
                        required = false;
                    case "number":
                        return ["number", required];
                    case "bool?":
                        required = false;
                    case "bool":
                        return ["bool", required];
                    case "string?":
                        required = false;            
                    default:
                        return ["string", required];    
                }
        }
    };
    
    var makeHandler = function () {
        return function (schema, required) {
            this.init(schema, required);
        }
    }
    
    var BaseHandler = makeHandler();
    BaseHandler.prototype = {
        init: function (schema, required) {
            this.required = required;
        },
        validate: function (data, path) {
            if ( (typeof(data) == "undefined" || data === null) && this.required ) {
                throw new JSONValidationError("Required field is missing at "+path);
            }
            return data;
        }
    };
    
    var repr = function (value, _type) {
        if (!_type) {
            var res = getType(value);
            _type = res[0];
        }
        switch(_type) {
            case "null":
                return "null";
            case "string":
            case "number": 
            case "bool":     
                return value;
            default:
                return value.toJSONString();    
        }
    }
    
    var HANDLERS = {
        "string" : extend(makeHandler(), BaseHandler, {
                    validate: function (data, path) {
                        if (!path) {
                            path = "[root]";
                        }
                        data = HANDLERS["string"].superclass.validate.call(this, data, path);
                        if (typeof(data) == "string" || typeof(data) == "undefined" || data === null) {
                            return data;
                        }
                        throw new JSONValidationError("data is not a string at "+path+" ("+repr(data)+")");
                    }
                }),
        "number" : extend(makeHandler(), BaseHandler, {
                    validate: function (data, path) {
                        if (!path) {
                            path = "[root]";
                        }
                        data = HANDLERS["number"].superclass.validate.call(this, data, path);
                        if (typeof(data) == "number" || typeof(data) == "undefined" || data === null) {
                            return data;
                        }
                        throw new JSONValidationError("data is not a number at "+path+" ("+repr(data)+")");
                    }
                }),
        "bool" : extend(makeHandler(), BaseHandler, {
                    validate: function (data, path) {
                        if (!path) {
                            path = "[root]";
                        }
                        data = HANDLERS["bool"].superclass.validate.call(this, data, path);
                        if ( typeof(data) == "boolean" || typeof(data) == "undefined" || data === null) {
                            return data;
                        }
                        throw new JSONValidationError("data is not a boolean at "+path+" ("+repr(data)+")");
                    }
                }),
        "null" : extend(makeHandler(), BaseHandler, {
                    validate: function (data, path) {
                        if (typeof(data) != "undefined" && data !== null) {
                            if (!path) {
                                path = "[root]";
                            }
                            throw new JSONValidationError("data is not null at "+path+" ("+repr(data)+")");
                        }
                        return data;
                    }
                }),
        "object" : extend(makeHandler(), BaseHandler, {
                    init: function (schema, required) {
                        HANDLERS["object"].superclass.init.call(this, schema, required);
                        var handlers = {};
                        var validKeys = {};
                        var key, res;
                        for (key in schema) {
                            if (schema.hasOwnProperty(key)) {
                                res = getValidator(schema[key]);
                                handlers[key] = res[1];
                                validKeys[key] = true;
                            }
                        }
                        this.handlers = handlers;
                        this.validKeys = validKeys;
                    },
                    
                    validate: function (data, path) {
                        if (!path) {
                            path = "[root]";
                        }
                        data = HANDLERS["object"].superclass.validate.call(this, data, path);
                        _type = getType(data);
                        if (typeof(data) != "undefined" && data !== null && _type[0] !== "object") {
                            throw new JSONValidationError("data is not an object ("+repr(data, _type[0])+")")
                        }
                        
                        var key, val, handlers = this.handlers;
                        var lenHandlers = 0;
                        for (key in handlers) {
                            if (handlers.hasOwnProperty(key)) {
                                lenHandlers++;
                                val = data[key];
                                val = handlers[key].validate(val, path+'{"'+key+'":');
                            }
                        }
                        if (lenHandlers) {
                            for (key in data) {
                                if (!data.hasOwnProperty(key)) {
                                    continue;
                                }
                                if (!this.validKeys[key]) {
                                    throw new JSONValidationError("invalid object key at "+path+" ("+ key+")")
                                }
                            }
                        }
                        return data;
                    }
                }),
        "array" : extend(makeHandler(), BaseHandler, {
                    init: function (schema, required) {
                        HANDLERS["array"].superclass.init.call(this, schema, required);
                        var handlers = {};
                        var value, res;
                        for (var i=0;i<schema.length;i++) {
                            value = schema[i];
                            res = getValidator(value);
                            handlers[res[0]] = res[1];
                        }
                        this.handlers = handlers;
                    },
                    
                    validate: function (data, path) {
                        if (!path) {
                            path = "[root]";
                        }
                        data = HANDLERS["array"].superclass.validate.call(this, data, path);
                        if (typeof(data) != "undefined" && data !== null && !(data instanceof Array)) {
                            throw new JSONValidationError("data is not an array ("+repr(data)+")")
                        }
                        path = path + "["
                        var val, res, _type, handler, handlers = this.handlers;
                        if (handlers && data) {
                            for (var i=0; i < data.length; i++) {
                                val = data[i];
                                res = getType(val);
                                handler = handlers[res[0]];
                                if (!handler) {
                                    throw new JSONValidationError("invalid data member in array at "+path+i+": ("+repr(val, res[0])+")")
                                }
                                val = handler.validate(val, path+i+': ')
                            }
                        }
                        return data;
                    }
                })
    };
    
    var getValidator = function (schema) {
        var res = getType(schema, true);
        return [res[0], new HANDLERS[res[0]](schema, res[1])]
    }
    
    return function (schema, debug) {
        var parsedSchema;
        if (typeof(schema) == "string") {
            parsedSchema = schema.parseJSON();
        } else {
            parsedSchema = schema;
        }
        
        if (!parsedSchema) {
            if (debug && window.console) {
                console.log('Invalid schema: '+schema)
            }
            return false;
        }
        
        var res = getValidator(parsedSchema);
        var validator = res[1];
        return function (data, throwError) {
            try {
                    if (typeof(data) == "string") {
                        var parsedData = data.parseJSON();
                        if (parsedData === false) {
                            throw new JSONValidationError("The data is not a valid JSON: "+data)
                        }
                        data = parsedData;
                    }
                    return validator.validate(data);
                } catch (e) {
                    if (debug && window.console) {
                        console.log(e.message);
                    }
                    if (throwError) {
                        throw e;
                    }
                }    
            return false;
        };
    };
})();