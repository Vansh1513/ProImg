import React, { useState } from 'react';
import { UserData } from '../context/UserContext'; // Import UserData hook from context
import { useNavigate } from 'react-router-dom';
import { LoadingAnimation } from '../components/Loading';
import myimage from '../assets/pra.png';
// import { UserData } from '../context/UserContext'; // Import UserData hook

const Forgot = ({ user }) => {
  const [email, setEmail] = useState("");
  const { btnLoading, forgotUser } = UserData(); // Ensure `forgotUser` is accessed here
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    forgotUser(email, navigate ); // Call forgotUser function when form is submitted
  };

  const style = {
    backgroundColor: '#1A1A1D', // Dark background color
  };

  const styl1 = {
    color: '#50c878', // Light green color for the title
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-md" style={style}>
        <div className="flex justify-center">
          <img src={myimage} alt="" className="h-20" />
        </div>
        <h2 className="text-xl font-semibold text-center mb-6" style={styl1}>
          PROIMG
        </h2>

        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-white">
              EMAIL
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state on input change
              required
              type="email"
              id="email"
              className="common-input"
            />
          </div>
          <button type="submit" className="common-btn" disabled={btnLoading}>
            {btnLoading ? <LoadingAnimation /> : "SEND MAIL"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Forgot;
