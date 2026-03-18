import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import instance from "../services/axiosInstance";
import '../styles/Header.css';

const Header = () => {
  const [visible, setVisible] = useState(false);
  const [solid, setSolid] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const lastY = useRef(0);

  useEffect(() => {
    fetchInitialData();
    
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y > 80 && y < lastY.current);
      setSolid(y > 40);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fetchInitialData = async () => {
    try {
      const userRes = await instance.get("/me/");
      setUser(userRes.data);
      
      const cartRes = await instance.get("/cart/");
      setCartCount(cartRes.data.items.length);
    } catch (err) {
      console.log("Not logged in or fetch failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  };

  return (
    <header className={`site-header ${visible ? 'header-visible' : ''} ${solid ? 'header-solid' : ''}`}>
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <span className="logo-mark">🪵</span>
          <span className="logo-text">Etikoppaka<em>Crafts</em></span>
        </Link>

        <nav className="header-nav">
          <Link to="/products">Shop</Link>
          <Link to="/artisans">Artisans</Link>
          <Link to="/about">Our Story</Link>
          <Link to="/register" className="nav-pill">Sell with Us</Link>
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="icon-btn cart-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>

          <div className="profile-menu-container" onMouseEnter={() => setProfileDropdown(true)} onMouseLeave={() => setProfileDropdown(false)}>
            <button className="icon-btn profile-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
            
            {profileDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <p className="user-name">{user ? `Welcome, ${user.username}` : "Welcome, Guest"}</p>
                  <p className="user-email">{user ? user.role : "Sign in to manage orders"}</p>
                </div>
                <div className="dropdown-links">
                  {user && <Link to="/profile">My Profile</Link>}
                  <Link to="/orders">My Orders</Link>
                </div>
                <div className="dropdown-footer">
                  {user ? (
                    <button onClick={handleLogout} className="logout-btn" style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Logout</button>
                  ) : (
                    <Link to="/login" className="logout-btn">Login / Register</Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;