// src/pages/Login.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ganeshImage from "../assets/image_0.jpg";
// Replace with your actual image import or path

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const user = await loginUser(username, password);
      if (user.is_staff) {
        navigate("/admin-dashboard");
      } else if (user.role === "artist") {
        navigate("/artist-dashboard");
      } else {
        navigate("/products");
      }
    } catch (err) {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600&family=Lato:wght@300;400&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        :root {
          --saffron: #E8871A;
          --deep-saffron: #C5601A;
          --gold: #D4A017;
          --ivory: #FAF3E8;
          --cream: #F5E6CC;
          --dark-brown: #2C1A0E;
          --medium-brown: #5C3317;
          --warm-shadow: rgba(44, 26, 14, 0.25);
          --ganesha-green: #4A6741;
        }

        .login-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          font-family: 'Lato', sans-serif;
          background: var(--dark-brown);
          overflow: hidden;
        }

        /* LEFT PANEL — Image */
        .login-left {
          position: relative;
          flex: 1.1;
          overflow: hidden;
          opacity: 0;
          transform: translateX(-30px);
          transition: opacity 0.9s ease, transform 0.9s ease;
        }

        .login-left.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .login-left img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          filter: brightness(0.72) saturate(1.15);
        }

        .left-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(44, 26, 14, 0.55) 0%,
            rgba(200, 100, 20, 0.18) 60%,
            transparent 100%
          );
        }

        .left-brand {
          position: absolute;
          bottom: 48px;
          left: 44px;
          right: 44px;
        }

        .brand-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 15px;
          color: rgba(250, 243, 232, 0.75);
          letter-spacing: 0.12em;
          margin-bottom: 10px;
          text-transform: uppercase;
        }

        .brand-name {
          font-family: 'Cinzel', serif;
          font-size: 32px;
          font-weight: 600;
          color: var(--ivory);
          letter-spacing: 0.08em;
          line-height: 1.15;
          text-shadow: 0 2px 18px rgba(44,26,14,0.7);
        }

        .brand-name span {
          color: var(--saffron);
        }

        .divider-line {
          width: 52px;
          height: 2px;
          background: linear-gradient(90deg, var(--saffron), var(--gold));
          margin-bottom: 14px;
          border-radius: 2px;
        }

        /* Decorative motif */
        .corner-motif {
          position: absolute;
          top: 36px;
          left: 36px;
          width: 60px;
          height: 60px;
          opacity: 0.55;
        }

        /* RIGHT PANEL — Form */
        .login-right {
          flex: 0.9;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--ivory);
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateX(30px);
          transition: opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s;
        }

        .login-right.visible {
          opacity: 1;
          transform: translateX(0);
        }

        /* Background texture pattern */
        .right-texture {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 20% 80%, rgba(232, 135, 26, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(212, 160, 23, 0.06) 0%, transparent 50%);
          pointer-events: none;
        }

        .right-texture::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C5601A' fill-opacity='0.035'%3E%3Cpath d='M20 20c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10S20 25.523 20 20zm-20 0c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10S0 25.523 0 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .form-card {
          position: relative;
          width: 100%;
          max-width: 400px;
          padding: 0 44px;
          z-index: 1;
        }

        /* Om / decorative icon */
        .form-icon {
          font-size: 38px;
          margin-bottom: 6px;
          opacity: 0.85;
          display: block;
          color: var(--saffron);
        }

        .form-heading {
          font-family: 'Cinzel', serif;
          font-size: 26px;
          font-weight: 600;
          color: var(--dark-brown);
          letter-spacing: 0.06em;
          margin-bottom: 4px;
        }

        .form-subheading {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 15px;
          color: var(--medium-brown);
          margin-bottom: 36px;
          letter-spacing: 0.04em;
        }

        .form-section-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .form-section-divider .line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(92,51,23,0.2), transparent);
        }

        .form-section-divider .dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--saffron);
          opacity: 0.6;
        }

        .field-group {
          margin-bottom: 22px;
        }

        .field-label {
          display: block;
          font-family: 'Lato', sans-serif;
          font-weight: 400;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--medium-brown);
          margin-bottom: 8px;
          opacity: 0.85;
        }

        .field-wrapper {
          position: relative;
        }

        .field-wrapper svg {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          opacity: 0.45;
          color: var(--medium-brown);
          pointer-events: none;
          transition: opacity 0.2s;
        }

        .field-input {
          width: 100%;
          padding: 13px 16px 13px 40px;
          border: 1.5px solid rgba(92, 51, 23, 0.18);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.7);
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          color: var(--dark-brown);
          outline: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
          letter-spacing: 0.02em;
        }

        .field-input::placeholder {
          color: rgba(92, 51, 23, 0.35);
          font-style: italic;
        }

        .field-input:focus {
          border-color: var(--saffron);
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 0 0 3px rgba(232, 135, 26, 0.1);
        }

        .field-input:focus + svg,
        .field-wrapper:focus-within svg {
          opacity: 0.8;
          color: var(--saffron);
        }

        .field-wrapper svg {
          z-index: 1;
        }

        /* Trick: icon before input in DOM but positioned absolutely */
        .field-input:focus ~ .field-icon {
          opacity: 0.8;
        }

        .forgot-link {
          display: block;
          text-align: right;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 13px;
          color: var(--deep-saffron);
          text-decoration: none;
          margin-top: -10px;
          margin-bottom: 28px;
          opacity: 0.8;
          transition: opacity 0.2s;
          cursor: pointer;
        }

        .forgot-link:hover {
          opacity: 1;
        }

        .login-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 6px;
          background: linear-gradient(135deg, var(--saffron) 0%, var(--deep-saffron) 100%);
          color: var(--ivory);
          font-family: 'Cinzel', serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(197, 96, 26, 0.35);
        }

        .login-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
          pointer-events: none;
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 7px 28px rgba(197, 96, 26, 0.45);
        }

        .login-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-loader {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(250,243,232,0.4);
          border-top-color: var(--ivory);
          border-radius: 50%;
          animation: spin 0.75s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .register-prompt {
          text-align: center;
          margin-top: 28px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          color: var(--medium-brown);
          opacity: 0.75;
        }

        .register-prompt a {
          color: var(--deep-saffron);
          text-decoration: none;
          font-style: italic;
          font-weight: 600;
          margin-left: 4px;
          opacity: 1;
          transition: opacity 0.2s;
        }

        .register-prompt a:hover {
          opacity: 0.75;
        }

        /* Bottom decorative */
        .form-bottom-motif {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 36px;
          opacity: 0.3;
        }

        .motif-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--saffron);
        }

        .motif-dash {
          width: 20px;
          height: 4px;
          border-radius: 2px;
          background: var(--gold);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .login-left {
            display: none;
          }
          .login-right {
            flex: 1;
          }
          .form-card {
            padding: 0 28px;
          }
        }
      `}</style>

      <div className="login-root">
        {/* LEFT IMAGE PANEL */}
        <div className={`login-left ${mounted ? "visible" : ""}`}>
          <img
            src={ganeshImage}
            alt="Ganesha Handicraft"
          />
          <div className="left-overlay" />

          {/* Corner SVG motif */}
          <svg className="corner-motif" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 55 L5 5 L55 5" stroke="#E8871A" strokeWidth="2" strokeLinecap="round"/>
            <path d="M5 5 Q30 5 30 30 Q30 55 55 55" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 4"/>
            <circle cx="5" cy="5" r="3" fill="#E8871A"/>
            <circle cx="55" cy="55" r="3" fill="#D4A017" opacity="0.6"/>
          </svg>

          <div className="left-brand">
            <div className="divider-line" />
            <p className="brand-tagline">Artisan Creations from Etikoppaka</p>
            <h1 className="brand-name">Varaha<span>Crafts</span></h1>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className={`login-right ${mounted ? "visible" : ""}`}>
          <div className="right-texture" />

          <div className="form-card">
            <span className="form-icon">🪔</span>
            <h2 className="form-heading">Welcome Back</h2>
            <p className="form-subheading">Sign in to explore handcrafted treasures</p>

            <div className="form-section-divider">
              <div className="line" />
              <div className="dot" />
              <div className="line" />
            </div>

            {/* Username */}
            <div className="field-group">
              <label className="field-label" htmlFor="username">Username</label>
              <div className="field-wrapper">
                <input
                  id="username"
                  className="field-input"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="username"
                />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',width:16,height:16,opacity:focused==='username'?0.8:0.4,color:focused==='username'?'#E8871A':'#5C3317',transition:'all 0.2s',pointerEvents:'none'}} onFocus={()=>setFocused('username')}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Password */}
            <div className="field-group">
              <label className="field-label" htmlFor="password">Password</label>
              <div className="field-wrapper">
                <input
                  id="password"
                  className="field-input"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="current-password"
                />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',width:16,height:16,opacity:focused==='password'?0.8:0.4,color:focused==='password'?'#E8871A':'#5C3317',transition:'all 0.2s',pointerEvents:'none'}}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <span className="forgot-link">Forgot your password?</span>

            <button
              className="login-btn"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading && <span className="btn-loader" />}
              {loading ? "Signing In..." : "Login in"}
            </button>

            <p className="register-prompt">
              New to Varaha Crafts?
              <a href="/register">Create an account</a>
            </p>

            <div className="form-bottom-motif">
              <div className="motif-dot" />
              <div className="motif-dash" />
              <div className="motif-dot" />
              <div className="motif-dot" />
              <div className="motif-dash" />
              <div className="motif-dot" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;