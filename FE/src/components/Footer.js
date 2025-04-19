// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for internal navigation
import './Footer.css'; // Import the CSS file

export default function Footer() {
    // Optional: State for newsletter signup
    // const [email, setEmail] = useState('');
    // const handleNewsletterSubmit = (e) => {
    //  e.preventDefault();
    //  console.log('Newsletter signup:', email);
    //  // Add API call logic here
    //  setEmail('');
    // };

    return (
        <footer className="site-footer">
            <div className="footer-container">

                {/* Column 1: About / Brand */}
                <div className="footer-column about-column">
                    <h4 className="footer-brand">Computer Sales</h4> {/* Or use an <img> */}
                    <p>
                        Your one-stop shop for the latest in computing technology. Quality products and expert service since 2010.
                    </p>
                     {/* Optional Newsletter Signup */}
                    {/* <div className="newsletter-signup">
                        <h5>Stay Updated</h5>
                        <form onSubmit={handleNewsletterSubmit}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit">Subscribe</button>
                        </form>
                    </div> */}
                </div>

                {/* Column 2: Quick Links */}
                <div className="footer-column links-column">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/products">Products</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><Link to="/faq">FAQ</Link></li>
                    </ul>
                </div>

                {/* Column 3: Contact Info */}
                <div className="footer-column contact-column">
                    <h4>Contact Info</h4>
                    <address>
                        123 Tech Avenue<br />
                        Silicon Valley, CA 94000<br />
                        USA<br />
                        <a href="tel:+15551234567">Phone: +1 (555) 123-4567</a><br />
                        <a href="mailto:info@computersales.com">Email: info@computersales.com</a>
                    </address>
                </div>

                {/* Column 4: Social Media */}
                <div className="footer-column social-column">
                    <h4>Follow Us</h4>
                    <div className="social-links">
                        {/* Replace # with actual links and use icons (e.g., FontAwesome, SVGs) */}
                        <a href="#" aria-label="Facebook" title="Facebook"><i className="fab fa-facebook-f"></i> F </a>
                        <a href="#" aria-label="Twitter" title="Twitter"><i className="fab fa-twitter"></i> T </a>
                        <a href="#" aria-label="Instagram" title="Instagram"><i className="fab fa-instagram"></i> I </a>
                        <a href="#" aria-label="LinkedIn" title="LinkedIn"><i className="fab fa-linkedin-in"></i> L </a>
                    </div>
                </div>

            </div>

            {/* Footer Bottom Bar */}
            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} Computer Sales. All rights reserved.</p>
                <nav className="footer-legal-links">
                    <Link to="/privacy">Privacy Policy</Link>
                    <span>|</span>
                    <Link to="/terms">Terms of Service</Link>
                </nav>
            </div>
        </footer>
    );
}