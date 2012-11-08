LayerAppJS
================================

Version: 0.1
LayerAppJS provides Model-View library/framework agnostic structure to javascript applications

DWR (http://directwebremoting.org/) is a Java library that enables Java on the server and JavaScript in a browser to interact and call each other as simply as possible.
Fake DWR is an framework-library-agnostic way to mock DWR methods without the need to create a fake server to mock ajax requests.

Browsers Tested
================================

Firefox stable, Chrome stable


Usage
================================

Step 1: include LayerApp.js script
<pre>
&lt;script src="LayerApp.js" type="text/javascript"&gt;&lt;/script&gt;
</pre>


LayerApp.Model
================================

LayerApp.Model provides a way to store any kind of data in js object with JSON notation and custom events, such as save, delete and read

Creating a dummy model
<pre>
var my_model = new LayerApp.Model();
</pre>

Creating a model with any custom attributes
<pre>
var options = {opt1: 1, opt2: 2};
var my_model = new LayerApp.Model(options);
//my_model.opt1 output 1
</pre>

Setting simple data to model
<pre>
model.set("data1", 1);
//model.data.data1 output 1
</pre>

Getting data from model
<pre>
model.set("data1", 1);
//direct from data attribute
model.data.data1; // output 1
//with getter
model.get("data1"); // output 1
</pre>

Setting json data to model
<pre>
model.set({data1: 1, data2: { deepdata1: 1, deepdata2: 2 }});
//model.data.data2.deepdata1 output 1
</pre>

Check if a certain value in data is present
<pre>
model.set({data1: "peter", data2: "mccalister", data3: {city: "London"}});
model.find_in_data("ETE"); // true
model.find_in_data("londo"); //true
model.find_in_data("other n"; //false
</pre>

CRUD: every AppLayer.Model has an attribute named synchronizer that is an LayerApp.Sync object. It has 3 methods: save(), delete() and read(). These are the methods that iteract with the persitent layer from your application.

Defining the save() implementation (the same for delete() and read())
<pre>
var model = new LayerApp.Model();
model.synchronizer.save = function() {
	$.ajax({
		url: my_url,
		data: my_data,
		success: function(responseText) {
			//do stuff here
		}
	})
}
</pre>

And saving the model
<pre>
model.save();
</pre>

As said before, AppLayer.js is library/framework agnostic so this layer can be implemented, so you can implement with other libraries other than jQuery (the one used in the example)

A required feature in every application is trigger a function (callback) after iteract with persistent layer. By default, AppLayer.js defines that the application works in async mode. To change this:
<pre>
model.async = false;
//or when creating the model
var model = new AppLayer({async: false});
</pre>

To set the callback function for the save() method (the same for delete() and read())
<pre>
model.on("save", function() { // do stuff here; });
//model.on("delete", function() { // do stuff here; });
//model.on("read", function() { // do stuff here; });
</pre>

Now a import part: when in async = false mode, the callback function defined with .on() is automatically triggered. But in async = true mode, you must inform the flow has ended with the method .end(pattern), where pattern is a string with the name from the caller method
<pre>
var model = new LayerApp.Model();
model.synchronizer.save = function() {
	$.ajax({
		url: my_url,
		data: my_data,
		success: function(responseText) {
			//do stuff here
			model.end("save"); //will do another stuff
		}
	})
}
model.on("save", function() { //do another stuff });
model.save();
</pre>

Implementing this way is necessary to keep AppLayer.js library/framework agnostic: it's not possible to get the return from a function, and then execute more code just after finish it, with async calls and without implementing the persistent layer.