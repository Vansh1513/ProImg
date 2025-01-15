import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast  from 'react-hot-toast';

const UserContext = createContext(); // Create a context

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // Function to handle user login
  async function loginUser(email, password, navigate, fetchPins) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post("/api/user/login", { email, password });
      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
      fetchPins();
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  }

  // Function to handle forgot password logic
  async function forgotUser(email, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post("/api/user/forget", { email }); // Ensure correct endpoint is used
      toast.success(data.message);
      // setUser(data.user);
      setBtnLoading(false);
      // console.log(data.token);
      navigate("/forgot");

      // navigate("/reset-password/" + data.token); // Redirect to reset password 
      
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  }

  // Function to reset password
  async function resetUser(token, password,navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post("/api/user/reset-password/" + token, { password });
      toast.success(data.message);
      // setUser(data.user);
      setBtnLoading(false);
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  }

  // Function to register new user
  async function registerUser(name, email, password, navigate, fetchPins) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post("/api/user/register", { name, email, password });
      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
      fetchPins();
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  }

  // Fetch user information
  const [loading, setLoading] = useState(true);
  async function fetchUser() {
    try {
      const { data } = await axios.get("/api/user/me");
      setUser(data);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  // Function to follow a user
  async function followUser(id, fetchUser) {
    try {
      const { data } = await axios.post("/api/user/follow/" + id);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  // UseEffect to fetch user data on load
  useEffect(() => {
    fetchUser();
    return () => {};
  }, []);

  // Return the context provider with value
  return (
    <UserContext.Provider
      value={{
        loginUser,
        btnLoading,
        isAuth,
        user,
        loading,
        registerUser,
        setIsAuth,
        setUser,
        followUser,
        forgotUser, // Make sure forgotUser is exposed here
        resetUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access the context
export const UserData = () => useContext(UserContext);
