import React, { useEffect, useState, useRef } from 'react';
import {
  listChatUsers,
  getAdminUsers,
  getChatForUser,
  adminReply
} from '../../services/api';
import './AdminChatPage.css';

export default function AdminChatPage() {
  const [users, setUsers]       = useState([]); // {id, username}[]
  const [selected, setSelected] = useState(null);
  const [msgs, setMsgs]         = useState([]);
  const [reply, setReply]       = useState('');
  const chatRef = useRef();

  // 1) load list of all conversing user IDs + full user info
  useEffect(() => {
    Promise.all([ listChatUsers(), getAdminUsers() ])
      .then(([chatRes, usersRes]) => {
        const chattingIds = chatRes.data;            // e.g. [3,5,17]
        const allUsers    = usersRes.data;           // e.g. [{id,username,…},…]
        // keep only those who have chatted
        const chatting   = allUsers.filter(u => chattingIds.includes(u.id));
        setUsers(chatting);
      })
      .catch(console.error);
  }, []);

  // scroll‐to‐bottom whenever msgs change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [msgs]);

  // 2) open a conversation
  const loadConv = id => {
    setSelected(id);
    getChatForUser(id)
      .then(r => setMsgs(r.data))
      .catch(console.error);
  };

  // 3) send a reply
  const send = async e => {
    e.preventDefault();
    if (!reply.trim() || !selected) return;
    try {
      await adminReply(selected, reply);
      setReply('');
      loadConv(selected);  // refresh
    } catch (err) {
      console.error('Reply failed', err);
      alert('Could not send reply—please try again.');
    }
  };

  return (
    <div className="admin-chat-page">
      <aside className="user-list">
        <h3>Conversations</h3>
        <ul>
          {users.map(u => (
            <li
              key={u.id}
              className={selected === u.id ? 'active' : ''}
              onClick={() => loadConv(u.id)}
            >
              {u.username} <span className="badge">#{u.id}</span>
            </li>
          ))}
        </ul>
      </aside>

      <section className="conversation">
        <h3>
          Chat {selected ? `with ${users.find(u => u.id===selected)?.username}` : ''}
        </h3>
        <div className="chat-window" ref={chatRef}>
          {msgs.map(m => (
            <div
              key={m.id}
              className={`chat-msg ${
                m.sender.username === 'admin' ? 'admin' : 'user'
              }`}
            >
              <div className="msg-content">{m.content}</div>
              <div className="msg-meta">
                <span className="msg-sender">{m.sender.username}</span>
                <span className="msg-time">
                  {new Date(m.sentAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
          {!msgs.length && selected && (
            <p className="no-msgs">No messages yet.</p>
          )}
        </div>

        {selected && (
          <form onSubmit={send} className="chat-form">
            <input
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Type your reply…"
            />
            <button type="submit">Send</button>
          </form>
        )}
      </section>
    </div>
  );
}
