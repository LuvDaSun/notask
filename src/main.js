/* jshint node: true */

var when = require('when');
var when_node = require('when/node');
var glob = require('glob');
var extend = require('extend');
var path = require('path');

var when_glob = when_node.lift(glob);

var config = {};

var now = new Date();
var taskPromiseKey = '__taskPromise__' + now.valueOf().toString(36) + '___';

module.exports.config = config;
module.exports.run = run;

extend(config, {
	root: process.cwd()
});

function run(name) {
	return find(name).then(function(file){
		var taskModule = require(file);
		var taskFunction = taskModule.task;
		var taskPromise;

		if(taskPromiseKey in taskModule){
			taskPromise = taskModule[taskPromiseKey];
		}
		else{
			taskPromise = promise(taskFunction);
			taskModule[taskPromiseKey] = taskPromise;
		}

		return taskPromise;
	});
}

function promise(fn){
	var str = fn.toString();
	var match = (/\s*function\s*\(\s*(.*)\s*\)/).exec(str);	
	var parameters = match[1] ? match[1].split(/\s*\,\s*/) : [];
	return when.all(parameters.map(run)).spread(fn);
}

function find(name){
	return when_glob('**/' + name + '.task.*', {
		cwd: config.root
	}).then(function(files){
		if(files.length < 1) return when.reject(new Error("found no task with name '" + name + "'"));
		if(files.length > 1) return when.reject(new Error("found mutiple tasks with name '" + name + "'"));
		return path.join(config.root, files[0]);
	});

}


