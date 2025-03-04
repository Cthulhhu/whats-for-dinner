import { NavLink } from 'react-router-dom';
import { FaHome, FaHeart } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <h1 className="text-2xl font-bold">
          <span className="text-primary">What's</span> For Dinner?
        </h1>
      </div>
      
      <nav className="mt-8">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `nav-link ${isActive ? 'active' : ''}`
          }
        >
          <FaHome className="mr-3" />
          Home
        </NavLink>
        
        <NavLink 
          to="/favorites" 
          className={({ isActive }) => 
            `nav-link ${isActive ? 'active' : ''}`
          }
        >
          <FaHeart className="mr-3" />
          Favorites
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;