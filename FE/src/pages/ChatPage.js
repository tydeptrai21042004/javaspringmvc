import React, { useEffect, useState, useRef } from 'react';
import { getChatHistory, sendChatMessage } from '../services/api';
import './ChatPage.css';

export default function ChatPage() {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const chatEndRef = useRef();

  // load & poll
  useEffect(() => {
    refresh();
    const iv = setInterval(refresh, 3000);
    return () => clearInterval(iv);
  }, []);

  function refresh() {
    getChatHistory()
      .then(r => setMsgs(r.data))
      .catch(console.error);
  }

  // scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const send = async e => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await sendChatMessage(text);
      setText('');
      refresh();
    } catch {
      alert('Could not send message—please try again.');
    }
  };

  return (
    <div className="chat-page">
      <header className="chat-header">
        <h2>Support Chat</h2>
      </header>
      <main className="chat-window">
        {msgs.map(m => (
          <div
            key={m.id}
            className={`chat-msg ${m.sender.role==='ROLE_ADMIN'?'admin':'user'}`}
          >
            <div className="bubble">
              {m.content}
            </div>
            <div className="timestamp">
              {new Date(m.sentAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </main>
      <form onSubmit={send} className="chat-form">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type your message…"
        />
        <button type="submit" disabled={!text.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
