import axios from "axios";
import { Children, useContext, useEffect, useState } from "react";
import { createContext } from "react";
import toast, { Toaster } from "react-hot-toast";

const UserContext=createContext()

export const UserProvider=({children})=>{
    const [user, setUser] = useState([])
    const [isAuth, setIsAuth] = useState(false)
    const [btnLoading, setBtnLoading] = useState(false)


    
    async function loginUser(email,password,navigate,fetchPins) {
        setBtnLoading(true)
        try {
            const {data}=await axios.post("/api/user/login",{email,password});
            toast.success(data.message);
            setUser(data.user);
            setIsAuth(true);
            setBtnLoading(false);
            navigate("/")
            fetchPins()
            
            
        } catch (error) {
            toast.error(error.response.data.message);
            setBtnLoading(false);
        }
    }

    async function registerUser(name,email,password,navigate,fetchPins) {
        setBtnLoading(true);
        try {
            const {data}=await axios.post("/api/user/register",{name,email,password});
            toast.success(data.message);
            setUser(data.user);
            setIsAuth(true);
            setBtnLoading(false);
            navigate("/")
            fetchPins()
            
        } catch (error) {
            toast.error(error.response.data.message);
            setBtnLoading(false);
            
        }
        
    }

    const [loading, setloading] = useState(true)

    async function fetchUser() {
        
        try {
            const {data}=await axios.get("/api/user/me");
            setUser(data)
            setIsAuth(true);
            setloading(false);

            
        } catch (error) {
            console.log(error)
            setloading(false)
        }
        
    }

    async function followUser(id,fetchUser) {
        try {

            const {data} = await axios.post("/api/user/follow/"+id)
            toast.success(data.message)
            
        } catch (error) {
            toast.error(error.response.data.message);
        }
        
    }

    useEffect(() => {
      fetchUser();
    
      return () => {
        
      }
    }, [])
    

    return (<UserContext.Provider value={{loginUser,btnLoading,isAuth,user,loading,registerUser,setIsAuth,setUser,followUser}} >{children}</UserContext.Provider>);
};

export const UserData=()=>useContext(UserContext);