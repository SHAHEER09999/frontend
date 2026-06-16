import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

type Message = {
  id: number;
  content: string;
  sender_id?: number;
  is_user?: boolean;
  created_at?: string;
};

type Conversation = {
  id: number;
  updated_at?: string;
  recipient_name?: string;
  last_message?: string;
};

const Chats: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef<number>(0);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const activeConversation = conversations.find(
    (conv) => String(conv.id) === conversationId
  );

  // --- Extract Current User ID from JWT Token ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const payload = JSON.parse(jsonPayload);
        const uid = payload.sub || payload.user_id;
        if (uid) setCurrentUserId(Number(uid));
      } catch (error) {
        console.error("Failed to parse authentication token:", error);
      }
    }
  }, []);

  // --- Auto-scroll helper ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- Polling Step 1: Reload Conversations List Every 3 Seconds ---
  useEffect(() => {
    fetchConversations(); // Initial load

    const conversationInterval = setInterval(() => {
      fetchConversations();
    }, 3000);

    // Clean up interval on component unmount
    return () => clearInterval(conversationInterval);
  }, []);

  // --- Polling Step 2: Reload Messages Every 3 Seconds ---
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      prevMessageCountRef.current = 0;
      return;
    }

    fetchMessages(); // Initial load for newly selected chat

    const messagesInterval = setInterval(() => {
      fetchMessages();
    }, 3000);

    // Clean up interval when chat selection changes or component unmounts
    return () => clearInterval(messagesInterval);
  }, [conversationId]);

  // --- Smart Scroll Control ---
  // Only snaps view down if a new message actually arrives (prevents breaking user scroll-up history)
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      scrollToBottom();
    }
    prevMessageCountRef.current = messages.length;
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/conversations`, {
        headers: {
          Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
          Accept: "application/json"
        }
      });
      setConversations(res.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_URL}/conversations/${conversationId}/messages`,
        {
          headers: {
            Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
            Accept: "application/json"
          },
        }
      );
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !conversationId) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/conversations/${conversationId}/messages`,
        { content: messageText },
        {
          headers: {
            Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
            Accept: "application/json"
          },
        }
      );

      setMessageText("");
      setMessages((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    (conv.recipient_name || `Chat #${conv.id}`)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-140px)] min-h-[550px] w-full bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-md">
      
      {/* --- SIDEBAR: Left Participant List --- */}
      <div className="w-80 border-r border-slate-200 bg-white flex flex-col h-full shrink-0">
        <div className="p-4 bg-white border-b border-slate-100 flex justify-between items-center h-16 shrink-0">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Messages</h2>
          <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-100/70">
            {conversations.length} chats
          </span>
        </div>
        
        <div className="p-3 bg-slate-50/60 border-b border-slate-100 shrink-0">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search chat history..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" 
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Scrollable Threads Container */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-white">
          {filteredConversations.map((conv) => {
            const isActive = conversationId === String(conv.id);
            return (
              <div 
                key={conv.id} 
                onClick={() => navigate(`/User-Dashboard/chats/${conv.id}`)}
                className={`p-4 cursor-pointer transition-all flex items-center gap-3 relative ${
                  isActive ? 'bg-indigo-50/70' : 'hover:bg-slate-50 bg-white'
                }`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600 rounded-r-md" />}
                
                <div className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center shrink-0 border transition-all ${
                  isActive ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 text-slate-600 border-slate-200/60'
                }`}>
                  {(conv.recipient_name || 'U').charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className={`text-sm truncate ${isActive ? 'font-bold text-indigo-900' : 'font-semibold text-slate-800'}`}>
                      {conv.recipient_name || `User #${conv.id}`}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">
                      {conv.updated_at ? new Date(conv.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${isActive ? 'text-indigo-700/80 font-medium' : 'text-slate-400'}`}>
                    {conv.last_message || "No messages shared yet"}
                  </p>
                </div>
              </div>
            );
          })}
          {filteredConversations.length === 0 && (
            <div className="text-center p-8 text-slate-400 text-xs font-medium">No direct conversations found.</div>
          )}
        </div>
      </div>

      {/* --- CHAT DISPLAY AREA: Right Viewport --- */}
      <div className="flex-1 flex flex-col bg-slate-50 h-full min-w-0">
        {conversationId ? (
          <>
            {/* Active Contact Header */}
            <div className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm shadow-slate-100/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm flex items-center justify-center border border-indigo-100">
                  {(activeConversation?.recipient_name || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">
                    {activeConversation?.recipient_name || `Chat Session`}
                  </h3>
                </div>
              </div>
            </div>

            {/* Message Feed Layout */}
            <div className="flex-1 p-6 overflow-y-auto space-y-3.5 bg-slate-50/50">
              {messages.map((msg) => {
                const isCurrentUser = msg.is_user ?? (currentUserId ? msg.sender_id === currentUserId : false); 
                
                return (
                  <div key={msg.id} className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[65%] px-4 py-2.5 text-sm shadow-sm transition-all tracking-wide leading-relaxed ${
                      isCurrentUser 
                        ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-none font-medium border border-indigo-700/30 shadow-indigo-100' 
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-2xl rounded-tl-none shadow-slate-100'
                    }`}>
                      {msg.content}
                    </div>
                    <span className="text-[9px] font-semibold text-slate-400 mt-1.5 px-1 tracking-wider">
                      {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Shelf Area */}
            <div className="p-4 bg-white border-t border-slate-200 shrink-0 shadow-lg shadow-slate-100">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 focus-within:ring-4 focus-within:ring-indigo-500/5 focus-within:border-indigo-500 transition-all">
                <input 
                  type="text" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={`Write your message to ${activeConversation?.recipient_name || 'your partner'}...`} 
                  className="flex-1 text-sm bg-transparent focus:outline-none text-slate-800 px-3 py-1.5" 
                />
                <button 
                  onClick={sendMessage}
                  disabled={!messageText.trim()}
                  className="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-30 disabled:hover:bg-indigo-600 shrink-0 shadow-md shadow-indigo-100"
                >
                  <svg className="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-white">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-3 border border-indigo-100/50 shadow-sm shadow-indigo-50">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-700 tracking-tight">No Conversation Active</p>
            <p className="text-xs text-slate-400 mt-1 max-w-[240px] text-center leading-normal">Choose a conversation from the sidebar menu to begin exchanging direct messages.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;