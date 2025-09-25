const crypto = require('crypto');

const InitializeSocket = (server) => {
  const getSecretRoomId = (fromUserId, targetUserId) => {
    return crypto
      .createHash('sha256')
      .update([fromUserId, targetUserId].sort().join('_'))
      .digest('hex');
  };

  const socket = require('socket.io');
  const io = socket(server, {
    cors: {
      origin: 'http://localhost:5173',
    },
  });

  io.on('connection', (socket) => {
    socket.on('joinChat', ({ firstName, fromUserId, targetUserId }) => {
      const roomId = getSecretRoomId(fromUserId, targetUserId);
      console.log(firstName + ' ' + 'Joined Room!' + roomId);
      socket.join(roomId);
    });
    socket.on(
      'sendMessage',
      ({ firstName, fromUserId, targetUserId, text }) => {
        const roomId = getSecretRoomId(fromUserId, targetUserId);
        console.log(firstName + ': ' + text);
        socket.to(roomId).emit('messageReceived', { firstName, text });
      }
    );
    socket.on('disconnect', () => {});
  });
};

module.exports = InitializeSocket;
