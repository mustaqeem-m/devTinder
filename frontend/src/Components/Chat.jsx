import React from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([{ text: 'hello world' }]);
  return (
    <div className="w-1/2 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
      <div className="flex-1 overflow-y-scroll items-center border-gray-600 p-5">
        chat
        <div>
          {messages.map((msg, index) => {
            return (
              <div key={index}>
                <div className="chat chat-start">
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="Tailwind CSS chat bubble component"
                        src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                      />
                    </div>
                  </div>
                  <div className="chat-header">
                    singam
                    <time className="text-xs opacity-50">12:45</time>
                  </div>
                  <div className="chat-bubble">You were the Chosen One!</div>
                  <div className="chat-footer opacity-50">Delivered</div>
                </div>
                <div className="chat chat-end">
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="Tailwind CSS chat bubble component"
                        src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                      />
                    </div>
                  </div>
                  <div className="chat-header">
                    sagayam
                    <time className="text-xs opacity-50">12:46</time>
                  </div>
                  <div className="chat-bubble">I hate you!</div>
                  <div className="chat-footer opacity-50">Seen at 12:46</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="border-gray-700 p-5 flex items-center border-t gap-10">
        <input className="border-gray-900 rounded-lg bg-black text-white flex-1 py-2"></input>
        <button className="btn btn-secondary">Send</button>
      </div>
    </div>
  );
};

export default Chat;
