import React, { useState } from 'react';
import { SidebarTrigger } from './ui/Sidebar';
import { Search } from 'lucide-react'; // 🔹 Importing search icon
import hamburgerIcon from '../assets/hamburger.svg';
import lightModeIcon from '../assets/light-mode-svgrepo-com.svg';
import darkModeIcon from '../assets/mode-dark-svgrepo-com.svg';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { SignUpButton } from '@clerk/clerk-react';

function Header({ onSearch, onResetList, toggleDarkMode, isDarkMode }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery.toLowerCase());
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    onResetList();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-4">
        <SidebarTrigger>
          <div className="hamburger hover:cursor-pointer">
            <img 
              src={hamburgerIcon} 
              alt="Menu" 
              className="w-6 h-6 invert"
            />
          </div>
        </SidebarTrigger>
        
        <a 
          href="#" 
          onClick={handleHomeClick} 
          className="text-xl font-bold hover:text-gray-300 transition"
        >
          FlickNest
        </a>
      </div>

      <div className="options">
        <ul className='flex flex-wrap gap-7 cursor-pointer'>
          <li className='hover:text-gray-400 cursor-pointer'><a href="/">Home</a></li>
          <li className='hover:text-gray-400 cursor-pointer'>About</li>
          <li className='hover:text-gray-400 cursor-pointer'>Contact</li>
        </ul>
      </div>
      
      <div className="flex items-center space-x-4 text-white">
        <div 
          className="w-8 hover:cursor-pointer text-white invert" 
          onClick={toggleDarkMode}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <img 
            id="mode" 
            src={isDarkMode ? lightModeIcon : darkModeIcon} 
            alt="Toggle Theme" 
            className="w-full h-full text-white"
          />
        </div>
        
        <div className="flex items-center">
          <input 
            type="text" 
            placeholder="Search Movies..." 
            className="w-58 p-2 border border-gray-700 rounded-l-md focus:outline-none focus:border-blue-500 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            className="px-4 py-2 bg-gray-800 text-white transition rounded-br-2xl rounded-bl-2xl rounded-tl-2xl rounded-tr-2xl cursor-pointer flex items-center justify-center"
            onClick={handleSearch}
          >
            <Search className="w-5 h-5" /> {/* 🔹 Search Icon */}
          </button>
        </div>
        
        <div className="user flex items-center space-x-2">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-black transition rounded-b-3xl rounded-t-3xl cursor-pointer">
                Log In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition rounded-b-3xl rounded-t-3xl cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton/>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}

export default Header;
