import React, { useState } from 'react'
import { UserData } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { LoadingAnimation } from '../components/Loading'
import { PinData } from '../context/PinContext'

const Register = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  
  const {registerUser,btnLoading}=UserData();
  const navigate =useNavigate()
  const {fetchPins} = PinData()
  
  const submitHandler=(e)=>{
          e.preventDefault();
          registerUser(name,email,password,navigate);
          
  
      }
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-200 '>
          <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
            <div className='flex justify-center mb-4'>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Pinterest-logo.png/600px-Pinterest-logo.png" alt="" className='h-12' />
            </div>
            <h2 className='text-2xl font-semibold text-center mb-6'>REGISTER</h2>
            <form onSubmit={submitHandler} >
            <div className='mb-4'>
                    <label htmlFor="name" className='block text-sm font-medium text-gray-700' >NAME</label>
                    <input value={name} onChange={(e)=>setName(e.target.value)} required type="name" id='name' className='common-input' />
                </div>
                <div className='mb-4'>
                    <label htmlFor="email" className='block text-sm font-medium text-gray-700' >EMAIL</label>
                    <input value={email} onChange={(e)=>setEmail(e.target.value)} required type="email" id='email' className='common-input' />
                </div>
                <div className='mb-4'>
                    <label htmlFor="password" className='block text-sm font-medium text-gray-700'>PASSWORD</label>
                    <input value={password} onChange={(e)=>setPassword(e.target.value)} required type="password" id='password' className='common-input' />
                </div>
                <button type='submit' className='common-btn'disabled={btnLoading}> {btnLoading?<LoadingAnimation/>:"Register"} </button>
            </form>
            <div className='mt-6 text-center'>
                <div className='relative mb-4'>
                    <div className='absolute inset-0 flex items-center'>
                        <div className='w-full border-t border-gray-300'></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className='bg-white px-2 to-gray-500'>OR</span>
                    </div>
                </div>
                <div>
                    <h2>Already't have an Account ?</h2><a href="/login" className=' underline text-blue-500 '>Login</a>
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

export default Register
