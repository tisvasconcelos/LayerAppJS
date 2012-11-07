var LayerApp;

(function () {

	var instance;

	LayerApp = function LayerApp() {

		if (instance) {
			return instance;
		}

		instance = this;

	};
}());

LayerApp.Model = function(options) {

	LayerApp.Model.prototype.toString = function() {
		return "LayerApp Model";
	};
	//creates a fake synchronizer
	this.synchronizer = new LayerApp.Sync();

	for(var key in options) {
		this[key] = options[key];
	}

	var events = {
		change : null
	};

	var data = {};
	var helper = LayerApp.Helpers;

	
	this.set = function() {
		if(arguments.length==2)
			data[arguments[0]] = arguments[1];
		else if(arguments.length==1 && typeof arguments[0]=="object") {
			for(var key in arguments[0]) {
				data[key] = arguments[0][key];
			}
		}
	};

	this.on = function(event_name, fc) {
		if(event_name=="save" || event_name=="delete")
			event_name = "change_" + event_name;
		events[event_name] = fc;
	};

	this.off = function(event_name) {
		events[event_name] = null;
	};

	this.trigger = function(event_name) {
		if(typeof events[event_name] === "function")
			events[event_name]();
	}

	this.get = function(key) {
		return data.key;
	};

	this.data = data;

	this.find_in_data = function(expression) {
		return _find_in_data(this.data, expression);
	};
	var _find_in_data = function(mydata, expression) {
		for(var key in mydata) {
			if(typeof mydata[key]=="object")
				return _find_in_data(mydata[key], expression);
			else if (mydata[key].match(new RegExp(expression, "gi"))) {
				return true;
			}
		}
		return false;
	};

	//wrappers
	this.save = function() {
		this.synchronizer.save();
		if(typeof events.change_save === "function")
			events.change_save();
		return this;
	};
	this["delete"] = function() {
		this.synchronizer["delete"]();
		if(typeof events.change_delete === "function")
			events.change_delete();
		return this;
	};
	this.read = function() {
		this.synchronizer.read();
		return this;
	};
	
};


//Dummy methods, noop. Must be implemented for each model
LayerApp.Sync = function() {
	this.save = function() {};
	this["delete"] = function() {};
	this.read = function() {};
};
/*
LayerApp.View = function(options) {
	var element = null;
	var data = null;
	//dummy method, noop. Must be implemented
	this.render = function() {

	};

	for(var key in options) {
		this[key] = options[key];
	}

	this.set = function(el) {
		element = el;
	};

	this.refresh = function(callback) {
		try {
			this.render();	
		} catch(e) {
			console.log("Erro ao renderizar: " + e);
		}
		if(typeof callback==="function")
			callback.call();
		return this;
	};

	return this;
};
*/
