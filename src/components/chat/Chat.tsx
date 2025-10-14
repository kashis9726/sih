import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { X, Send, User, Search } from 'lucide-react';

interface ChatProps {
  onClose: () => void;
}

const Chat: React.FC<ChatProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { users, getChatRoom, sendMessage, chatRooms } = useApp();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat, chatRooms]);

  const handleSendMessage = () => {
    if (!message.trim() || !activeChat || !user) return;

    const currentUser = users.find(u => u.id === user.id) || user;
    sendMessage(activeChat, {
      senderId: user.id,
      sender: currentUser,
      content: message,
      type: 'text'
    });

    setMessage('');
  };

  const startChat = (otherUserId: string) => {
    if (!user) return;
    
    const room = getChatRoom([user.id, otherUserId]);
    setActiveChat(room.id);
  };

  const activeRoom = activeChat ? chatRooms.find(room => room.id === activeChat) : null;
  const otherParticipant = activeRoom && user 
    ? users.find(u => u.id === activeRoom.participants.find(id => id !== user.id))
    : null;

  const filteredUsers = users.filter(u => 
    u.id !== user?.id && 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (u.role === 'alumni' || u.role === 'admin')
  );

  if (!activeChat) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search mentors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {filteredUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => startChat(u.id)}
                className="w-full p-3 flex items-center space-x-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  {u.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{u.name}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {u.position || (u.role === 'student' && u.startup ? `Startup: ${u.startup}` : u.role)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveChat(null)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ←
          </button>
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {otherParticipant?.name.charAt(0).toUpperCase()}
            </div>
            {otherParticipant?.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 border border-white rounded-full"></div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{otherParticipant?.name}</h3>
            <p className="text-xs text-gray-500">
              {otherParticipant?.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeRoom?.messages.map((msg) => {
          const isMe = msg.senderId === user?.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                isMe 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;