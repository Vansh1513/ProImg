import React from 'react'
import { Link } from 'react-router-dom'
import myimage from '../assets/pra.png'



const Navbar = ({user}) => {

  const style2 = {
    backgroundColor: '#1A1A1D', // Hex color for background
    
  };
  const style1 = {
    color : '#50c878', // Hex color for background
    
  };
  
  return (
    <div>
      <div className=" shadow-sm" style={style2}>
        <div className=' mx-auto px-4 py-2 flex justify-between items-center'>
            <Link to="/" className='flex items-center mr-5'>
            <img src={myimage} alt="" className='h-12 md:mr-2' />
            <span className=' text-xl font-bold' style={style1}>PROIMG</span>
            </Link>
            <div className='flex items-center space-x-4 w-[200px]'>
                <Link to="/" className='text-green-400 hover:text-green-700'>Home</Link>
                <Link to="/create" className='text-green-400 hover:text-green-700'>Create</Link>
                <Link to="/account" className='w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-green-700'>{user.name.slice(0,1).toUpperCase()}</Link>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
