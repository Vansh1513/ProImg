import React, { useState } from 'react'
import { UserData } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { LoadingAnimation } from '../components/Loading'
import { PinData } from '../context/PinContext'
import myimage from '../assets/pra.png'


const Login = () => {


    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const {loginUser,btnLoading}=UserData();
    const navigate =useNavigate()
    const{fetchPins}=PinData();

    const submitHandler=(e)=>{
        e.preventDefault();
       loginUser(email,password,navigate);

    }

    const style = {
        backgroundColor: '#1A1A1D', // Hex color for background
        
      };
    
    const style2 = {
        backgroundColor: '#4C585B', // Hex color for background
        
      };

      const styl1 = {
        color : '#50c878', // Hex color for background
        
      };
   

  return (
    <div className='min-h-screen flex items-center justify-center bg-black '  >
      <div className='p-8 rounded-lg shadow-lg w-full max-w-md '  style={style}>
      
        <div className='flex justify-center '>
            <img src={myimage} alt="" className='h-20' />
        </div>
        <h2 className='text-xl font-semibold  text-center mb-6' style={styl1}>PROIMG</h2>

        <h2 className='text-2xl font-semibold text-white text-center mb-6'>LOGIN</h2>

        
        <form onSubmit={submitHandler} >
            <div className='mb-4'>
                <label htmlFor="email" className='block text-sm font-medium text-white' >EMAIL</label>
                <input value={email} onChange={(e)=>setEmail(e.target.value)} required type="email" id='email' className='common-input' />
            </div>
            <div className='mb-4'>
                <label htmlFor="password" className='block text-sm font-medium text-white'>PASSWORD</label>
                <input value={password} onChange={(e)=>setPassword(e.target.value)} required type="password" id='password' className='common-input' />
            </div>
            <button type='submit' className='common-btn'disabled={btnLoading}> {btnLoading?<LoadingAnimation/>:"LOG IN"} </button>
        </form>
        <div className='mt-6 text-center'>
            <div className='relative mb-4'>
                <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-gray-300'></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className='bg-white px-2 to-gray-500'></span>
                </div>
            </div>
            <div>
                <a href="/forgot" className='hover:underline text-blue-500 '>FORGOT PASSWORD ?</a>
                <h2 className='text-white'>Don't have Account ?</h2><a href="/register" className='hover:underline text-blue-500 '>Register</a>
            </div>
            {/* <div className='mt-4 text-center text-sm'>
                <span>
                    <Link>Register</Link>
                </span>
            </div> */}
        </div>
      </div>
    </div>
  )
}

export default Login
