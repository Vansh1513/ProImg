import React, { useState } from 'react'
import { UserData } from '../context/UserContext'
import { useNavigate, Link } from 'react-router-dom'
import { LoadingAnimation } from '../components/Loading'
import { PinData } from '../context/PinContext'
import myimage from '../assets/pra.png'
import { motion } from 'framer-motion'
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'

const Register = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [formError, setFormError] = useState("")
    
    const { registerUser, btnLoading } = UserData()
    const navigate = useNavigate()
    const { fetchPins } = PinData()
    
    const submitHandler = (e) => {
        e.preventDefault()
        
        // Simple validation
        if (!name.trim() || !email.trim() || !password.trim()) {
            setFormError("Please fill in all fields")
            return
        }
        
        if (password.length < 6) {
            setFormError("Password must be at least 6 characters long")
            return
        }
        
        setFormError("")
        registerUser(name, email, password, navigate)
    }
    
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    }
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    }
    
    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900'>
            <motion.div 
                className='p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-sm bg-opacity-80 bg-[#1A1A1D] border border-gray-800'
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div className='flex justify-center mb-2' variants={itemVariants}>
                    <img src={myimage} alt="ProImg Logo" className='h-20 hover:scale-105 transition-transform duration-300' />
                </motion.div>
                
                <motion.h2 className='text-xl font-semibold text-center mb-2 text-[#50c878]' variants={itemVariants}>
                    PROIMG
                </motion.h2>
                
                <motion.h2 className='text-2xl font-bold text-white text-center mb-6' variants={itemVariants}>
                    Create Account
                </motion.h2>
                
                {formError && (
                    <motion.div 
                        className='mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-300 text-sm'
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {formError}
                    </motion.div>
                )}
                
                <form onSubmit={submitHandler}>
                    <motion.div className='mb-4' variants={itemVariants}>
                        <label htmlFor="name" className='block text-sm font-medium text-gray-300 mb-1'>
                            NAME
                        </label>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <FaUser className='text-gray-500' />
                            </div>
                            <input 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                                type="text" 
                                id='name' 
                                className='w-full py-2 pl-10 pr-3 border border-gray-700 bg-gray-900 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#50c878] focus:border-transparent' 
                                placeholder='Enter your full name'
                            />
                        </div>
                    </motion.div>
                    
                    <motion.div className='mb-4' variants={itemVariants}>
                        <label htmlFor="email" className='block text-sm font-medium text-gray-300 mb-1'>
                            EMAIL
                        </label>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <FaEnvelope className='text-gray-500' />
                            </div>
                            <input 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                type="email" 
                                id='email' 
                                className='w-full py-2 pl-10 pr-3 border border-gray-700 bg-gray-900 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#50c878] focus:border-transparent' 
                                placeholder='Enter your email address'
                            />
                        </div>
                    </motion.div>
                    
                    <motion.div className='mb-6' variants={itemVariants}>
                        <label htmlFor="password" className='block text-sm font-medium text-gray-300 mb-1'>
                            PASSWORD
                        </label>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <FaLock className='text-gray-500' />
                            </div>
                            <input 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                type={showPassword ? "text" : "password"} 
                                id='password' 
                                className='w-full py-2 pl-10 pr-10 border border-gray-700 bg-gray-900 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#50c878] focus:border-transparent' 
                                placeholder='Create a secure password'
                            />
                            <div 
                                className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 
                                    <FaEyeSlash className='text-gray-500 hover:text-gray-300' /> : 
                                    <FaEye className='text-gray-500 hover:text-gray-300' />
                                }
                            </div>
                        </div>
                        <p className='mt-1 text-xs text-gray-400'>Password must be at least 6 characters long</p>
                    </motion.div>
                    
                    <motion.button 
                        type='submit' 
                        className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#50c878] hover:bg-[#3daf63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#50c878] transition-colors duration-200 flex items-center justify-center'
                        disabled={btnLoading}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {btnLoading ? <LoadingAnimation /> : "CREATE ACCOUNT"}
                    </motion.button>
                </form>
                
                <motion.div className='mt-6 text-center' variants={itemVariants}>
                    <div className='relative mb-4'>
                        <div className='absolute inset-0 flex items-center'>
                            <div className='w-full border-t border-gray-700'></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className='px-2 bg-[#1A1A1D] text-gray-400'>or</span>
                        </div>
                    </div>
                    
                    <div className='text-gray-300'>
                        Already have an account?{' '}
                        <Link to="/login" className='font-medium text-[#50c878] hover:underline'>
                            Sign in instead
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default Register