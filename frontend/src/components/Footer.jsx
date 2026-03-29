import { Link } from "react-router-dom";


export default function Footer() {
  return (
<footer className="site-footer">
        <div className="footer-top">

          {/* Brand */}
          <div className="footer-brand">
            <h3 className="footer-logo">Varaha<span>Crafts</span></h3>
            <p>Connecting the artisans of Etikoppaka village with the world — one lacquer toy at a time.</p>
            <div className="footer-socials">
              <a href="https://www.instagram.com/chaitu_anya" aria-label="Instagram">
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
              <li><a href="https://www.google.com/maps/place/Etikoppaka,+Andhra+Pradesh/@17.495706,82.7320702,14z/data=!3m1!4b1!4m6!3m5!1s0x3a39bd2d675af4e9:0x770119155796ff03!8m2!3d17.4866806!4d82.7458524!16zL20vMGRjcXF0?entry=ttu&g_ep=EgoyMDI2MDMyNC4wIKXMDSoASAFQAw%3D%3D">Location</a></li>
              <li><a href="https://xn--i1bj3fqcyde.xn--11b7cb3a6a.xn--h2brj9c/hi/explore-india/odop/details/etikoppaka-toys">ODOP</a></li>
              <li><Link to="/products?category=gifting">Gift Sets</Link></li>
            </ul>
          </div>

          {/* Artisan */}
          <div className="footer-col">
            <h4>Artisans</h4>
            <ul>
              <li><Link to="/register">Join as Artisan</Link></li>
              
              <li><Link to="/story">Our Story</Link></li>
              <li><Link to="/register">Meet the Makers</Link></li>
              <li><a href="https://en.wikipedia.org/wiki/Etikoppaka">About the GI Tag</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><Link to="/">FAQs</Link></li>
              <li><Link to="/">Shipping & Returns</Link></li>
              <li><a href="tel:+918309942984">Contact Us</a></li>
              <li><a href="mailto:varahacraftsonline@gmail.com">varahacraftsonline@gmail.com</a></li>
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
  );
}
