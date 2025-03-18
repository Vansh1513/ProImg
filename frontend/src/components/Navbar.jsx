import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home as HomeIcon, PlusCircle, User, Menu, X, MessageCircle } from 'lucide-react';
import myimage from '../assets/pra.png';

const Navbar = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
           
            <span className="text-2xl font-bold text-emerald-500 tracking-tight">PROIMG</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-800 hover:text-white transition"
            >
              <HomeIcon size={18} className="mr-1.5" />
              Home
            </Link>
            <Link 
              to="/create" 
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-800 hover:text-white transition"
            >
              <PlusCircle size={18} className="mr-1.5" />
              Create
            </Link>
            <Link 
              to="/messages" 
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-800 hover:text-white transition"
            >
              <MessageCircle size={18} className="mr-1.5" />
              Message
            </Link>
            <Link 
              to="/account" 
              className="flex items-center space-x-2 ml-4"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-600 transition flex items-center justify-center text-white font-semibold">
                {user?.name ? user.name.slice(0, 1).toUpperCase() : 'U'}
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="flex items-center px-3 py-3 rounded-md text-base font-medium text-white hover:bg-gray-700 hover:text-white transition"
              onClick={() => setIsMenuOpen(false)}
            >
              <HomeIcon size={18} className="mr-2" />
              Home
            </Link>
            <Link 
              to="/create" 
              className="flex items-center px-3 py-3 rounded-md text-base font-medium text-white hover:bg-gray-700 hover:text-white transition"
              onClick={() => setIsMenuOpen(false)}
            >
              <PlusCircle size={18} className="mr-2" />
              Create
            </Link>
            <Link 
              to="/account" 
              className="flex items-center px-3 py-3 rounded-md text-base font-medium text-white hover:bg-gray-700 hover:text-white transition"
              onClick={() => setIsMenuOpen(false)}
            >
              <User size={18} className="mr-2" />
              Profile
              <div className="ml-auto w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold">
                {user?.name ? user.name.slice(0, 1).toUpperCase() : 'U'}
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;