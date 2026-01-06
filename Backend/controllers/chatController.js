const { Chat } = require('../model/chat');

const getChatHistory = async (req, res) => {
  const fromUserId = req.user._id;
  const { targetUserId } = req.params;
  try {
    let chat = await Chat.findOne({
      participants: { $all: [fromUserId, targetUserId] },
    }).populate({
      path: 'messages.senderId',
      select: 'firstName lastName profile',
    });

    if (!chat) {
      chat = new Chat({
        participants: [fromUserId, targetUserId],
        messages: [],
      });
    }
    await chat.save();
    res.json(chat);
  } catch (err) {
    console.log({ Error: err.message });
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = {
  getChatHistory,
};
