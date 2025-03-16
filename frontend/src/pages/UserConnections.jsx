import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { UserCircle, UserPlus, UserMinus, AlertCircle, ChevronLeft, Search } from 'lucide-react';

const UserConnections = () => {
  const [userData, setUserData] = useState({ followers: [], following: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('followers');
  const [followLoading, setFollowLoading] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('');
  const { id } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('/api/user/me');
        setCurrentUser(response.data);
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchUserConnections = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/user/get/${id}`);
        setUserData(response.data);
        setUserName(response.data.name || 'User');
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching user data');
        console.error('Error fetching user connections:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserConnections();
  }, [id]);

  const handleFollowToggle = async (userId, event) => {
    // Prevent the click from bubbling up to the parent container
    event.stopPropagation();
    
    if (currentUser && currentUser._id === userId) {
      return;
    }

    setFollowLoading(prev => ({ ...prev, [userId]: true }));
    
    try {
      const response = await axios.post(`/api/user/follow/${userId}`);

      const isFollowing = currentUser?.following?.includes(userId);
      
      if (isFollowing) {
        setCurrentUser(prev => ({
          ...prev,
          following: prev.following.filter(id => id !== userId)
        }));

        if (id === userId) {
          setUserData(prev => ({
            ...prev,
            followers: prev.followers.filter(user => user._id !== currentUser._id)
          }));
        }
      } else {
        setCurrentUser(prev => ({
          ...prev,
          following: [...(prev.following || []), userId]
        }));

        if (id === userId) {
          setUserData(prev => ({
            ...prev,
            followers: [...prev.followers, currentUser]
          }));
        }
      }
      
    } catch (err) {
      console.error('Error toggling follow:', err);
      alert(err.response?.data?.message || 'Failed to follow/unfollow user');
    } finally {
      setFollowLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const navigateToProfile = (userId) => {
    navigate(`/user/${userId}`);
  };

  const isFollowing = (userId) => {
    return currentUser && currentUser.following && currentUser.following.includes(userId);
  };

  const getFilteredUsers = (users) => {
    if (!searchQuery) return users;
    
    return users.filter(user => 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderUserList = (users) => {
    const filteredUsers = getFilteredUsers(users);
    
    if (filteredUsers.length === 0) {
      return (
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-400 text-lg">
            {searchQuery ? 'No matching users found' : 'No users found'}
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredUsers.map((user) => (
          <div 
            key={user._id} 
            className="flex items-center p-5 rounded-xl bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-all duration-300 shadow-lg cursor-pointer"
            onClick={() => navigateToProfile(user._id)}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
              {user.name?.charAt(0).toUpperCase() || <UserCircle size={20} />}
            </div>
            <div className="ml-4 flex-1">
              <h3 className="font-medium text-white text-lg">{user.name}</h3>
              {/* <p className="text-gray-400 text-sm">{user.email}</p> */}
            </div>
            {currentUser && currentUser._id !== user._id && (
              <button
                onClick={(e) => handleFollowToggle(user._id, e)}
                disabled={followLoading[user._id]}
                className={`ml-4 p-2 rounded-lg flex items-center ${
                  isFollowing(user._id)
                    ? 'bg-gray-700 hover:bg-gray-600 text-blue-300'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } transition-colors duration-200`}
              >
                {followLoading[user._id] ? (
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : isFollowing(user._id) ? (
                  <>
                    <UserMinus size={18} className="mr-2" />
                    <span>Unfollow</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={18} className="mr-2" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-white bg-gray-800 px-8 py-4 rounded-lg shadow-xl">
          <div className="flex items-center">
            <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin mr-3"></div>
            <p className="text-lg">Loading user connections...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="bg-red-900 border border-red-700 text-red-200 px-6 py-4 rounded-lg shadow-xl flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-4 p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-white">
            {userName}'s Connections
          </h1>
        </div>
        
        <div className="mb-8">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg py-3 pl-10 pr-4 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="border-b border-gray-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('followers')}
                className={`py-4 px-8 text-center border-b-2 font-medium ${
                  activeTab === 'followers'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                } transition-all duration-200`}
              >
                Followers ({userData.followers?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('following')}
                className={`py-4 px-8 text-center border-b-2 font-medium ${
                  activeTab === 'following'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                } transition-all duration-200`}
              >
                Following ({userData.following?.length || 0})
              </button>
            </nav>
          </div>
        </div>

        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 shadow-xl border border-gray-700">
          {activeTab === 'followers' ? (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-blue-300">People who follow {userName}</h2>
              {renderUserList(userData.followers || [])}
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-blue-300">People {userName} follows</h2>
              {renderUserList(userData.following || [])}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserConnections;