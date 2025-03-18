import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { MessageSquare, Loader, AlertCircle, ArrowLeft } from "lucide-react";

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await axios.get("/api/message/conversations");
        setConversations(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setError(err?.response?.data?.message || "Failed to load conversations");
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Format date to relative time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto mb-4 text-green-400 animate-spin" />
          <p className="text-xl">Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <p className="text-xl mb-4">Error loading conversations</p>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft size={24} className="text-green-400" />
          </button>
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>

        {/* Conversations List */}
        {conversations.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-xl font-medium text-gray-400 mb-2">No Messages Yet</p>
            <p className="text-gray-500 mb-6">Start a conversation with someone</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((convo) => (
              <Link
                to={`/messages/${convo.user._id}`}
                key={convo.user._id}
                className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 flex items-center transition-colors"
              >
                {/* User Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0 mr-4">
                  <span className="text-lg font-bold text-white">
                    {convo.user.name ? convo.user.name.slice(0, 1).toUpperCase() : "?"}
                  </span>
                </div>
                
                {/* Message Preview */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold truncate">{convo.user.name}</h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {formatDate(convo.lastMessage.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm truncate">{convo.lastMessage.content}</p>
                </div>
                
                {/* Unread Badge */}
                {convo.unreadCount > 0 && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                    <span className="text-xs font-bold">{convo.unreadCount}</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversations;