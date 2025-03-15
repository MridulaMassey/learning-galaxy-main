import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Bell } from 'lucide-react'; // Importing Logout & Notification icons

const Navbar = () => {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);

  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  const navItems = [
    { name: "Home", icon: "🏠", link: "/dashboard" },
    { name: "Lessons", icon: "📖", link: "/Resources" },
    { name: "Activities", icon: "🎨", link: "/Activities" },
    { name: "Games", icon: "🎮", link: "/Games", newTab: true },
    { name: "Rewards", icon: "🏆", link: "/rewards" }
  ];

  return (
    <nav className="w-full bg-[#de0029] p-4 shadow-md flex items-center justify-between">
      
      {/* Left: Logo */}
      <div className="flex items-center">
           <img 
          src="KH_logo3.png" 
          alt="Logo"
          className="h-16 w-auto object-contain"
        />
      </div>

      {/* Center: Navigation Links */}
      <div className="flex space-x-10">
        {navItems.map((item) => (
          item.newTab ? (
            <a
              key={item.name}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center cursor-pointer p-2 rounded-lg transition-all text-white hover:bg-[#b90020]"
            >
              <div className="text-2xl">{item.icon}</div>
              <p className="text-sm font-semibold">{item.name}</p>
            </a>
          ) : (
            <Link
              key={item.name}
              to={item.link}
              className={`flex flex-col items-center cursor-pointer p-2 rounded-lg transition-all ${
                active === item.link
                  ? "bg-gradient-to-r from-yellow-400 to-orange-300 text-white"
                  : "text-white hover:bg-[#b90020]"
              }`}
            >
              <div className="text-2xl">{item.icon}</div>
              <p className="text-sm font-semibold">{item.name}</p>
            </Link>
          )
        ))}
      </div>

      {/* Right: Notification & Logout */}
      <div className="flex items-center space-x-4">
        {/* Notification Icon */}
        <button className="p-2 rounded-lg hover:bg-red-600 transition-all">
          <Bell className="h-6 w-6 text-white" />
        </button>

        {/* Logout Button */}
        <button 
          onClick={() => alert("Logging out...")} 
          className="p-2 rounded-lg hover:bg-red-600 transition-all"
        >
          <LogOut className="h-6 w-6 text-white" />
        </button>
      </div>

    </nav>
  );
};

export default Navbar;
