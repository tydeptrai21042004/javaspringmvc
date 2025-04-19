// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api'; // Assuming API service is configured
import './HomePage.css';

// Placeholder data - replace with actual API call result
const placeholderFeaturedProducts = [
  { id: 1, name: 'High-Performance Laptop X', price: 1499.99, imageUrls: ['/images/placeholder-laptop1.jpg'], description: '...' },
  { id: 2, name: 'Ultra HD 27" Monitor', price: 399.00, imageUrls: ['/images/placeholder-monitor.jpg'], description: '...' },
  { id: 3, name: 'Mechanical Gaming Keyboard', price: 129.50, imageUrls: ['/images/placeholder-keyboard.jpg'], description: '...' },
  { id: 4, name: 'Wireless Ergonomic Mouse', price: 79.99, imageUrls: ['/images/placeholder-mouse.jpg'], description: '...' },
];

const placeholderCategories = [
    { id: 'laptops', name: 'Laptops', icon: '💻' }, // Replace with actual icons/images
    { id: 'desktops', name: 'Desktops', icon: '🖥️' },
    { id: 'monitors', name: 'Monitors', icon: '📺' },
    { id: 'accessories', name: 'Accessories', icon: '⌨️' },
]

const placeholderTestimonials = [
    { id: 1, quote: "Amazing selection and prices! Got my dream setup from here.", author: "Alex Johnson" },
    { id: 2, quote: "Customer service was incredibly helpful in choosing the right components.", author: "Maria Garcia" },
    { id: 3, quote: "Fast shipping and products arrived in perfect condition. Highly recommend!", author: "David Chen" },
]

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // --- Fetch Featured Products ---
    useEffect(() => {
        setIsLoading(true);
        setError(null);
        // Replace with actual API call: API.get('/products?featured=true&limit=4')
        new Promise(resolve => setTimeout(() => resolve({ data: placeholderFeaturedProducts }), 1000)) // Simulate API call
            .then(response => {
                setFeaturedProducts(response.data);
            })
            .catch(err => {
                console.error("Failed to fetch featured products:", err);
                setError("Could not load featured products.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []); // Empty dependency array means run once on mount

    // --- Search Handling ---
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div className="home-page">
            {/* --- Hero Section --- */}
            <header className="hero-section">
                 <div className="hero-content">
                    <h1 className="hero-title">Power Your Potential</h1>
                    <p className="hero-subtitle">Discover top-tier computing solutions tailored for you.</p>
                    {/* Link CTA button to products page */}
                    <Link to="/products" className="cta-button hero-cta">Shop All Products</Link>
                 </div>
                 {/* Optional: Add a background overlay div here if needed for text contrast */}
                 {/* <div className="hero-overlay"></div> */}
            </header>

            {/* --- Search Section --- */}
            <section className="search-section-container">
                <form onSubmit={handleSearchSubmit} className="search-form">
                    <input
                        type="search" // Use type="search" for better semantics
                        placeholder="Search laptops, components, accessories..."
                        className="search-input"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        aria-label="Search products"
                    />
                    <button type="submit" className="search-button" aria-label="Submit search">
                        {/* Optional: Use an icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                    </button>
                </form>
            </section>

             {/* --- Features Section --- */}
             <section className="features-section section-padding">
                <h2 className="section-title">Why Choose Us?</h2>
                <div className="features-grid">
                    {/* Feature Item 1 */}
                    <div className="feature-item">
                         <div className="feature-icon">🌟</div> {/* Replace with actual icons */}
                        <h3>Quality Hardware</h3>
                        <p>Handpicked selection from industry-leading brands.</p>
                    </div>
                     {/* Feature Item 2 */}
                     <div className="feature-item">
                         <div className="feature-icon">💲</div>
                        <h3>Competitive Prices</h3>
                        <p>Get the best value for your budget with great deals.</p>
                    </div>
                    {/* Feature Item 3 */}
                    <div className="feature-item">
                        <div className="feature-icon">🧑‍🔧</div>
                        <h3>Expert Support</h3>
                        <p>Knowledgeable staff ready to assist you.</p>
                    </div>
                     {/* Feature Item 4 */}
                     <div className="feature-item">
                        <div className="feature-icon">🚚</div>
                        <h3>Fast Shipping</h3>
                        <p>Reliable and speedy delivery to your doorstep.</p>
                    </div>
                </div>
            </section>

            {/* --- Featured Products Section --- */}
            <section className="featured-products-section section-padding">
                <h2 className="section-title">Featured Products</h2>
                 {isLoading && <div className="loading-indicator">Loading products...</div>}
                 {error && <div className="error-message">{error}</div>}
                 {!isLoading && !error && featuredProducts.length > 0 && (
                    <div className="product-list home-product-list">
                         {/* Map over featured products */}
                         {featuredProducts.map(p => (
                            <div key={p.id} className="product-item home-product-item">
                                <Link to={`/products/${p.id}`} className="product-item-link">
                                    <img
                                        src={p.imageUrls?.[0] || '/images/placeholder-default.png'} // Provide a default placeholder
                                        alt={p.name}
                                        className="product-thumb home-product-thumb"
                                        loading="lazy" // Lazy load images below the fold
                                    />
                                    <div className="product-info home-product-info">
                                        <h4 className="product-name home-product-name">{p.name}</h4>
                                        <span className="product-price home-product-price">${p.price.toFixed(2)}</span>
                                    </div>
                                </Link>
                                {/* Optional: Add to Cart Button */}
                                {/* <button className="add-cart-btn small-btn">Add</button> */}
                            </div>
                        ))}
                    </div>
                )}
                {!isLoading && !error && featuredProducts.length === 0 && (
                    <p>No featured products available right now.</p>
                )}
                 <div className="view-all-link">
                    <Link to="/products" className="cta-button secondary-cta">View All Products</Link>
                </div>
            </section>

             {/* --- Categories Section --- */}
            <section className="categories-section section-padding">
                <h2 className="section-title">Shop by Category</h2>
                <div className="categories-grid">
                     {placeholderCategories.map(cat => (
                        <Link key={cat.id} to={`/products?category=${cat.id}`} className="category-item">
                            <div className="category-icon">{cat.icon}</div>
                            <h3 className="category-name">{cat.name}</h3>
                        </Link>
                    ))}
                </div>
            </section>


            {/* --- Testimonials Section --- */}
             <section className="testimonials-section section-padding">
                <h2 className="section-title">What Our Customers Say</h2>
                <div className="testimonials-grid">
                     {placeholderTestimonials.map(t => (
                        <blockquote key={t.id} className="testimonial-item">
                            <p className="testimonial-quote">"{t.quote}"</p>
                            <footer className="testimonial-author">- {t.author}</footer>
                        </blockquote>
                    ))}
                </div>
            </section>


             {/* --- About Us Section (optional enhancement) --- */}
            <section className="about-us-section section-padding">
                 <h2 className="section-title">About Our Shop</h2>
                 <p className="about-us-text">
                    Founded in 2010, Computer Sales is dedicated to providing cutting-edge technology and exceptional customer service. We believe in empowering our customers with the best tools for work, play, and creativity.
                </p>
             </section>

             {/* --- Footer --- */}
            <footer className="footer-section">
                 <div className="footer-content">
                     <div className="footer-contact">
                        <h4>Contact Us</h4>
                        <p>Email: <a href="mailto:info@computersales.com">info@computersales.com</a></p>
                        <p>Phone: <a href="tel:+15551234567">+1 (555) 123-4567</a></p>
                        {/* Add address if applicable */}
                    </div>
                     <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/products">Products</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                        </ul>
                    </div>
                     <div className="footer-social">
                        <h4>Follow Us</h4>
                        {/* Add actual social media links/icons */}
                        <a href="#" aria-label="Facebook">F</a>
                        <a href="#" aria-label="Twitter">T</a>
                        <a href="#" aria-label="Instagram">I</a>
                     </div>
                </div>
                 <div className="footer-bottom">
                     <p>&copy; {new Date().getFullYear()} Computer Sales. All rights reserved.</p>
                </div>
             </footer>
        </div>
    );
}