import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PinData } from "../context/PinContext";
import {
  Trash2,
  Edit,
  Send,
  UserCircle,
  Heart,
  Download,
  Share2,
  Clock,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { get } from "mongoose";

const PinPage = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();

  // Get pin-related functions from context
  const {
    loading,
    fetchPin,
    pin,
    updatePin,
    addComment,
    deleteComment,
    deletePin,
    likePin,
    // likes,
    // getCountOfLikes,
  } = PinData();

  // Component state
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [pinValue, setPinValue] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);

  // Check for valid user
  if (!user || !user._id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle size={32} className="mb-4 text-yellow-500" />
        <p className="text-gray-700 font-medium">
          Please log in to view pin details
        </p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg"
        >
          Go to Login
        </button>
      </div>
    );
  }

  useEffect(() => {
    fetchPin();
  }, [])
  

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (pin && Array.isArray(pin.likes)) {
      setLiked(pin.likes.includes(user._id));
    }
  }, [pin,user._id]);
  


  useEffect(() => {
    if (params.id) {
      setError(null);
      fetchPin(params.id).catch((err) =>
        setError(err?.message || "Failed to load pin details")
      );
    }
  }, [params.id]);

  useEffect(() => {
    if (pin) {
      setTitle(pin.title || "");
      setPinValue(pin.pin || "");
    }
  }, [pin]);

  const editHandler = () => {
    setEdit(!edit);
  };

  const updateHandler = () => {
    if (!title.trim()) {
      setError("Title cannot be empty");
      return;
    }

    try {
      updatePin(pin._id, title, pinValue, setEdit);
    } catch (err) {
      setError(err?.message || "Failed to update pin");
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      try {
        addComment(pin._id, comment, setComment);
      } catch (err) {
        setError(err?.message || "Failed to add comment");
      }
    }
  };

  const deleteCommentHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        deleteComment(pin._id, id);
      } catch (err) {
        setError(err?.message || "Failed to delete comment");
      }
    }
  };

  const deletePinHandler = () => {
    if (window.confirm("Are you sure you want to delete this pin?")) {
      try {
        deletePin(pin._id, navigate);
      } catch (err) {
        setError(err?.message || "Failed to delete pin");
      }
    }
  };
  const likeHandler = () => {
    try {
      likePin(pin._id);
     
      setLiked(!liked);
    } catch (err) {
      setError(err?.message || "Failed to like pin");
    }
  };

  // Loading component
  const Loading = () => (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600 font-medium">Loading pin details...</p>
    </div>
  );

  // Error component
  const ErrorDisplay = () => (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <AlertCircle size={32} className="mb-4 text-red-500" />
      <p className="text-red-600 font-medium">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
      >
        Try Again
      </button>
    </div>
  );

  // Show loading state
  if (loading) {
    return <Loading />;
  }

  // Show error state
  if (error) {
    return <ErrorDisplay />;
  }

  // Show error if pin data is missing
  if (!pin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle size={32} className="mb-4 text-yellow-500" />
        <p className="text-gray-700 font-medium">
          Pin not found or was deleted
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg"
        >
          Go Home
        </button>
      </div>
    );
  }

  // Safely check if current user is the pin owner
  const isOwner = pin.owner && user && pin.owner._id === user._id;

  // Format date safely
  const formattedDate = pin.createdAt
    ? new Date(pin.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className=" min-h-screen py-8 px-4 bg-gradient-to-b from-gray-900 to-gray-800 ">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-sm shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left side - Image */}
            <div className="w-full lg:w-3/5 bg-gray-100 relative flex items-center justify-center min-h-[300px]">
              {pin.image && pin.image.url ? (
                <img
                  src={pin.image.url}
                  alt={pin.title || "Pin image"}
                  className="w-full h-full object-contain lg:max-h-[80vh]"
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <AlertCircle size={48} className="mb-2" />
                  <p>No image available</p>
                </div>
              )}

              {/* Image actions overlay */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={likeHandler}
                  className={`w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition ${
                    liked ? "bg-red-100" : ""
                  }`}
                >
                  <Heart
                    size={20}
                    className={
                      liked ? "text-red-500 fill-red-500" : "text-gray-700"
                    }
                  />
                </button>

                <button
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (pin.image?.url) {
                      fetch(pin.image.url)
                        .then((response) => response.blob())
                        .then((blob) => {
                          const url = window.URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = pin.title
                            ? `${pin.title.replace(/\s+/g, "_")}.jpg`
                            : "download.jpg";
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          window.URL.revokeObjectURL(url);
                        })
                        .catch((err) => console.error("Download error:", err));
                    }
                  }}
                >
                  <Download size={16} className="text-gray-700" />
                </button>
                <button
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (navigator.share) {
                      navigator
                        .share({
                          title: pin.title || "Check out this pin!",
                          text: pin.pin || "Check out this amazing pin!",
                          url: window.location.origin + `/pin/${pin._id}`,
                        })
                        .then(() => console.log("Shared successfully"))
                        .catch((error) =>
                          console.error("Error sharing:", error)
                        );
                    } else {
                      navigator.clipboard
                        .writeText(window.location.origin + `/pin/${pin._id}`)
                        .then(() => alert("Link copied to clipboard!"))
                        .catch((err) => console.error("Clipboard error:", err));
                    }
                  }}
                >
                  <Share2 size={20} className="text-gray-700" />
                </button>
              </div>
            </div>

            {/* Right side - Content */}
            <div className="w-full lg:w-2/5 p-6 flex flex-col">
              {/* Header with edit/delete options */}
              <div className="flex items-center justify-between mb-4">
                {edit ? (
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Enter Title"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-800">
                    {pin.title || "Untitled Pin"}
                  </h1>
                )}

                {isOwner && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={editHandler}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-emerald-600 transition"
                      title={edit ? "Cancel editing" : "Edit pin"}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={deletePinHandler}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-red-600 transition"
                      title="Delete pin"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                {edit ? (
                  <textarea
                    value={pinValue}
                    onChange={(e) => setPinValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    rows="4"
                    placeholder="Enter Description"
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-line">
                    {pin.pin || "No description provided."}
                  </p>
                )}

                {edit && (
                  <button
                    className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow transition"
                    onClick={updateHandler}
                  >
                    Update Pin
                  </button>
                )}
              </div>

              {/* Date and stats */}
              <div className="flex items-center text-gray-500 text-sm mb-4">
                {formattedDate && (
                  <>
                    <Clock size={14} className="mr-1" />
                    <span>{formattedDate}</span>
                    <div className="mx-2 h-1 w-1 rounded-full bg-gray-300"></div>
                  </>
                )}
                <MessageSquare size={14} className="mr-1" />
                <span>
                  {pin.comments && Array.isArray(pin.comments)
                    ? pin.comments.length
                    : 0}{" "}
                  comments
                </span>

                <Heart size={14} className="mr-1 ml-2" />
                <span>
                  {pin.likes && Array.isArray(pin.likes)
                    ? pin.likes.length
                    : 0}{" "}
                  Likes
                </span>
              </div>

              {/* Creator profile */}
              {pin.owner && (
                <div className="flex items-center border-t border-b border-gray-100 py-4 my-4">
                  <Link
                    to={`/user/${pin.owner._id}`}
                    className="flex items-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                      {pin.owner.name
                        ? pin.owner.name.slice(0, 1).toUpperCase()
                        : "?"}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-800">
                        {pin.owner.name || "Unknown User"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {pin.owner.followers &&
                        Array.isArray(pin.owner.followers)
                          ? `${pin.owner.followers.length} followers`
                          : "0 followers"}
                      </p>
                    </div>
                  </Link>
                </div>
              )}

              {/* Comment form */}
              <form className="mb-6" onSubmit={submitHandler}>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold mr-3">
                    {user?.name ? user.name.slice(0, 1).toUpperCase() : "U"}
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="w-full px-4 py-2 pr-12 rounded-full border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                      type="submit"
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center ${
                        comment.trim()
                          ? "text-emerald-600 hover:text-emerald-700"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!comment.trim()}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </form>

              {/* Comments section */}
              <div className="overflow-y-auto max-h-80 pr-2">
                <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                  <MessageSquare size={18} className="mr-2" />
                  Comments
                </h3>

                {pin.comments &&
                Array.isArray(pin.comments) &&
                pin.comments.length > 0 ? (
                  <div className="space-y-4">
                    {pin.comments.map((comment, i) => (
                      <div key={i} className="flex group">
                        <Link
                          to={`/user/${comment.user}`}
                          className="flex-shrink-0"
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
                            {comment.name && typeof comment.name === "string"
                              ? comment.name.slice(0, 1).toUpperCase()
                              : "?"}
                          </div>
                        </Link>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center">
                            <h4 className="font-medium text-gray-800">
                              {comment.name || "Anonymous"}
                            </h4>
                            {comment.user === user._id && (
                              <button
                                onClick={() =>
                                  deleteCommentHandler(comment._id)
                                }
                                className="ml-auto opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition"
                                title="Delete comment"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mt-1">
                            {comment.comment}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                    <AlertCircle size={24} className="mb-2 text-gray-400" />
                    <p>No comments yet</p>
                    <p className="text-sm mt-1">
                      Be the first one to share your thoughts!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinPage;
