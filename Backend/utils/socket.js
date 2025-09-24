const InitializeSocket = (server) => {
  const socket = require('socket.io');
  const io = socket(server, {
    cors: {
      origin: 'http://localhost:5173',
    },
  });

  io.on('connection', (socket) => {});
};

module.exports = InitializeSocket;
