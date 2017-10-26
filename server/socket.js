const xxh = require('xxhashjs');

// socket io instance
let io;

let square;
let character;
const drawData = {};

const updatePosition = (obj) => {
  character = obj;

  character.y += 5;

  if (character.moveLeft === true) {
    character.x -= 5;
  } else if (character.moveRight === true) {
    character.x += 5;
  }

  if (character.x + character.width > 500) {
    character.x = 500 - character.width;
  }

  if (character.y + character.height > 500) {
    character.y = 500 - character.height;
  }
    
  if (character.x < 0) {
    character.x = 0;
  }
    
  if (character.y < 0) {
    character.y = 0;
  }

  return character;
};

// setup socket server
const setupSockets = (ioInstance) => {
  io = ioInstance;

  io.sockets.on('connection', (sock) => {
    const socket = sock;

    socket.join('room1');

    // taken from previous assignment, creates unique hash for user
    const hash = xxh.h32(`${socket.id}${new Date().getTime()}`, 0xCAFEBABE).toString(16);

    // user's square object
    square = { x: 0, y: 0, width: 50, height: 50, userID: hash, moveLeft: false, moveRight: false };

    io.sockets.in('room1').emit('join', square);

    socket.on('updateMovement', (data) => {
      const updatedSquare = updatePosition(data);
      drawData[data.userID] = updatedSquare;
      io.sockets.in('room1').emit('updateCanvas', drawData);
    });
  });
};


module.exports.setupSockets = setupSockets;
