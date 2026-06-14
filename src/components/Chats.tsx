import React, { useState } from 'react';

// --- Types ---
type Message = {
  id: number;
  sender: string;
  text: string;
  time: string;
  isUser: boolean;
};

type Conversation = {
  id: number;
  name: string;
  platform: string;
  lastMessage: string;
  time: string;
};

const Chats: React.FC = () => {
  // Mock data
  const [conversations] = useState<Conversation[]>([
    { id: 1, name: 'Sarah Jenkins', platform: 'Instagram', lastMessage: 'Sure. Reel: $350, Stories: $120. D...', time: '05:34 AM' },
    { id: 2, name: 'TechGuru42', platform: 'YouTube', lastMessage: 'Yes, I\'m available. Please share pr...', time: '02:49 AM' },
  ]);

  const [activeChat] = useState<Message[]>([
    { id: 1, sender: 'Sarah Jenkins', text: 'Hi! I’m interested in your campaign. What deliverables do you need?', time: '04:49 AM', isUser: false },
    { id: 2, sender: 'You', text: 'Hey Sarah! We need 1 Reel + 3 Stories. Can you share your rates?', time: '04:59 AM', isUser: true },
    { id: 3, sender: 'Sarah Jenkins', text: 'Sure. Reel: $350, Stories: $120. Do you need whitelisting?', time: '05:34 AM', isUser: false },
  ]);

  return (
    <div className="flex h-[600px] w-full bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      
      {/* --- Sidebar (Conversations List) --- */}
      <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#0f172a]">Messages</h2>
          <button className="bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-indigo-600">+ New</button>
        </div>
        
        <div className="p-3">
          <input type="text" placeholder="Search conversations..." className="w-full p-2 border border-gray-200 rounded-lg text-sm" />
          <label className="flex items-center gap-2 mt-3 text-xs text-gray-500">
            <input type="checkbox" checked readOnly className="rounded" /> Auto-reply simulation (incoming messages)
          </label>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div key={conv.id} className="p-4 border-b border-gray-50 hover:bg-orange-50 cursor-pointer transition">
              <div className="flex justify-between items-start">
                <span className="font-bold text-sm">{conv.name}</span>
                <span className="text-[10px] text-gray-400">{conv.time}</span>
              </div>
              <p className="text-xs text-gray-500 truncate mt-1">{conv.lastMessage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- Chat Window --- */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border flex items-center justify-center text-rose-500 border-rose-200">📷</div>
          <div>
            <h3 className="font-bold text-sm">Sarah Jenkins</h3>
            <p className="text-[10px] text-gray-400 uppercase">Platform: Instagram</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {activeChat.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${msg.isUser ? 'bg-orange-100 text-gray-800' : 'bg-gray-100 text-gray-800'}`}>
                {msg.text}
              </div>
              <span className="text-[10px] text-gray-400 mt-1">{msg.time}</span>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-2">
            <button className="text-gray-400 p-2">📎</button>
            <input type="text" placeholder="Type a message..." className="flex-1 text-sm focus:outline-none" />
            <button className="text-gray-400 p-2">➤</button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">Tip: You can send text, an attachment, or both. Attachments are limited for browser storage.</p>
        </div>
      </div>
    </div>
  );
};

export default Chats;