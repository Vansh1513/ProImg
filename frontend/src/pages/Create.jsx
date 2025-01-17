import React, { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { PinData } from "../context/PinContext";
import { useNavigate } from "react-router-dom";

const LoadingAnimation = () => (
  <div className="flex justify-center items-center">
    <div className="spinner border-t-transparent border-4 border-green-500 rounded-full w-6 h-6 animate-spin"></div>
  </div>
);


const Create = () => {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.click();
  };

  const [file, setFile] = useState("");
  const [filePrev, setFilePrev] = useState("");
  const [title, setTitle] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const { addPin } = PinData();

  const changeFileHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setFilePrev(reader.result);
      setFile(file);
    };
  };

  const navigate = useNavigate();

  const addPinHandler = async (e) => {
    e.preventDefault();

    setLoading(true); // Start loading
    const formData = new FormData();

    formData.append("title", title);
    formData.append("pin", pin);
    formData.append("file", file);

    try {
      await addPin(formData, setFilePrev, setFile, setTitle, setPin, navigate);
    } catch (error) {
      console.error("Failed to add pin:", error);
    } finally {
      setLoading(false); // Stop loading after process completion
    }
  };

  return (
    <div className="h-screen">
      <div className="flex flex-wrap justify-center items-center gap-2 mt-10">
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center justify-center w-80 h-auto p-6 bg-white rounded-lg shadow-lg">
            {filePrev && <img src={filePrev} alt="Preview" />}
            <div
              className="flex flex-col items-center justify-center h-full cursor-pointer"
              onClick={handleClick}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={changeFileHandler}
              />
              <div className="w-12 h-12 mb-4 flex items-center justify-center bg-gray-200 rounded-full">
                <FaPlus />
              </div>
              <p className="text-gray-500">Choose a file</p>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              We recommend using high-quality .jpg files but less than 10MB
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-center bg-gray-100">
            <form
              className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg"
              onSubmit={addPinHandler}
            >
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="common-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="pin"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pin
                </label>
                <input
                  type="text"
                  id="pin"
                  className="common-input"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className={`common-btn ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? <LoadingAnimation /> : "Create"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
