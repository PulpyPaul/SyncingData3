'use strict';

var canvas = void 0;
var ctx = void 0;
var socket = void 0;
var hash = void 0;
var draws = [];
var speed = void 0;

var init = function init() {
    speed = 5;

    canvas = document.querySelector('#canvas');
    ctx = canvas.getContext('2d');

    socket = io.connect();

    socket.on('connect', function (data) {
        hash = data.userID;
        draws[hash] = data;
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

        ctx.fillRect(draws.x, draws.y, draws.width, draws.height);
    }
};

// Adjusts user's position based on input
var handleKeyDown = function handleKeyDown(e) {
    var key = e.which;

    var square = draws[hash];

    // W 
    if (key === 87) {
        square.y -= speed;
    }
    // A
    else if (key === 65) {
            square.x -= speed;
        }
        // S 
        else if (key === 83) {
                square.y += speed;
            }
            // D
            else if (key === 68) {
                    square.x += speed;
                }

    socket.emit('movementUpdate', draws);
};

window.onload = init;
