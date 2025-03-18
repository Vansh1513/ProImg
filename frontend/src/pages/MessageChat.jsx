import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader, AlertCircle, Send } from "lucide-react";

const MessageChat = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!userId) return;
    
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`/api/user/get/${userId}`);
        setUser(data);
      } catch (error) {
        setError("Failed to load user");
      }
    };
    
    fetchUser();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/message/${userId}`);
        setMessages(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load messages");
        setLoading(false);
      }
    };
    
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      await axios.post("/api/message/send", {
        receiverId: userId,
        content: newMessage,
      });
      setMessages([...messages, {
        _id: Date.now().toString(),
        sender: currentUser._id,
        receiver: userId,
        content: newMessage,
        createdAt: new Date().toISOString(),
        read: false,
      }]);
      setNewMessage("");
    } catch {
      setError("Error sending message");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
      <div className="bg-gray-800 p-4 flex items-center border-b border-gray-700">
        <button onClick={() => navigate("/messages")} className="mr-4">
          <ArrowLeft size={24} className="text-green-400" />
        </button>
        {user && (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-3">
              <span className="text-sm font-bold text-white">{user.name?.[0]?.toUpperCase() || "?"}</span>
            </div>
            <h2 className="font-bold">{user.name}</h2>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader className="w-10 h-10 text-green-400 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((message) => (
            <div key={message._id} className={`flex ${message.sender === currentUser._id ? "justify-end" : "justify-start"}`}>
              <div className={`px-4 py-2 rounded-lg max-w-xs md:max-w-md ${message.sender === currentUser._id ? "bg-green-600" : "bg-gray-700"}`}>
                <p>{message.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 bg-gray-800 flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className={`ml-2 p-2 rounded-full ${newMessage.trim() ? "bg-green-600 hover:bg-green-700" : "bg-gray-700 cursor-not-allowed"}`}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageChat;
