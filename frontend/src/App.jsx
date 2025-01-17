import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UserData } from "./context/UserContext";
import { Loading } from "./components/Loading";
import Navbar from "./components/Navbar";
import PinPage from "./pages/PinPage";
import Create from "./pages/Create";
import Account from "./pages/Account";
import UserProfile from "./pages/UserProfile";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import OtpVerify from "./pages/OtpVerify";

const App = () => {
  const { loading, isAuth, user,forgotUser,resetUser,} = UserData(); // Access context data for loading and authentication status
  console.log(isAuth);
  return (
    <>
      {loading ? (
        <Loading /> // Show loading animation while user data is being fetched
      ) : (
        <BrowserRouter>
          
          {isAuth && <Navbar user={user} />}
          <Routes>
            <Route path="/" element={isAuth ? <Home /> : <Login />} />
            <Route
              path="/account"
              element={isAuth ? <Account user={user} /> : <Login />}
            />
            <Route
              path="/user/:id"
              element={isAuth ? <UserProfile user={user} /> : <Login />}
            />
            <Route path="/create" element={isAuth ? <Create /> : <Login />} />
            <Route
              path="/pin/:id"
              element={isAuth ? <PinPage user={user} /> : <Login />}
            />
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route path="/verify/:token" element={isAuth ? <Home /> : <OtpVerify/>} />
            <Route
              path="/register"
              element={ <Register />}
            />
            <Route
              path="/forgot"
              element={!isAuth ? <Forgot /> : <Home />} // Show Forgot page if not authenticated
            />
            <Route
              path="/reset-password/:token"
              element={<Reset />}
            />
           
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
