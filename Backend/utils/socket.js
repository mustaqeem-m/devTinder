const crypto = require('crypto');
const { Chat } = require('../model/chat');
const SocketIO = require('socket.io');
const ConnectionRequest = require('../model/request');
const InitializeSocket = (server) => {
  const getSecretRoomId = (fromUserId, targetUserId) => {
    return crypto
      .createHash('sha256')
      .update([fromUserId, targetUserId].sort().join('_'))
      .digest('hex');
  };

  const io = SocketIO(server, {
    cors: {
      origin: 'http://localhost:5173',
    },
  });

  io.on('connection', (socket) => {
    socket.on(
      'joinChat',
      ({ firstName, lastnName, fromUserId, targetUserId }) => {
        const roomId = getSecretRoomId(fromUserId, targetUserId);
        console.log(firstName + ' ' + 'Joined Room!' + roomId);
        socket.join(roomId);
      }
    );

    socket.on(
      'sendMessage',
      async ({ firstName, lastName, fromUserId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomId(fromUserId, targetUserId);
          console.log(firstName + ': ' + text);
          socket.to(roomId).emit('messageReceived', {
            firstName,
            lastName,
            text,
            timeStamp: Date.now(),
          });

          const isConnected = await ConnectionRequest.findOne({
            $or: [
              {
                fromUserId: fromUserId,
                toUserId: targetUserId,
                status: 'accepted',
              },
              {
                fromUserId: targetUserId,
                toUserId: fromUserId,
                status: 'accepted',
              },
            ],
          });
          if (!isConnected) {
            socket.emit('sendError', { message: 'Connection not Found!' });
            return;
          }

          let chat = await Chat.findOne({
            participants: { $all: [fromUserId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [fromUserId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({
            senderId: fromUserId,
            text,
          });

          await chat.save();
        } catch (err) {
          console.log({ Error: err.message });
        }
      }
    );
    socket.on('disconnect', () => {});
  });
};

module.exports = InitializeSocket;
