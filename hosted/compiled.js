'use strict';

var canvas = void 0;
var ctx = void 0;
var socket = void 0;
var hash = void 0;
var draws = {};
var speed = void 0;

var init = function init() {
    speed = 5;

    canvas = document.querySelector('#canvas');
    ctx = canvas.getContext('2d');

    socket = io.connect();

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    socket.on('join', function (data) {
        hash = data.userID;
        draws[hash] = data;
        setInterval(update, 20);
    });

    socket.on('updateCanvas', function (data) {
        draws = data;
        draw();
    });
};

// Draws everything in the draw array
var draw = function draw() {

    ctx.clearRect(0, 0, 500, 500);

    var keys = Object.keys(draws);

    for (var i = 0; i < keys.length; i++) {
        var square = draws[keys[i]];

        ctx.fillRect(square.x, square.y, square.width, square.height);
    }
};

var handleKeyDown = function handleKeyDown(e) {
    var key = e.which;

    // A 
    if (key === 65) {
        draws[hash].moveLeft = true;
    }
    // D
    else if (key === 68) {
            draws[hash].moveRight = true;
        }
};

var handleKeyUp = function handleKeyUp(e) {
    var key = e.which;

    // A 
    if (key === 65) {
        draws[hash].moveLeft = false;
    }
    // D
    else if (key === 68) {
            draws[hash].moveRight = false;
        }
};

var update = function update() {
    socket.emit('updateMovement', draws[hash]);
};

window.onload = init;
