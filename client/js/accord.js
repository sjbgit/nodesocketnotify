/**
 * Created by sbunke on 3/27/2015.
 */
angular.module('ui.bootstrap.demo', ['ui.bootstrap']);
angular.module('ui.bootstrap.demo').controller('AccordionDemoCtrl', function ($scope) {


    var socket = io.connect();

    $scope.messages = [];
    $scope.roster = [];
    $scope.name = '';
    $scope.text = '';
    $scope.rangeValue = 50;

    $scope.machineCounters = [];

    $scope.isCollapsed = false;


    socket.on('connect', function () {
        $scope.setName();
    });

    socket.on('counter', function (msg) {
        console.log('received counter message ------------');
        console.log(msg);


        var copiedMsg = angular.copy(msg);

        copiedMsg.isOpen = true;

        //$scope.machineCounters.push(copiedMsg);

        var index = getCounterIndex(msg);

        console.log('returned index ' + index);

        if (index === -1) {
            $scope.machineCounters.push(copiedMsg);
        }
        else {
            $scope.machineCounters[index] = copiedMsg;
        }

        $scope.$apply();

        //$scope.counters[msg.machine] = msg;

        //console.log($scope.counters);

    });

    function getCounterIndex(counter) {
        var index = -1;
        var arrayLength = $scope.machineCounters.length;
        for (var i = 0; i < arrayLength; i++) {
            console.log($scope.machineCounters[i].machine);
            if ($scope.machineCounters[i].machine === counter.machine) {
                index = i;
                break
            }
        }
        return index;
    }


    socket.on('message', function (msg) {
        $scope.messages.push(msg);

        var num = parseFloat(msg.text);

        if (!isNaN(num)) {
            $scope.rangeValue = num;
        }
        //if (msg.name === '/api/notify') {
        //      $scope.rangeValue = msg.text;
        // }
        $scope.$apply();
    });

    socket.on('roster', function (names) {
        $scope.roster = names;
        $scope.$apply();
    });

    $scope.send = function send() {
        console.log('Sending message:', $scope.text);
        socket.emit('message', $scope.text);
        $scope.text = '';
    };

    $scope.setName = function setName() {
        socket.emit('identify', $scope.name);
    };



    /*Accord stuff below*/
    $scope.oneAtATime = true;

    $scope.groups = [
        {
            title: 'Dynamic Group Header - 1',
            content: 'Dynamic Group Body - 1'
        },
        {
            title: 'Dynamic Group Header - 2',
            content: 'Dynamic Group Body - 2'
        }
    ];

    $scope.items = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function() {
        var newItemNo = $scope.items.length + 1;
        $scope.items.push('Item ' + newItemNo);
    };

    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };
});


angular.module('ui.bootstrap.demo').controller('AccordionDemoCtrl1', function ($scope) {


    var socket = io.connect();

    $scope.messages = [];
    $scope.roster = [];
    $scope.name = '';
    $scope.text = '';
    $scope.rangeValue = 50;

    $scope.machineCounters = [];

    $scope.machineCountersObject = {
        machineCounters: []
    };

    $scope.isCollapsed = false;


    socket.on('connect', function () {
        $scope.setName();
    });

    socket.on('counter', function (msg) {
        console.log('received counter message ------------');
        console.log(msg);


        var copiedMsg = angular.copy(msg);




        //$scope.machineCounters.push(copiedMsg);

        var index = getCounterIndex(msg);

        console.log('returned index ' + index);

        if (index === -1) {
            var machineCounterObject = {
                machineCounter: copiedMsg
            };
            $scope.machineCounterObjects.machineCounters.push(machineCounterObject);
        }
        else {
            $scope.machineCounterObjects.machineCounters[index].machineCounter = copiedMsg;
        }

        $scope.$apply();

        //$scope.counters[msg.machine] = msg;

        //console.log($scope.counters);

    });

    function getCounterIndex(counter) {
        var index = -1;
        var arrayLength = $scope.machineCounterObjects.length;
        for (var i = 0; i < arrayLength; i++) {
            console.log($scope.machineCounterObjects[i].machineCounters.machine);
            if ($scope.machineCounterObjects[i].machineCounters.machine === counter.machine) {
                index = i;
                break
            }
        }
        return index;
    }


    socket.on('message', function (msg) {
        $scope.messages.push(msg);

        var num = parseFloat(msg.text);

        if (!isNaN(num)) {
            $scope.rangeValue = num;
        }
        //if (msg.name === '/api/notify') {
        //      $scope.rangeValue = msg.text;
        // }
        $scope.$apply();
    });

    socket.on('roster', function (names) {
        $scope.roster = names;
        $scope.$apply();
    });

    $scope.send = function send() {
        console.log('Sending message:', $scope.text);
        socket.emit('message', $scope.text);
        $scope.text = '';
    };

    $scope.setName = function setName() {
        socket.emit('identify', $scope.name);
    };



    /*Accord stuff below*/
    $scope.oneAtATime = true;

    $scope.groups = [
        {
            title: 'Dynamic Group Header - 1',
            content: 'Dynamic Group Body - 1'
        },
        {
            title: 'Dynamic Group Header - 2',
            content: 'Dynamic Group Body - 2'
        }
    ];

    $scope.items = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function() {
        var newItemNo = $scope.items.length + 1;
        $scope.items.push('Item ' + newItemNo);
    };

    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };
});