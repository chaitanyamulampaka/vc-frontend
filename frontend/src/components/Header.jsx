import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import instance from "../services/axiosInstance";
import '../styles/Header.css';

const Header = () => {
  const location  = useLocation();
  const isHome    = location.pathname === "/";

  const [visible,         setVisible]         = useState(!isHome);
  const [solid,           setSolid]           = useState(!isHome);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [mobileOpen,      setMobileOpen]      = useState(false);
  const [user,            setUser]            = useState(null);
  const [cartCount,       setCartCount]       = useState(0);
  const lastY = useRef(0);

  /* ── Scroll listener ── */
  useEffect(() => {
    if (!isHome) { setVisible(true); setSolid(true); return; }

    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y > 80 && y < lastY.current);
      setSolid(y > 40);
      lastY.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  /* ── Close mobile nav on route change ── */
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  /* ── Data fetch ── */
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const userRes = await instance.get("/me/");
        setUser(userRes.data);
        const cartRes = await instance.get("/cart/");
        setCartCount(cartRes.data.items?.length || 0);
      } catch {
        /* not logged in */
      }
    };
    fetchInitialData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  };

  const headerClass = [
    "site-header",
    visible ? "header-visible" : "",
    solid   ? "header-solid"   : "",
  ].filter(Boolean).join(" ");

  return (
    <>
      <header className={headerClass}>
        <div className="header-inner">

          {/* ── Logo ── */}
          <Link to="/" className="header-logo">
            <span className="logo-mark">🪵</span>
            <span className="logo-text">Varaha<em>Crafts</em></span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className={`header-nav ${mobileOpen ? "nav-open" : ""}`}>
            <Link to="/">Home</Link>
            <Link to="/products">Shop</Link>
            
            <Link to="/story">Our Story</Link>
            <Link to="/artist-dashboard" className="nav-pill">Sell with Us</Link>
          </nav>

          {/* ── Actions ── */}
          <div className="header-actions">

            {/* Cart */}
            <Link to="/cart" className="icon-btn cart-btn" aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>

            {/* Profile dropdown */}
            <div
              className="profile-menu-container"
              onMouseEnter={() => setProfileDropdown(true)}
              onMouseLeave={() => setProfileDropdown(false)}
            >
              <button className="icon-btn profile-btn" aria-label="Profile">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.8">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </button>

              {profileDropdown && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <p className="user-name">
                      {user ? `Hi, ${user.username}` : "Welcome, Guest"}
                    </p>
                    <p className="user-email">
                      {user ? user.role : "Sign in to manage orders"}
                    </p>
                  </div>

                  <div className="dropdown-links">
                    {user && <Link to="/profile">My Profile</Link>}
                    <Link to="/orders">My Orders</Link>
                  </div>

                  <div className="dropdown-footer">
                    {user ? (
                      <button onClick={handleLogout} className="logout-btn">
                        {/* Fixed: was width="100", now width="16" */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2"
                          style={{ marginRight: 8, verticalAlign: "middle" }}>
                          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                          <polyline points="16 17 21 12 16 7"/>
                          <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Sign Out
                      </button>
                    ) : (
                      <Link to="/login" className="logout-btn">Login / Register</Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="icon-btn mobile-menu-btn"
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8">
                {mobileOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6"  y1="6" x2="18" y2="18"/>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6"  x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                  </>
                )}
              </svg>
            </button>

          </div>
        </div>
      </header>

      {/* Mobile backdrop */}
      <div
        className={`mobile-overlay ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />
    </>
  );
};

export default Header;