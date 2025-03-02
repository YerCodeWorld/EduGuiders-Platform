// src/components/layout/Footer.tsx
import { Link } from 'react-router-dom';
import '../../styles/layout/footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="footer-container">
                <div className="footer-grid">
                    {/* Company information */}
                    <div className="footer-section about">
                        <h3>EduGuiders</h3>
                        <p>
                            A comprehensive platform connecting students with expert teachers.
                            Our mission is to make finding the right educational guide easier than ever.
                        </p>
                        <div className="social-links">
                            <a href="#" aria-label="Facebook">
                                <i className="fa fa-facebook"></i>
                            </a>
                            <a href="#" aria-label="Twitter">
                                <i className="fa fa-twitter"></i>
                            </a>
                            <a href="#" aria-label="Instagram">
                                <i className="fa fa-instagram"></i>
                            </a>
                            <a href="#" aria-label="LinkedIn">
                                <i className="fa fa-linkedin"></i>
                            </a>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div className="footer-section links">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/teachers">Teachers</Link></li>
                            <li><Link to="/articles">Journal</Link></li>
                            <li><Link to="/courses">Courses</Link></li>
                            <li><Link to="/games">Games</Link></li>
                            <li><Link to="/competitions">Competitions</Link></li>
                        </ul>
                    </div>

                    {/* Support links */}
                    <div className="footer-section links">
                        <h3>Support</h3>
                        <ul>
                            <li><Link to="/help">Help Center</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact information */}
                    <div className="footer-section contact">
                        <h3>Contact Us</h3>
                        <address>
                            <p><i className="fa fa-map-marker"></i> 123 Education Street, Knowledge City</p>
                            <p><i className="fa fa-phone"></i> (123) 456-7890</p>
                            <p><i className="fa fa-envelope"></i> contact@eduguiders.com</p>
                        </address>

                        {/* Newsletter subscription */}
                        <div className="newsletter">
                            <h4>Subscribe to our newsletter</h4>
                            <form className="newsletter-form">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    required
                                />
                                <button type="submit">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright bar */}
            <div className="copyright-bar">
                <div className="container">
                    <p>&copy; {currentYear} EduGuiders. All rights reserved.</p>
                    <p>Designed with <span className="heart">♥</span> for educators and learners</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;