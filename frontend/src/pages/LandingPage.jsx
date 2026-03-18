import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';
import Header from '../components/Header';
/* ─── Sticky Header (hidden by default, appears on scroll-up) ── */


/* ─── Animated counter ──────────────────────────────────────── */
const Counter = ({ to, suffix = '', start }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    const dur = 1800;
    let t0 = null;
    const tick = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(ease * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [start, to]);
  return <>{val}{suffix}</>;
};

/* ─── Landing Page ──────────────────────────────────────────── */
export default function LandingPage() {
  const [statsOn, setStatsOn] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    // Scroll reveal
    const revealObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => revealObs.observe(el));

    // Stats
    const statsObs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsOn(true); },
      { threshold: 0.35 }
    );
    if (statsRef.current) statsObs.observe(statsRef.current);

    return () => { revealObs.disconnect(); statsObs.disconnect(); };
  }, []);

  return (
    <div className="landing-container">
      <Header />

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="hero-section">
        <div className="hero-bg"></div>
        <div className="hero-overlay"></div>
        <div className="hero-grain"></div>

        <div className="hero-content reveal-on-scroll">
          <div className="hero-badge">
            <span className="badge-pulse"></span>
            Etikoppaka · Andhra Pradesh · GI Tagged
          </div>
          <h1>5,000 Years of<br />Lacquer &amp; Light.</h1>
          <p>Where ivory-soft wood meets living colour —<br />straight from artisan hands on the Varaha River.</p>
          <div className="hero-ctas">
            <Link to="/products" className="btn-primary">
              Explore the Toys
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
            <Link to="/about" className="btn-ghost">Our Village</Link>
          </div>
        </div>

        <div className="hero-scroll-hint">
          <div className="scroll-track"><div className="scroll-thumb"></div></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* ══ STATS ═════════════════════════════════════════════ */}
      <section className="stats-bar reveal-on-scroll" ref={statsRef}>
        {[
          { to: 5000, suffix: '+', label: 'Years of Tradition' },
          { to: 120,  suffix: '+', label: 'Artisan Families'   },
          { to: 0,    suffix: '',  label: 'Synthetic Dyes Used' },
          { to: 1,    suffix: '',  label: 'GI Certification'    },
        ].map((s, i) => (
          <React.Fragment key={i}>
            {i > 0 && <div className="stats-sep" />}
            <div className="stat-item">
              <span className="stat-num"><Counter to={s.to} suffix={s.suffix} start={statsOn} /></span>
              <span className="stat-lbl">{s.label}</span>
            </div>
          </React.Fragment>
        ))}
      </section>

      {/* ══ FEATURES ══════════════════════════════════════════ */}
      <section className="features-section">
        {[
          { icon:'🪵', title:'Ankudi Wood',        body:'Hand-turned on a foot-powered lathe from Wrightia tinctoria — a soft wood uniquely suited to the lacquer-on-lathe technique.' },
          { icon:'🌿', title:'Natural Lac & Dyes', body:'Vivid colour from turmeric, indigo, kumkum & pure lac resin. Zero synthetic chemicals — safe for children, gentle on the earth.' },
          { icon:'🤝', title:'Direct from Artisan',body:'Every rupee goes straight to the craftsperson\'s family. No middlemen — your purchase sustains a living, breathing tradition.' },
        ].map((f, i) => (
          <div key={i} className={`feature-card reveal-on-scroll fade-up delay-${i+1}`}>
            <div className="feat-icon-ring">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </div>
        ))}
      </section>

      {/* ══ ARTISAN SPOTLIGHT ═════════════════════════════════ */}
      <section className="spotlight reveal-on-scroll">
        <div className="spotlight-img-wrap">
          <img
            src="https://images.unsplash.com/photo-1530968033775-2c92736b131e?auto=format&fit=crop&q=80"
            alt="Etikoppaka artisan at a lathe"
          />
          <div className="spotlight-chip">Est. 3000 BCE</div>
        </div>
        <div className="spotlight-body">
          <span className="eyebrow">Meet the Makers</span>
          <h2>A Family's Legacy<br />in Every Turn</h2>
          <blockquote>
            "The lac speaks when the wood spins. My father taught me — the colour must breathe, never be forced."
          </blockquote>
          <p className="attr">— Subrahmanyam Rao, 3rd-generation craftsman, Etikoppaka</p>
          <p className="body-text">
            Etikoppaka village on the banks of the Varaha River has been home to this GI-tagged craft for over five millennia. When you shop here, you connect directly with families who have kept this art alive — and help it thrive for the next generation.
          </p>
          <Link to="/register" className="btn-outline">Sell as an Artisan →</Link>
        </div>
      </section>

      {/* ══ PROCESS ═══════════════════════════════════════════ */}
      <section className="process-section">
        <div className="section-head reveal-on-scroll">
          <span className="eyebrow">The Craft</span>
          <h2>The Making of a Toy</h2>
          <div className="deco-line"></div>
          <p className="sub">A centuries-old process, unchanged — and unrepeatable by machine.</p>
        </div>
        <div className="process-track">
          {[
            { n:'01', title:'Harvest the Wood',     desc:'Ankudi branches are hand-selected, dried naturally, and cut into blanks sized for each toy form.' },
            { n:'02', title:'Turn on the Lathe',    desc:'A foot-powered lathe shapes the wood while the artisan presses lac directly — friction melts it on.' },
            { n:'03', title:'Layer Natural Colour', desc:'Plant-based dyes applied in successive coats, each burnished to a living sheen that deepens over time.' },
          ].map((s, i) => (
            <React.Fragment key={s.n}>
              {i > 0 && <div className="process-connector"><div className="connector-line"></div></div>}
              <div className={`process-step reveal-on-scroll fade-up delay-${i+1}`}>
                <span className="proc-num">{s.n}</span>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ══ CATEGORIES ════════════════════════════════════════ */}
      <section className="categories-section">
        <div className="section-head reveal-on-scroll">
          <span className="eyebrow">Collections</span>
          <h2>Shop by Category</h2>
          <div className="deco-line"></div>
        </div>
        <div className="cat-grid">
          {[
            { slug:'toys',      label:'Lacquer Toys',      sub:'For play & décor', img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80' },
            { slug:'home-decor',label:'Home Décor',        sub:'Walls, shelves & tables', img:'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80' },
            { slug:'gifting',   label:'Gift Sets',         sub:'Curated for loved ones', img:'https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?auto=format&fit=crop&q=80' },
          ].map((c, i) => (
            <Link key={c.slug} to={`/products?category=${c.slug}`}
              className={`cat-card reveal-on-scroll fade-up delay-${i+1}`}>
              <img src={c.img} alt={c.label} className="cat-img" />
              <div className="cat-overlay"></div>
              <div className="cat-text">
                <p className="cat-sub">{c.sub}</p>
                <h3>{c.label}</h3>
                <span className="cat-arrow">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══ GI TAG TRUST ══════════════════════════════════════ */}
      <section className="gi-section reveal-on-scroll">
        <div className="gi-seal">
          <svg viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="36" stroke="#C8963E" strokeWidth="1.5"/>
            <circle cx="40" cy="40" r="28" stroke="#C8963E" strokeWidth="0.7" strokeDasharray="3 3"/>
            <path d="M27 40l9 9L53 29" stroke="#C8963E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="gi-body">
          <span className="gi-tag-label">Geographical Indication (GI) Tagged</span>
          <h2>Authenticity You Can Feel</h2>
          <p>Every product on this platform is verified to carry India's official GI tag — guaranteeing it was genuinely handcrafted in Etikoppaka village using traditional methods. No imitations, no shortcuts.</p>
        </div>
      </section>

      {/* ══ NEWSLETTER ════════════════════════════════════════ */}
      <section className="newsletter-section reveal-on-scroll">
        <div className="nl-pattern"></div>
        <div className="nl-body">
          <span className="eyebrow light">Join the Community</span>
          <h2>Be Part of the Story</h2>
          <p>Artisan updates, behind-the-craft stories, and first access to limited festival batches — straight from Etikoppaka to your inbox.</p>
          <form className="nl-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" required />
            <button type="submit" className="btn-primary">Subscribe</button>
          </form>
          <p className="nl-note">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════ */}
      <footer className="site-footer">
        <div className="footer-top">

          {/* Brand */}
          <div className="footer-brand">
            <h3 className="footer-logo">Varaha<span>Crafts</span></h3>
            <p>Connecting the artisans of Etikoppaka village with the world — one lacquer toy at a time.</p>
            <div className="footer-socials">
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="4"/><polygon points="10,9 15,12 10,15" fill="currentColor" stroke="none"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?category=toys">Lacquer Toys</Link></li>
              <li><Link to="/products?category=home-decor">Home Décor</Link></li>
              <li><Link to="/products?category=gifting">Gift Sets</Link></li>
            </ul>
          </div>

          {/* Artisan */}
          <div className="footer-col">
            <h4>Artisans</h4>
            <ul>
              <li><Link to="/register">Join as Artisan</Link></li>
              <li><Link to="/artisans">Meet the Makers</Link></li>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/gi-tag">About the GI Tag</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><Link to="/faq">FAQs</Link></li>
              <li><Link to="/shipping">Shipping & Returns</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><a href="mailto:hello@etikoppakacrafts.in">varahacraftsonline@gmail.com</a></li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} VarahaCrafts. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <span>·</span>
            <Link to="/terms">Terms of Use</Link>
          </div>
          <p className="footer-gi-note">
            🏺 Proud to carry India's <strong>GI Tag</strong> — Etikoppaka Lacquerware, Andhra Pradesh
          </p>
        </div>
      </footer>

    </div>
  );
}