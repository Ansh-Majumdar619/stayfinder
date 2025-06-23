import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GooeyNav from '../ui/GooeyNav';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [activeIndex, setActiveIndex] = useState(0); // 🌟 Track active tab

  // Update active tab when route changes
  useEffect(() => {
    const pathToIndex = {
      '/': 0,
      '/host': 1,
      '/bookings': 2,
      '/me': 3,
    };
    const newIndex = pathToIndex[location.pathname] ?? 0;
    setActiveIndex(newIndex);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const items = useMemo(() => {
    const baseItems = [
      {
        label: 'Home',
        href: '/',
        onClick: () => navigate('/'),
        className: `px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${location.pathname === '/' ? 'bg-[#e09a57] text-white scale-105' : 'text-[#e09a57]'
          }`,
      },
    ];

    if (token) {
      baseItems.push(
        {
          label: 'Host',
          href: '/host',
          onClick: () => navigate('/host'),
          className: `px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${location.pathname === '/host' ? 'bg-[#e09a57] text-white scale-105' : 'text-[#e09a57]'
            }`,
        },
        {
          label: 'Bookings',
          href: '/bookings',
          onClick: () => navigate('/bookings'),
          className: `px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${location.pathname === '/bookings' ? 'bg-[#e09a57] text-white scale-105' : 'text-[#e09a57]'
            }`,
        },
        {
          label: 'Dashboard',
          href: '/me',
          onClick: () => navigate('/me'),
          className: `px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${location.pathname === '/me' ? 'bg-[#e09a57] text-white scale-105' : 'text-[#e09a57]'
            }`,
        }
      );
    }

    return baseItems;
  }, [navigate, location.pathname, token]);

  const rightContent = token ? (
    <button
      onClick={handleLogout}
      className="bg-[#3b1b0f] text-[#f2d8b6] px-4 py-1 rounded-full hover:bg-[#f2d8b6] hover:text-[#3b1b0f] cursor-pointer transition"
    >
      Logout
    </button>
  ) : (
    <div className="flex gap-2">
      <button
        onClick={() => navigate('/login')}
        className="text-[#f9eddb] bg-[#3b1b0f] px-3 py-1 hover:text-[#3b1b0f] hover:bg-[#f9eddb] transition rounded-full cursor-pointer"
      >
        Login
      </button>
      <button
        onClick={() => navigate('/register')}
        className="text-[#f2d8b6] bg-[#6d3721] px-3 py-1 hover:text-[#6d3721] hover:bg-[#f2d8b6] transition rounded-full cursor-pointer"
      >
        Register
      </button>
    </div>
  );

  return (
    <div className="w-full px-4 pt-2 pb-2 fixed top-0 z-[1000] bg-[#874225]/50 backdrop-blur-lg backdrop-saturate-150">
      <GooeyNav
        key={location.pathname} // ✅ This forces full re-render when route changes
        items={items}
        rightContent={rightContent}
        particleCount={15}
        particleDistances={[90, 10]}
        particleR={100}
        initialActiveIndex={activeIndex}
        animationTime={600}
        timeVariance={300}
        colors={[1, 2, 3, 1, 2, 3, 1, 4]}
      />

    </div>
  );
};

export default Navbar;
