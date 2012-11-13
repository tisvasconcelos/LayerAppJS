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
		return "LayerApp.Model";
	};
	//creates a fake synchronizer
	this.synchronizer = new LayerApp.Sync();
	this.async = true;

	for(var key in options) {
		this[key] = options[key];
	}

	var events = {
		change : null
	};

	var data = {};

	var binded_to = null;
	
	this.set = function() {
		if(arguments.length==2)
			data[arguments[0]] = arguments[1];
		else if(arguments.length==1 && typeof arguments[0]=="object") {
			for(var key in arguments[0]) {
				data[key] = arguments[0][key];
			}
		}
		return this;
	};

	this.on = function(event_name, fc) {
		events[event_name] = fc;
		return this;
	};

	this.off = function(event_name) {
		events[event_name] = null;
		return this;
	};

	this.trigger = function(event_name) {
		if(typeof events[event_name] === "function")
			events[event_name]();
		return this;
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
		this.synchronizer.save(this);
		if(!this.async && typeof events.save === "function")
			events.save(this);
		else if(!this.async && binded_to!==null) {
			binded_to.render();
		}
		return this;
	};
	this["delete"] = function() {
		this.synchronizer["delete"](this);
		if(!this.async && typeof events["delete"] === "function")
			events["delete"](this);
		else if(!this.async && binded_to!==null) {
			binded_to.render();
		}
		return this;
	};
	this.read = function() {
		this.synchronizer.read(this);
		if(!this.async && typeof events.read === "function")
			events.read(this);
		else if(!this.async && binded_to!==null) {
			binded_to.render();
		}
		return this;
	};
	this.end = function(method) {
		if(typeof events[method] === "function")
			events[method](this);
		if(binded_to!==null) {
			binded_to.render();
		}
	};

	this.binded_to = function(view) {
		binded_to = view;
	}

	this.unbind = function() {
		binded_to = null;
	}

	return this;
	
};


//Dummy methods, noop. Must be implemented for each model
LayerApp.Sync = function() {
	this.save = function() {};
	this["delete"] = function() {};
	this.read = function() {};

};


LayerApp.View = function(options) {

	LayerApp.View.prototype.toString = function() {
		return "LayerApp.View";
	};

	this.element = null;
	var events = { };
	var bind_to = null;

	//dummy method, noop. Must be implemented
	for(var key in options) {
		this[key] = options[key];
	}

	this.set = function(el) {
		this.element = el;
	};

	this.get = function(el) {
		return this.element;
	};

	this.on = function(event_name, fc) {
		events[event_name] = fc;
	};

	this.off = function(event_name) {
		events[event_name] = null;
	};

	this.render = function() {
		if(typeof events.render === "function")
			events.render(this);
		return this;
	};

	this.bind = function(model) {
		if(model.toString() == "LayerApp.Model") {
			bind_to = model;
			model.binded_to(this);
		}
		return this;
	};

	this.unbind = function() {
		bind_to.unbind();
		bind_to = null;
		return this;
	};

	this.binded_to = function() {
		return bind_to;
	};

	this.refresh = function() {
		this.render();
	};

	return this;
};

