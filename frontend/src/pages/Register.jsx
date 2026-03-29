import { useState, useEffect } from "react";
import instance from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";

import ganeshImage from "../assets/APEKCH08_512x512.webp"; // 👈 adjust path to your image

function Register() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    email: "",
    password: "",
    role: "customer",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      await instance.post("register/", formData);
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data) {
        const data = err.response.data;
        const msg = typeof data === "object"
          ? Object.values(data).flat().join(" ")
          : JSON.stringify(data);
        setError(msg);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600&family=Lato:wght@300;400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --saffron: #E8871A;
          --deep-saffron: #C5601A;
          --gold: #D4A017;
          --ivory: #FAF3E8;
          --cream: #F5E6CC;
          --dark-brown: #2C1A0E;
          --medium-brown: #5C3317;
          --warm-shadow: rgba(44,26,14,0.25);
        }

        .reg-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          font-family: 'Lato', sans-serif;
          background: var(--dark-brown);
          overflow: hidden;
        }

        /* ── RIGHT IMAGE PANEL (flipped from login) ── */
        .reg-right-img {
          position: relative;
          flex: 1;
          overflow: hidden;
          opacity: 0;
          transform: translateX(30px);
          transition: opacity 0.9s ease, transform 0.9s ease;
        }
        .reg-right-img.visible { opacity: 1; transform: translateX(0); }

        .reg-right-img img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          filter: brightness(0.68) saturate(1.2);
        }

        .img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            225deg,
            rgba(44,26,14,0.6) 0%,
            rgba(200,100,20,0.15) 60%,
            transparent 100%
          );
        }

        .img-brand {
          position: absolute;
          bottom: 48px; right: 44px; left: 44px;
          text-align: right;
        }

        .brand-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-weight: 300;
          font-size: 15px;
          color: rgba(250,243,232,0.75);
          letter-spacing: 0.12em; margin-bottom: 10px;
          text-transform: uppercase;
        }

        .brand-name {
          font-family: 'Cinzel', serif;
          font-size: 32px; font-weight: 600;
          color: var(--ivory);
          letter-spacing: 0.08em; line-height: 1.15;
          text-shadow: 0 2px 18px rgba(44,26,14,0.7);
        }
        .brand-name span { color: var(--saffron); }

        .divider-line {
          width: 52px; height: 2px;
          background: linear-gradient(90deg, var(--gold), var(--saffron));
          margin-bottom: 14px; border-radius: 2px;
          margin-left: auto;
        }

        .corner-motif {
          position: absolute;
          top: 36px; right: 36px;
          width: 60px; height: 60px;
          opacity: 0.55;
        }

        /* ── LEFT FORM PANEL ── */
        .reg-left-form {
          flex: 1.1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--ivory);
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateX(-30px);
          transition: opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s;
        }
        .reg-left-form.visible { opacity: 1; transform: translateX(0); }

        .form-texture {
          position: absolute; inset: 0;
          background-image:
            radial-gradient(circle at 80% 20%, rgba(232,135,26,0.06) 0%, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(212,160,23,0.06) 0%, transparent 50%);
          pointer-events: none;
        }
        .form-texture::before {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C5601A' fill-opacity='0.035'%3E%3Cpath d='M20 20c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10S20 25.523 20 20zm-20 0c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10S0 25.523 0 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .form-card {
          position: relative;
          width: 100%;
          max-width: 420px;
          padding: 0 44px;
          z-index: 1;
        }

        .form-icon { font-size: 36px; margin-bottom: 6px; display: block; }

        .form-heading {
          font-family: 'Cinzel', serif;
          font-size: 25px; font-weight: 600;
          color: var(--dark-brown);
          letter-spacing: 0.06em; margin-bottom: 4px;
        }

        .form-subheading {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 15px;
          color: var(--medium-brown);
          margin-bottom: 28px; letter-spacing: 0.04em;
        }

        .section-div {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 26px;
        }
        .section-div .line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(92,51,23,0.2), transparent);
        }
        .section-div .dot { width: 5px; height: 5px; border-radius: 50%; background: var(--saffron); opacity: 0.6; }

        /* Two-column row */
        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 0;
        }

        .field-group { margin-bottom: 18px; }

        .field-label {
          display: block;
          font-family: 'Lato', sans-serif; font-weight: 400;
          font-size: 10.5px; letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--medium-brown);
          margin-bottom: 7px; opacity: 0.85;
        }

        .field-wrapper { position: relative; }

        .field-input, .field-select {
          width: 100%;
          padding: 12px 14px 12px 38px;
          border: 1.5px solid rgba(92,51,23,0.18);
          border-radius: 6px;
          background: rgba(255,255,255,0.7);
          font-family: 'Lato', sans-serif;
          font-size: 13.5px;
          color: var(--dark-brown);
          outline: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
          letter-spacing: 0.02em;
          appearance: none;
          -webkit-appearance: none;
        }

        .field-input::placeholder { color: rgba(92,51,23,0.35); font-style: italic; }

        .field-input:focus, .field-select:focus {
          border-color: var(--saffron);
          background: rgba(255,255,255,0.95);
          box-shadow: 0 0 0 3px rgba(232,135,26,0.1);
        }

        .field-icon {
          position: absolute; left: 12px; top: 50%;
          transform: translateY(-50%);
          width: 15px; height: 15px;
          pointer-events: none;
          transition: all 0.2s;
        }

        /* Role toggle pills */
        .role-toggle {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 22px;
        }

        .role-pill {
          position: relative;
          cursor: pointer;
        }

        .role-pill input[type="radio"] {
          position: absolute; opacity: 0; width: 0; height: 0;
        }

        .role-pill-label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 14px;
          border: 1.5px solid rgba(92,51,23,0.18);
          border-radius: 6px;
          background: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: all 0.25s;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          color: var(--medium-brown);
          letter-spacing: 0.04em;
          user-select: none;
        }

        .role-pill input:checked + .role-pill-label {
          border-color: var(--saffron);
          background: linear-gradient(135deg, rgba(232,135,26,0.1), rgba(212,160,23,0.06));
          color: var(--deep-saffron);
          font-weight: 700;
          box-shadow: 0 0 0 3px rgba(232,135,26,0.1);
        }

        .role-pill-label:hover {
          border-color: rgba(232,135,26,0.45);
          background: rgba(255,255,255,0.8);
        }

        .role-emoji { font-size: 16px; }

        /* Error */
        .error-box {
          display: flex; align-items: flex-start; gap: 8px;
          padding: 10px 14px;
          border-radius: 6px;
          background: rgba(197,60,26,0.08);
          border: 1px solid rgba(197,60,26,0.2);
          margin-bottom: 16px;
          font-family: 'Lato', sans-serif;
          font-size: 12.5px;
          color: #A83220;
          line-height: 1.45;
        }

        /* Submit button */
        .reg-btn {
          width: 100%;
          padding: 14px;
          border: none; border-radius: 6px;
          background: linear-gradient(135deg, var(--saffron) 0%, var(--deep-saffron) 100%);
          color: var(--ivory);
          font-family: 'Cinzel', serif;
          font-size: 12.5px; font-weight: 600;
          letter-spacing: 0.22em; text-transform: uppercase;
          cursor: pointer;
          position: relative; overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(197,96,26,0.35);
        }

        .reg-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
          pointer-events: none;
        }

        .reg-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 7px 28px rgba(197,96,26,0.45);
        }
        .reg-btn:active:not(:disabled) { transform: translateY(0); }
        .reg-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .btn-loader {
          display: inline-block;
          width: 13px; height: 13px;
          border: 2px solid rgba(250,243,232,0.4);
          border-top-color: var(--ivory);
          border-radius: 50%;
          animation: spin 0.75s linear infinite;
          margin-right: 8px; vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .login-prompt {
          text-align: center; margin-top: 22px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px; color: var(--medium-brown); opacity: 0.75;
        }
        .login-prompt a {
          color: var(--deep-saffron); text-decoration: none;
          font-style: italic; font-weight: 600; margin-left: 4px;
          transition: opacity 0.2s;
        }
        .login-prompt a:hover { opacity: 0.7; }

        .form-bottom-motif {
          display: flex; justify-content: center;
          gap: 8px; margin-top: 28px; opacity: 0.3;
        }
        .motif-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--saffron); }
        .motif-dash { width: 20px; height: 4px; border-radius: 2px; background: var(--gold); }

        @media (max-width: 768px) {
          .reg-right-img { display: none; }
          .reg-left-form { flex: 1; }
          .form-card { padding: 0 24px; }
        }

        @media (max-width: 420px) {
          .field-row { grid-template-columns: 1fr; gap: 0; }
        }
      `}</style>

      <div className="reg-root">

        {/* ── LEFT FORM ── */}
        <div className={`reg-left-form ${mounted ? "visible" : ""}`}>
          <div className="form-texture" />

          <div className="form-card">
            <span className="form-icon">🪷</span>
            <h2 className="form-heading">Join Varaha Crafts</h2>
            <p className="form-subheading">Create your account &amp; begin your artisan journey</p>

            <div className="section-div">
              <div className="line" /><div className="dot" /><div className="line" />
            </div>

            {/* Username + First Name row */}
            <div className="field-row">
              <div className="field-group">
                <label className="field-label">Username</label>
                <div className="field-wrapper">
                  <input
                    className="field-input"
                    name="username"
                    placeholder="username"
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => setFocused("username")}
                    onBlur={() => setFocused(null)}
                    autoComplete="username"
                  />
                  <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke={focused === "username" ? "#E8871A" : "#5C3317"} strokeWidth="1.8" style={{opacity: focused==="username"?0.85:0.4}}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">First Name</label>
                <div className="field-wrapper">
                  <input
                    className="field-input"
                    name="first_name"
                    placeholder="name"
                    value={formData.first_name}
                    onChange={handleChange}
                    onFocus={() => setFocused("first_name")}
                    onBlur={() => setFocused(null)}
                  />
                  <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke={focused === "first_name" ? "#E8871A" : "#5C3317"} strokeWidth="1.8" style={{opacity: focused==="first_name"?0.85:0.4}}>
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12z" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4.8 21.6c0-3.98 3.22-7.2 7.2-7.2s7.2 3.22 7.2 7.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="field-group">
              <label className="field-label">Email Address</label>
              <div className="field-wrapper">
                <input
                  className="field-input"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  autoComplete="email"
                />
                <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke={focused === "email" ? "#E8871A" : "#5C3317"} strokeWidth="1.8" style={{opacity: focused==="email"?0.85:0.4}}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22,6 12,13 2,6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Password */}
            <div className="field-group">
              <label className="field-label">Password</label>
              <div className="field-wrapper">
                <input
                  className="field-input"
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  autoComplete="new-password"
                />
                <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke={focused === "password" ? "#E8871A" : "#5C3317"} strokeWidth="1.8" style={{opacity: focused==="password"?0.85:0.4}}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Role — pill toggle */}
            <div className="field-group" style={{marginBottom: 6}}>
              <label className="field-label">I am joining as</label>
              <div className="role-toggle">
                <label className="role-pill">
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={formData.role === "customer"}
                    onChange={handleChange}
                  />
                  <span className="role-pill-label">
                    <span className="role-emoji">🛍️</span> Customer
                  </span>
                </label>

                <label className="role-pill">
                  <input
                    type="radio"
                    name="role"
                    value="artist"
                    checked={formData.role === "artist"}
                    onChange={handleChange}
                  />
                  <span className="role-pill-label">
                    <span className="role-emoji">🎨</span> Artist
                  </span>
                </label>
              </div>
            </div>

            {error && (
              <div className="error-box">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              className="reg-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading && <span className="btn-loader" />}
              {loading ? "Creating Account..." : "Begin Your Journey"}
            </button>

            <p className="login-prompt">
              Already a member?
              <a href="/login">Sign in here</a>
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

        {/* ── RIGHT IMAGE ── */}
        <div className={`reg-right-img ${mounted ? "visible" : ""}`}>
          <img src={ganeshImage} alt="Ganesha Handicraft" />
          <div className="img-overlay" />

          <svg className="corner-motif" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M55 55 L55 5 L5 5" stroke="#E8871A" strokeWidth="2" strokeLinecap="round"/>
            <path d="M55 5 Q30 5 30 30 Q30 55 5 55" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 4"/>
            <circle cx="55" cy="5" r="3" fill="#E8871A"/>
            <circle cx="5" cy="55" r="3" fill="#D4A017" opacity="0.6"/>
          </svg>

          <div className="img-brand">
            <div className="divider-line" />
            <p className="brand-tagline">Artisan Creations from Etikoppaka</p>
            <h1 className="brand-name">Varaha<span>Crafts</span></h1>
          </div>
        </div>

      </div>
    </>
  );
}

export default Register;