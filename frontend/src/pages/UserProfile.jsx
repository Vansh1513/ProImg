import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { PinData } from "../context/PinContext";
import PinCard from "../components/PinCard";
import { UserData } from "../context/UserContext";
import { UserCircle, Grid, Users, Heart, Loader, MessageSquare, AlertCircle } from "lucide-react";

const UserProfile = ({ user: loggedInUser }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollow, setIsFollow] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const { followUser } = UserData();
  const { pins, loading: pinsLoading } = PinData();

  // Fetch user data
  async function fetchUser() {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`/api/user/${params.id}`);
      setUser(data);
      
      // Check if logged-in user follows this user
      if (data.followers && loggedInUser && loggedInUser._id) {
        setIsFollow(data.followers.includes(loggedInUser._id));
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setError(error?.response?.data?.message || "Failed to load user profile");
    } finally {
      setLoading(false);
    }
  }


  const followHandler = async () => {
    if (!loggedInUser || !loggedInUser._id) {
      navigate("/login");
      return;
    }
  
    try {
      setFollowLoading(true);
      
      // Optimistically update UI before making API call
      setUser((prevUser) => ({
        ...prevUser,
        followers: isFollow
          ? prevUser.followers.filter((id) => id !== loggedInUser._id)  // Unfollow
          : [...prevUser.followers, loggedInUser._id], // Follow
      }));
      
      setIsFollow(!isFollow);
  
      await followUser(user._id, fetchUser); // Call API
    } catch (error) {
      console.error("Follow error:", error);
    } finally {
      setFollowLoading(false);
    }
  };
  

  // Filter pins safely
  const userPins = pins && user && user._id
    ? pins.filter((pin) => pin.owner === user._id)
    : [];

  // Fetch user data on component mount and when ID changes
  useEffect(() => {
    if (params.id) {
      fetchUser();
    }
  }, [params.id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto mb-4 text-green-400 animate-spin" />
          <p className="text-xl">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <p className="text-xl mb-4">Error loading profile</p>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg mr-2"
          >
            Go Back
          </button>
          <button 
            onClick={() => fetchUser()} 
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // User not found state
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <UserCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-xl mb-4">User not found</p>
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
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Image */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-5xl font-bold text-white">
                {user.name ? user.name.slice(0, 1).toUpperCase() : "?"}
              </span>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">
                {user.name || "Unknown User"}
              </h1>
              <p className="text-gray-300 mb-4">{user.email}</p>
              
              {/* Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4">
                <div className="bg-gray-700 rounded-lg px-4 py-2 flex items-center">
                  <Grid size={18} className="mr-2 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Pins</p>
                    <p className="text-xl font-bold">{userPins.length}</p>
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-lg px-4 py-2 flex items-center">
                  <Users size={18} className="mr-2 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Followers</p>
                    <p className="text-xl font-bold"
                    onClick={() => navigate(`/get/${user._id}`)}
                    >{user.followers ? user.followers.length : 0}</p>
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-lg px-4 py-2 flex items-center">
                  <Heart size={18} className="mr-2 text-green-400" />
                  <div>
                    
                    <p className="text-sm text-gray-400">Following</p>
                    <p className="text-xl font-bold"
                    onClick={() => navigate(`/get/${user._id}`)}
                    >{user.following ? user.following.length : 0}</p>
                  </div>
                </div>
              </div>
              
              {/* Follow Button (only show if not viewing own profile) */}
              {loggedInUser && user._id !== loggedInUser._id && (
                <button
                  onClick={followHandler}
                  disabled={followLoading}
                  className={`${
                    isFollow 
                      ? "bg-gray-700 hover:bg-gray-600" 
                      : "bg-green-600 hover:bg-green-700"
                  } text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2`}
                >
                  {followLoading ? (
                    <Loader size={18} className="animate-spin mr-2" />
                  ) : isFollow ? (
                    <Users size={18} className="mr-2" />
                  ) : (
                    <UserCircle size={18} className="mr-2" />
                  )}
                  {followLoading 
                    ? "Processing..." 
                    : isFollow 
                      ? "Unfollow" 
                      : "Follow"}
                </button>
              
                    
              )}
                  {/* <button
                    onClick={() => navigate(`/chat/${user._id}`)}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Message
                  </button> */}
            </div>
          </div>
        </div>
        
        {/* Pins Section */}
        <div>
          <div className="flex items-center mb-6">
            <Grid className="mr-2 text-green-400" />
            <h2 className="text-2xl font-bold">
              {user._id === loggedInUser?._id ? "Your Pins" : `${user.name}'s Pins`}
            </h2>
          </div>
          
          {pinsLoading ? (
            <div className="flex justify-center py-12">
              <Loader className="w-10 h-10 text-green-400 animate-spin" />
            </div>
          ) : userPins.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {userPins.map((pin) => (
                <PinCard key={pin._id} pin={pin} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <Grid className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-xl font-medium text-gray-400 mb-2">No Pins Yet</p>
              {user._id === loggedInUser?._id ? (
                <>
                  <p className="text-gray-500 mb-6">Start creating and sharing your pins</p>
                  <button 
                    onClick={() => navigate('/create')} 
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Create Pin
                  </button>
                </>
              ) : (
                <p className="text-gray-500">This user hasn't created any pins yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;