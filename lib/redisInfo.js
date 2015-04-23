var redis = require('redis');
var _ = require('lodash');

//http://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module
//http://darrenderidder.github.io/talks/ModulePatterns/#/
module.exports = function(config) {
	var module = {};
	var client = redis.createClient(config.port, config.url, {auth_pass: config.key, return_buffers: false});
	
	module.getInfo = function(callback) {
		client.send_command('info', [], function(err,reply) {			
			var result = createRedisInfoObject(reply);			
			callback(result);
		});		
	}		
	return module;	  
}


function createRedisInfoObject(input) {
	var infoObject = {};
	var currentKey = '';
	var infoStrings = input.split("\n").map(function(input) {
		return input.trim();
	});
	for (var i = 0; i < infoStrings.length; i++) {
		var val = infoStrings[i];
		if (val.length == 0) {
			continue;
		}
		
		if (val.indexOf('#') >= 0) {
			currentKey = val.split(' ')[1];
			infoObject[currentKey] = [];
		}
		else {			
			var item = {};
			var splitValue = val.split(':');
			item[splitValue[0]] = splitValue[1]; 
			infoObject[currentKey].push(item);			
		}
		
		
	}
	return infoObject;
	
}