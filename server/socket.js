const xxh = require('xxhashjs');

// socket io instance
let io;

let square;

// setup socket server
const setupSockets = (ioInstance) => {
  io = ioInstance;

  io.sockets.on('connection', (sock) => {
    const socket = sock;

    socket.join('room1');

    // taken from previous assignment, creates unique hash for user
    const hash = xxh.h32(`${socket.id}${new Date().getTime()}`, 0xCAFEBABE).toString(16);

    // user's square object
    square = { x: 0, y: 0, width: 50, height: 50, userID: hash};
          
    io.sockets.in('room1').emit('connect', square);

    socket.on('movementUpdate', (data) => {
      io.sockets.in('room1').emit('updateCanvas', data);
    });
  });
};

module.exports.setupSockets = setupSockets;
