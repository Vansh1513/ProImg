import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { LoadingAnimation } from "../components/Loading";
import { useSearchParams } from "react-router-dom";
import myimage from "../assets/pra.png";

const OtpVerify = () => {
  // const [email, setEmail] = useState("")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("");
  const { verify, btnLoading } = UserData();
  const navigate = useNavigate();
  const { token } = useParams(); // Extract token from URL
  // const [searchParams] = useSearchParams();
  // const token = searchParams.get("token");

  const submitHandler = (e) => {
    e.preventDefault();
    verify(email,otp, navigate); // Call reset function with token and password
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-md" style={{ backgroundColor: "#1A1A1D" }}>
        <div className="flex justify-center">
          <img src={myimage} alt="" className="h-20" />
        </div>
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          ENTER OTP
        </h2>
        <form onSubmit={submitHandler}>
        <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-white">
              EMAIL
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              id="email"
              className="common-input"
            />
          </div>
        
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-white">
              OTP
            </label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              type="text"
              id="text"
              className="common-input"
            />
          </div>
          <button type="submit" className="common-btn" disabled={btnLoading}>
            {btnLoading ? <LoadingAnimation /> : "SUBMIT"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerify;
