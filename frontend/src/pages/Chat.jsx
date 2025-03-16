import React, { useEffect, useState } from "react";
import axios from "axios";

const ChatPage = ({ currentUser }) => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  // Fetch user's chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`/api/chat/${currentUser._id}`);
        setChats(res.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    if (currentUser?._id) fetchChats();
  }, [currentUser]);

  // Fetch messages for a selected chat
  const fetchMessages = async (chatId) => {
    try {
      const res = await axios.get(`/api/message/${chatId}`);
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Handle selecting a chat
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    fetchMessages(chat._id);
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    try {
      const res = await axios.post("/api/message", {
        chatId: selectedChat._id,
        senderId: currentUser._id,
        text: newMessage,
      });
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Chat List */}
      <div className="w-1/3 bg-gray-800 p-4">
        <h2 className="text-white text-xl mb-4">Chats</h2>
        {chats.map((chat) => (
          <div
            key={chat._id}
            className={`p-3 rounded-lg cursor-pointer ${
              selectedChat?._id === chat._id ? "bg-gray-600" : "bg-gray-700"
            }`}
            onClick={() => handleChatSelect(chat)}
          >
            <p className="text-white">Chat ID: {chat._id}</p>
          </div>
        ))}
      </div>

      {/* Message List */}
      <div className="w-2/3 bg-gray-900 p-4 flex flex-col">
        <h2 className="text-white text-xl mb-4">
          {selectedChat ? "Messages" : "Select a chat"}
        </h2>

        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((msg) => (
            <div key={msg._id} className="text-gray-200 mb-2">
              <span>
                <strong>{msg.senderId === currentUser._id ? "You" : "Other"}:</strong> {msg.text}
              </span>
            </div>
          ))}
        </div>

        {selectedChat && (
          <div className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 rounded-lg bg-gray-700 text-white mr-2"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 px-4 py-2 rounded-lg text-white"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
