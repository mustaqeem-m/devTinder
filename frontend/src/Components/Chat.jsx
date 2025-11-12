// Chat.jsx — polished UI + reliable socket handling + auto-scroll + typing indicator
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { createSocketConnection } from '../utils/socketClient';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const formatTime = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

export default function Chat() {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const fromUserId = user?._id;
  const profile = user?.profile;
  const [messages, setMessages] = useState([]); // { id, senderId, text, time }
  const [newMessage, setNewMessage] = useState('');
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState({}); // { userId: true }
  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  // fetch chat history + target user in parallel
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    async function fetchAll() {
      try {
        const [chatRes, userRes] = await Promise.all([
          axios.get(`${BASE_URL}/chat/${targetUserId}`, {
            withCredentials: true,
          }),
          axios.get(`${BASE_URL}/profile/${targetUserId}`, {
            withCredentials: true,
          }),
        ]);

        if (!mounted) return;

        // normalize messages
        const raw = chatRes?.data?.messages ?? chatRes?.data ?? [];
        const normalized = (raw || []).map((m) => ({
          id: m._id ?? m.id ?? Math.random().toString(36).slice(2),
          senderId:
            (m.senderId && (m.senderId._id || m.senderId)) ??
            m.fromUserId ??
            null,
          senderName:
            (m.senderId &&
              (m.senderId.firstName || `${m.senderId.firstName ?? ''}`)) ??
            m.fromName ??
            m.firstName ??
            '',
          senderProfile: m.senderProfile ?? m.profile ?? null,
          text: m.text ?? m.message ?? '',
          time:
            m.updatedAt ??
            m.UpdatedAt ??
            m.createdAt ??
            new Date().toISOString(),
        }));

        setMessages(normalized);
        setTargetUser(
          userRes?.data?.data ?? userRes?.data ?? userRes?.data?.user ?? null
        );
      } catch (err) {
        console.error('Failed to fetch chat or user:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (fromUserId && targetUserId) fetchAll();
    else setLoading(false);

    return () => {
      mounted = false;
    };
  }, [fromUserId, targetUserId]);

  // connect socket and handle events
  useEffect(() => {
    if (!fromUserId || !targetUserId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    // join room
    socket.emit('joinChat', { fromUserId, targetUserId });

    // on receive
    socket.on('messageReceived', (payload) => {
      // payload should contain: senderId, firstName, lastName, text, time
      const msg = {
        id: payload._id ?? payload.id ?? Math.random().toString(36).slice(2),
        senderId:
          payload.fromUserId ?? payload.senderId ?? payload.from ?? null,
        senderName:
          (payload.firstName
            ? `${payload.firstName} ${payload.lastName ?? ''}`
            : payload.name) ?? '',
        senderProfile: payload.profile ?? null,
        text: payload.text ?? '',
        time: payload.time ?? payload.createdAt ?? new Date().toISOString(),
      };
      setMessages((prev) => [...prev, msg]);
    });

    // typing indicator
    socket.on('typing', ({ userId }) => {
      setTypingUsers((s) => ({ ...s, [userId]: true }));
    });
    socket.on('stopTyping', ({ userId }) => {
      setTypingUsers((s) => {
        const next = { ...s };
        delete next[userId];
        return next;
      });
    });

    return () => {
      try {
        socket.emit('leaveChat', { fromUserId, targetUserId });
      } catch {}
      socket.disconnect();
      socketRef.current = null;
    };
  }, [fromUserId, targetUserId]);

  // scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  // send message
  const handleSend = async () => {
    if (!newMessage.trim() || !fromUserId) return;
    setSending(true);

    const payload = {
      fromUserId,
      targetUserId,
      text: newMessage.trim(),
      firstName: user?.firstName,
      lastName: user?.lastName,
      profile: profile ?? null,
      time: new Date().toISOString(),
    };

    try {
      // emit socket
      const socket = socketRef.current ?? createSocketConnection();
      socket.emit('sendMessage', payload);

      // optimistic UI: append immediately
      setMessages((prev) => [
        ...prev,
        {
          id: `tmp-${Date.now()}`,
          senderId: fromUserId,
          senderName: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
          senderProfile: profile ?? null,
          text: payload.text,
          time: payload.time,
        },
      ]);
      setNewMessage('');
      // optionally persist via API (if your backend needs it)
      try {
        await axios.post(`${BASE_URL}/chat/send`, payload, {
          withCredentials: true,
        });
      } catch (err) {
        // if persistence fails, you may want to show a toast or retry
        console.warn('Failed to persist chat via REST:', err);
      }
    } catch (err) {
      console.error('failed to send', err);
    } finally {
      setSending(false);
    }
  };

  // typing emit (debounced)
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    if (newMessage.trim()) {
      socket.emit('typing', { userId: fromUserId });
    } else {
      socket.emit('stopTyping', { userId: fromUserId });
    }
    const t = setTimeout(() => {
      if (socket) socket.emit('stopTyping', { userId: fromUserId });
    }, 1500);
    return () => clearTimeout(t);
  }, [newMessage, fromUserId]);

  // small helper to decide if message is mine
  const isMine = (m) => {
    if (!m) return false;
    const sid = (m.senderId && (m.senderId._id || m.senderId)) ?? m.senderId;
    return String(sid) === String(fromUserId);
  };

  return (
    <div className="max-w-4xl mx-auto h-[78vh] flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-white/6 shadow-lg">
      {/* Header */}
      <header className="flex items-center gap-4 px-4 py-3 border-b border-white/6 bg-gradient-to-b from-slate-900/60 to-transparent">
        <div className="flex items-center gap-3">
          <img
            src={targetUser?.profile ?? '/fallback-avatar.png'}
            alt={targetUser ? `${targetUser.firstName} avatar` : 'User avatar'}
            className="w-12 h-12 rounded-full object-cover border border-white/6"
            onError={(e) => (e.currentTarget.src = '/fallback-avatar.png')}
          />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-white">
            {targetUser
              ? `${targetUser.firstName} ${targetUser.lastName}`
              : 'Chat'}
          </div>
          <div className="text-xs text-slate-400">
            {typingUsers[targetUserId]
              ? 'typing…'
              : `${messages.length} messages`}
          </div>
        </div>
      </header>

      {/* Messages */}
      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gradient-to-b from-transparent to-slate-900/10"
        aria-live="polite"
      >
        {loading ? (
          <div className="w-full flex items-center justify-center">
            <div className="text-slate-400">Loading chat…</div>
          </div>
        ) : (
          <>
            {messages.length === 0 && (
              <div className="w-full text-center text-slate-400">
                No messages yet — say hi 👋
              </div>
            )}

            {messages.map((m, idx) => {
              const mine = isMine(m);
              return (
                <div
                  key={m.id ?? idx}
                  className={`flex ${
                    mine ? 'justify-end' : 'justify-start'
                  } items-end`}
                >
                  {!mine && (
                    <img
                      src={
                        m.senderProfile ??
                        targetUser?.profile ??
                        '/fallback-avatar.png'
                      }
                      alt={m.senderName ?? 'avatar'}
                      className="w-9 h-9 rounded-full object-cover mr-3"
                      onError={(e) =>
                        (e.currentTarget.src = '/fallback-avatar.png')
                      }
                    />
                  )}

                  <div className="max-w-[78%]">
                    <div
                      className={`text-xs ${
                        mine
                          ? 'text-right text-slate-300'
                          : 'text-left text-slate-400'
                      } mb-1`}
                    >
                      {!mine && (
                        <span className="font-medium text-white mr-2">
                          {m.senderName}
                        </span>
                      )}
                      <span className="opacity-60 ml-1">
                        {formatTime(m.time)}
                      </span>
                    </div>

                    <div
                      className={`px-4 py-2 rounded-2xl break-words ${
                        mine
                          ? 'bg-emerald-500 text-slate-900 rounded-br-none'
                          : 'bg-slate-800 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>

                  {mine && (
                    <img
                      src={profile ?? '/fallback-avatar.png'}
                      alt="you"
                      className="w-9 h-9 rounded-full object-cover ml-3"
                      onError={(e) =>
                        (e.currentTarget.src = '/fallback-avatar.png')
                      }
                    />
                  )}
                </div>
              );
            })}
          </>
        )}
      </main>

      {/* Typing indicator small */}
      <div className="px-4 pb-2">
        {Object.keys(typingUsers).length > 0 && (
          <div className="text-xs text-slate-400 italic">
            {Object.keys(typingUsers)
              .filter((id) => id !== fromUserId)
              .map((id) =>
                id === targetUserId
                  ? targetUser?.firstName ?? 'Someone'
                  : 'Someone'
              )
              .join(', ')}{' '}
            typing…
          </div>
        )}
      </div>

      {/* Input area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-3 px-4 py-4 border-t border-white/6 bg-slate-900"
      >
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={`Message ${targetUser?.firstName ?? 'user'}…`}
          className="flex-1 min-h-[44px] max-h-36 resize-none bg-slate-800 text-slate-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              // quick emoji: append a smile emoji for fun
              setNewMessage((s) => s + ' 🙂');
            }}
            className="p-2 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700"
            title="Emoji"
          >
            😊
          </button>

          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              !newMessage.trim() || sending
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-500 text-slate-900 hover:brightness-95'
            }`}
          >
            {sending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
