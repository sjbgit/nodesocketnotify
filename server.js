//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var config = require('./config');
var RedisInfo = require('./lib/redisInfo');

var redisHelper = new RedisInfo(config);

setInterval(function() {
    redisHelper.getInfo(function(input) {
        console.log('from get info: ')
        console.log(input);
    })
}, 5000);

/*
redisHelper.getInfo(function(input) {

    console.log('from get info: ')
    console.log(input);
    //console.log(input);
    //console.log(input);
});
*/

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);


var rooms = {};


//Redis
var interval = setInterval(function() {
    redisHelper.getInfo(function(input) {
        broadcast('redis', input);
        console.log(input);
        //console.log('from get info: ')
        //console.log(input);
    })
}, 10000);

//TODO: REMOVE THIS TO GET REDIS ON AN INTERVAL WORKING
clearInterval(interval);



//Try using rooms
var Room = io
    .of('/room')
    .on('connection', function(socket) {
        var joinedRoom = null;
        socket.on('join room', function(data) {
            socket.join(data); //socket is joining room
            joinedRoom = data;
            socket.emit('joined', "you've joined " + data);
            rooms[joinedRoom] = socket;
            socket.broadcast.to(joinedRoom)
                .send('someone joined room');
        });
        socket.on('fromclient', function(data) {
            if (joinedRoom) {
                socket.broadcast.to(joinedRoom).send(data);
            } else {
                socket.send(
                    "you're not joined a room." +
                    "select a room and then push join."
                );
            }
        });
    });

console.log(Room);

/*
router.post('/api/roomsend', function(req, res) {


    var body = req.body;

    var machine = body.machine;

    console.log('machine: ' + machine);

    //var body = req.body;

    //console.log('body: ' + body);

    //var message = body.message;

    //Room.emit('message', message);

    //broadcast('counter', body);

    //res.json({message: message + ' from server'});


});
*/

router.configure(function () {
    router.use(express.static(path.resolve(__dirname, 'client')));
    //router.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
    router.use(express.logger('dev')); 						// log every request to the console
    router.use(express.bodyParser()); 							// pull information from html in POST
    router.use(express.methodOverride()); 						// simulate DELETE and PUT
});

router.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

router.get('/api/notify', function (req, res) {
    res.json({message: 'test message from server'}); // return all todos in JSON format
});

router.post('/api/perftest', function (req, res) {
    res.json({message: 'Perf test - test message from server'}); // return all todos in JSON format
});


router.post('/api/room/:room', function(req, res) {

    var roomName = req.params.room;

    console.log('post to room name: ' + roomName);


    var socket = rooms[roomName];


    socket.broadcast.to(roomName)
        .send('message', 'server message');

    //io.sockets.broadcast.to(roomName).send('server message');

    //var count = Room.sockets.length;
    //console.log(count);


    //Room.sockets.in(roomName).emit('message', 'server message');

    //io.to(roomName).emit('message', 'server message');

    res.json({message: roomName + ' from server'});

});


router.post('/api/roomsend', function(req, res) {

    var body = req.body;

    var message = body.message;

    console.log('message: ' + message);

   //does this go to all rooms?
    Room.emit('message', message);

    //broadcast('counter', body);

    res.json({message: message + ' from server'});


});

//{ event: 'graph', name: 'abc', value: 123 }
router.post('/api/broadcast', function(req, res) {

    var body = req.body;

    var name = body.name;

    broadcast(body.event, body);

    res.json({message: JSON.stringify(body) + ' from server'});


});



router.post('/api/perfcounter', function(req, res) {

    var body = req.body;

    var machine = body.machine;

    broadcast('counter', body);

    res.json({message: machine + ' from server'});


});

router.post('/api/notify', function (req, res) {

    var message = req.body.message;
    var name = req.body.name || '/api/notify';

    var data = {
        name: name,
        text: message
    };


    console.log('broadcast data');
    console.log(data);

    broadcast('message', data);
    messages.push(data);

    console.log('body message');
    console.log(req.body.message);

    res.json({message: message + ' from server'});

});

var messages = [];
var sockets = [];

io.on('connection', function (socket) {
    messages.forEach(function (data) {
        socket.emit('message', data);
    });

    sockets.push(socket);

    socket.on('disconnect', function () {
        sockets.splice(sockets.indexOf(socket), 1);
        updateRoster();
    });

    socket.on('message', function (msg) {
        var text = String(msg || '');

        if (!text)
            return;

        socket.get('name', function (err, name) {
            var data = {
                name: name,
                text: text
            };

            broadcast('message', data);
            messages.push(data);
        });
    });

    socket.on('identify', function (name) {
        socket.set('name', String(name || 'Anonymous'), function (err) {
            updateRoster();
        });
    });
});

function updateRoster() {
    async.map(
        sockets,
        function (socket, callback) {
            socket.get('name', callback);
        },
        function (err, names) {
            broadcast('roster', names);
        }
    );
}

//this should work the same as broadcast
/*
function broadcastAll(event, data) {
    io.emit(event, data);
}
*/

function broadcast(event, data) {
    sockets.forEach(function (socket) {
        socket.emit(event, data);
    });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
    var addr = server.address();
    console.log("Chat server listening at", addr.address + ":" + addr.port);
});
