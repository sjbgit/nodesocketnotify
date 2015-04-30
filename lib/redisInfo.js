var redis = require('redis');
var _ = require('lodash');

//http://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module
//http://darrenderidder.github.io/talks/ModulePatterns/#/

//http://bites.goodeggs.com/posts/export-this/
module.exports = function(config) {
	var module = {};
	//TODO: HAVE TO FIGURE OUT HOW TO RECONNECT IF CONNECTION IS LOST
	var client = redis.createClient(config.port, config.url, {auth_pass: config.key, return_buffers: false});
	/*
	module.getInfo = function(callback) {
		client.send_command('info', [], function(err,reply) {
			var result = createRedisInfoObject(reply);
			result['name'] = config.name;
			result['environment'] = config.environment;
			callback(result);
		});		
	}
	*/
	module.getInfoItems = function(callback) {
		client.send_command('info', [], function(err,reply) {
			var result = createRedisInfoObjectItems(reply);
			result['name'] = config.name;
			result['environment'] = config.environment;
			callback(result);
		});
	}

	return module;
}

function createRedisInfoObjectItems(input) {
	var items = [];
	var infoObject = {};
	var currentKey = '';
	console.log('createRedisInfoObjectItems');
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
			var item = { name: currentKey, values: [], keyValues: []};
			items.push(item);
		}
		else {
			var item = {};
			var splitValue = val.split(':');
			item[splitValue[0]] = splitValue[1];
			items[items.length - 1].keyValues.push([splitValue[0],splitValue[1]]);
			items[items.length - 1].values.push(item);
		}
	}
	infoObject.items = items;
	infoObject['dateTime'] = new Date();
	return infoObject;
}


/* properties on object
function createRedisInfoObjectItems(input) {
	var items = [];
	var infoObject = {};
	var currentKey = '';
	var currentItem = {};
	console.log('createRedisInfoObjectItems');
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
			currentItem = { name: currentKey, values: []};
			items.push(currentItem);
		}
		else {
			//var item = {};
			var splitValue = val.split(':');
			currentItem[splitValue[0]] = splitValue[1];
			//items[items.length - 1].values.push(item);
		}
	}
	infoObject.items = items;
	infoObject['dateTime'] = new Date();
	return infoObject;
}
*/
/* WORKS

function createRedisInfoObjectItems(input) {
	var items = [];
	var infoObject = {};
	var currentKey = '';
	console.log('createRedisInfoObjectItems');
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
			var item = { name: currentKey, values: []};
			items.push(item);
		}
		else {
			var item = {};
			var splitValue = val.split(':');
			item[splitValue[0]] = splitValue[1];
			items[items.length - 1].values.push(item);
		}
	}
	infoObject.items = items;
	infoObject['dateTime'] = new Date();
	return infoObject;
}

*/

/*
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
			currentKey = val.split(' ')[1].toLowerCase();
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
	*/