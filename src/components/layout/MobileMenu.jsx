import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaHeart, FaBars, FaTimes } from 'react-icons/fa';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  // Close menu when a link is clicked
  const closeMenu = () => {
    setIsOpen(false);
  };
  
  return (
    <div className="lg:hidden">
      {/* Mobile header with toggle button */}
      <div className="fixed top-0 left-0 right-0 bg-white z-30 shadow-sm h-16 flex items-center justify-between px-4">
        <h1 className="font-bold text-xl">
          <span className="text-primary">What's</span> For Dinner?
        </h1>
        
        <button 
          onClick={toggleMenu}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
      </div>
      
      {/* Mobile navigation menu */}
      <div className={`fixed inset-0 bg-white z-20 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out pt-16`}>
        <nav className="p-4">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center py-3 px-4 rounded-lg ${isActive ? 'bg-primary-light/20 text-primary' : 'text-gray-700'}`
            }
            onClick={closeMenu}
          >
            <FaHome className="mr-3" />
            Home
          </NavLink>
          
          <NavLink 
            to="/favorites" 
            className={({ isActive }) => 
              `flex items-center py-3 px-4 rounded-lg ${isActive ? 'bg-primary-light/20 text-primary' : 'text-gray-700'}`
            }
            onClick={closeMenu}
          >
            <FaHeart className="mr-3" />
            Favorites
          </NavLink>
        </nav>
      </div>
      
      {/* Overlay to close menu when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default MobileMenu;