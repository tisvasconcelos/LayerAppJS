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

CRUD: every AppLayer.Model has the methods: save(), delete() and read(). They are dummy methods that will work with LayerApp.Sync module (version >= 0.2)

save() and delete() methods trigger an change() event automatically
Defining the behavior after save() (same with delete() method)
<pre>
var x = 0;
model.on("save", function() { x = 1; });
//...
model.save();
// x = 1
</pre>
