import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createSocketConnection } from '../utils/socketClient';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [targetUser, setTargetUser] = useState(null);
  const fromUserId = user?._id;
  const { firstName, profile } = user;

  const handleSend = () => {
    const socket = createSocketConnection();
    socket.emit('sendMessage', {
      firstName,
      fromUserId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage('');
  };

  const getTargetUser = async (targetUserId) => {
    let res = await axios.get(BASE_URL + `/profile/${targetUserId}`);
    setTargetUser(res.data);
  };

  useEffect(() => {
    getTargetUser(targetUserId);
  }, []);

  useEffect(() => {
    if (!fromUserId) return;
    const socket = createSocketConnection();
    socket.emit('joinChat', { firstName, fromUserId, targetUserId });

    socket.on('messageReceived', ({ firstName, text }) => {
      console.log(firstName + ': ' + text);
      setMessages((messages) => [...messages, { firstName, text }]);
    });

    return () => socket.disconnect();
  }, [firstName, fromUserId, targetUserId]);
  return (
    <div className="w-3/2 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
      <div className="flex-1 overflow-y-scroll items-center border-gray-600 p-5 text-center">
        chat
        <div>
          {messages.map((msg, index) => {
            return (
              <div key={index}>
                <div
                  className={
                    msg.firstName === user.firstName
                      ? 'chat chat-start'
                      : 'chat chat-end'
                  }
                >
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="Tailwind CSS chat bubble component"
                        src={
                          msg.firstName === user.firstName
                            ? profile
                            : targetUser.profile
                        }
                      />
                    </div>
                  </div>
                  <div className="chat-header">
                    {msg.firstName}
                    <time className="text-xs opacity-50">12:45</time>
                  </div>
                  <div className="chat-bubble">{msg.text}</div>
                  <div className="chat-footer opacity-50">Seen</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="border-gray-700 p-5 flex items-center border-t gap-10">
        <input
          className="border-gray-900 rounded-lg bg-black text-white flex-1 py-2"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="type a message..."
        ></input>
        <button className="btn btn-secondary" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
