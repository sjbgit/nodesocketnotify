/**
 * Created by sbunke on 4/22/2015.
 */
var redis = require('redis');
var config = require('./config');
var _ = require('lodash');

console.log(config);


var client = redis.createClient(config.port, config.url, {auth_pass: config.key, return_buffers: false});

//console.log
/*
 client.set("foo", "bar", function(err, reply) {
 console.log(reply);
 });
 */
client.get("foo",  function(err, reply) {
    console.log(reply);
});

client.send_command(
    'info'
//'info'
    , [], function(err,reply) {

        console.log(reply);
        console.log(typeof reply);
        var infoStrings = reply.split("\n").map(function(input) {
            return input.trim();
        });
        console.log(infoStrings);

        var foundItems = {}

        //var result = info.forEach()
        for (var i = 0, len = infoStrings.length; i < len; i++) {
            var item = infoStrings[i];
            if (item.indexOf('connected_clients') >= 0) {
                foundItems['connected_clients'] = item.split(':')[1];
            }
            if (item.indexOf('used_memory_human') >= 0) {
                foundItems['used_memory_human'] = item.split(':')[1];
            }

            if (item.indexOf('instantaneous_ops_per_sec') >= 0) {
                foundItems['instantaneous_ops_per_sec'] = item.split(':')[1];
            }

            if (item.indexOf('instantaneous_ops_per_sec') >= 0) {
                foundItems['instantaneous_ops_per_sec'] = item.split(':')[1];
            }

            //instantaneous_ops_per_sec

            //used_memory_human
        }

        console.log(foundItems);

        //_.find(info, { 'connected_clients': 1}), 'user')
        //connected_clients
    });




//bingpulseciread01.redis.cache.windows.net


//var host = 'y28pRNjsjZfF5PCKFbu4gtFZen27ZC6hXI5RZyzFCLM=@bingpulseciread01.redis.cache.windows.net';


//{AzureRedisKey}@servicestackdemo.redis.cache.windows.net?ssl=true


//var client = redis.createClient(6379,'bingpulseciread01.redis.cache.windows.net', {auth_pass: 'y28pRNjsjZfF5PCKFbu4gtFZen27ZC6hXI5RZyzFCLM=', return_buffers: true});

//.createClient(6379, host);

//client.send_command('set myKey myValue', null, cb).



console.log('test');

//https://www.datadoghq.com/wp-content/uploads/2013/09/Understanding-the-Top-5-Redis-Performance-Metrics.pdf
//https://gennadny.wordpress.com/category/redis/

//azure nodejs redis chat
//https://github.com/Azure/azure-content/blob/master/articles/web-sites-nodejs-chat-app-socketio.md
//http://azure.microsoft.com/en-us/documentation/articles/web-sites-nodejs-chat-app-socketio/
//http://azure.microsoft.com/en-us/documentation/articles/cache-nodejs-get-started/

//https://github.com/Azure/azure-sdk-for-node
//http://azure.microsoft.com/en-us/documentation/articles/web-sites-nodejs-chat-app-socketio/
//http://azure.microsoft.com/en-us/documentation/articles/cloud-services-nodejs-chat-app-socketio/
//http://azure.microsoft.com/en-us/documentation/articles/web-sites-nodejs-chat-app-socketio/

//http://code.tutsplus.com/tutorials/multi-instance-nodejs-app-in-paas-using-redis-pubsub--cms-22239





