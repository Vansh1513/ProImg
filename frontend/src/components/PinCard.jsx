import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Download, Heart, Eye } from "lucide-react";

const PinCard = ({ pin }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Safe guard against missing data
  if (!pin) return null;

  // Handle image load
  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image container with fixed aspect ratio */}
      <div className="relative pb-[100%] bg-gray-100">
        {/* Loading indicator */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Image */}
        {pin.image && (
          <Link to={`/pin/${pin._id}`} className="block">
            <img
              src={pin.image.url}
              alt={pin.title || "Pin"}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={handleImageLoad}
              onError={() => setIsLoaded(true)} // Handle image load errors
            />
          </Link>
        )}

        {/* Overlay with quick actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-end justify-between p-3 opacity-0 hover:opacity-100">
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-gray-100">
              <Heart size={16} className="text-gray-700" />
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
          </div>

          <Link
            to={`/pin/${pin._id}`}
            className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-md hover:bg-emerald-600"
          >
            <Eye size={16} className="text-white" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-medium text-gray-800 truncate">
          {pin.title || "Untitled Pin"}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2 h-10">
          {pin.pin || "No description"}
        </p>

        {/* User info if available */}
        {pin.creator && (
          <div className="flex items-center mt-3 pt-2 border-t border-gray-100">
            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600 font-medium">
              {typeof pin.creator === "object" && pin.creator.name
                ? pin.creator.name.slice(0, 1).toUpperCase()
                : typeof pin.creator === "string"
                ? pin.creator.slice(0, 1).toUpperCase()
                : "U"}
            </div>
            <span className="ml-2 text-xs text-gray-700">
              {typeof pin.creator === "object" && pin.creator.name
                ? pin.creator.name
                : typeof pin.creator === "string"
                ? pin.creator
                : "User"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PinCard;
