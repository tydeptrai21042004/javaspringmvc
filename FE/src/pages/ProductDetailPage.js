import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Added Link
import API, { getFeedback, postFeedback } from '../services/api';
import './ProductDetailPage.css';

// Helper function to format date/time
const formatDateTime = (isoString) => {
  if (!isoString) return '';
  try {
    return new Date(isoString).toLocaleString(undefined, { // Use user's locale
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return isoString; // Fallback
  }
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const [prod, setProd] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [newFb, setNewFb] = useState({ rating: 5, comment: '' });
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false); // Loading state for feedback
  const [isAddingToCart, setIsAddingToCart] = useState(false); // Loading state for cart
  const [cartMessage, setCartMessage] = useState(''); // Message for cart action
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Check for token
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username'); // Get username for feedback display check

  // Fetch Product Data
  useEffect(() => {
    API.get(`/products/${id}`)
      .then(r => {
        setProd(r.data);
        // Set the first image as the selected one initially
        if (r.data?.imageUrls?.length > 0) {
          setSelectedImageUrl(r.data.imageUrls[0]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch product:", err);
        // Optionally navigate away or show an error message
        // navigate('/products'); // Or show an error component
      });
  }, [id]);

  // Fetch Feedback Data (memoized)
  const fetchFeedback = useCallback(async () => {
      try {
          const res = await getFeedback(id);
          setFeedback(res.data);
      } catch (err) {
          console.error("Failed to fetch feedback:", err);
      }
  }, [id]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);


  // Handle Thumbnail Click
  const handleThumbnailClick = (url) => {
    setSelectedImageUrl(url);
  };

  // Handle Feedback Input Change
  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setNewFb(prev => ({ ...prev, [name]: name === 'rating' ? Number(value) : value }));
  };

  // Submit Feedback
  const submitFeedback = async (e) => {
    e.preventDefault();
    if (!token) {
        // Redirect to login but pass the current page to return to
        navigate('/login', { state: { from: `/products/${id}` } });
        return;
    }
    if (!newFb.comment.trim()) {
        alert("Please enter a comment."); // Basic validation
        return;
    }

    setIsSubmittingFeedback(true);
    try {
      await postFeedback(id, newFb);
      setNewFb({ rating: 5, comment: '' }); // Reset form
      await fetchFeedback(); // Re-fetch feedback
    } catch (err) {
      console.error("Failed to post feedback:", err);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Add to Cart
  const handleAddToCart = async () => {
    if (!token) {
        navigate('/login', { state: { from: `/products/${id}` } });
        return;
    }
    setIsAddingToCart(true);
    setCartMessage('');
    try {
      await API.post('/cart', { productId: prod.id, quantity: 1 }); // Assuming default quantity 1
      setCartMessage('Added to cart successfully!');
      // Optional: Hide message after a few seconds
      setTimeout(() => setCartMessage(''), 3000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      setCartMessage('Failed to add to cart. Please try again.');
       setTimeout(() => setCartMessage(''), 3000);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Check if the current logged-in user has already left feedback
  const userHasGivenFeedback = feedback.some(fb => fb.username === username);

  if (!prod) return <div className="loading-indicator">Loading product details…</div>;

  return (
    <div className="product-detail-page">
      {/* Optional Breadcrumbs */}
      <nav className="breadcrumbs">
          <Link to="/">Home</Link> &gt; <Link to="/products">Products</Link> &gt; {prod.name}
      </nav>

      <div className="detail-layout">
        {/* Image Gallery Column */}
        <div className="image-gallery-container">
          <div className="main-image-container">
            {selectedImageUrl ? (
              <img src={selectedImageUrl} alt={`${prod.name} - main view`} className="main-image" />
            ) : (
              <div className="main-image placeholder">No Image Available</div>
            )}
          </div>
          {prod.imageUrls?.length > 1 && (
            <div className="thumbnail-list">
              {prod.imageUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`${prod.name} - thumbnail ${idx + 1}`}
                  className={`thumbnail-image ${url === selectedImageUrl ? 'active' : ''}`}
                  onClick={() => handleThumbnailClick(url)}
                  // onMouseOver={() => handleThumbnailClick(url)} // Optional: Change on hover too
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div className="product-details-container">
          <h2 className="product-title">{prod.name}</h2>
          <p className="price">${prod.price.toFixed(2)}</p>
          <p className="description">{prod.description}</p>

          {/* Add to Cart Section */}
          {role === 'ROLE_USER' && (
             <div className="cart-action-section">
                {/* Placeholder for quantity selector if needed */}
                <button
                    className="add-cart-btn"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                >
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                 {cartMessage && <span className={`cart-message ${cartMessage.includes('Failed') ? 'error' : 'success'}`}>{cartMessage}</span>}
             </div>
          )}
           {role !== 'ROLE_USER' && !token && ( // Prompt login for non-users
                <p className="login-prompt">
                    <Link to={`/login?redirect=/products/${id}`}>Log in</Link> to add items to your cart.
                </p>
            )}
        </div>
      </div>

      {/* Feedback Section - Full Width Below Columns */}
      <section className="feedback-section">
        <h3>Feedback & Ratings</h3>
        {feedback.length === 0 ? (
          <p className="no-feedback">Be the first to leave feedback for this product!</p>
        ) : (
          <ul className="feedback-list">
            {feedback.map(item => (
              <li key={item.id} className="feedback-item">
                <div className="feedback-header">
                    <strong className="feedback-username">{item.username || 'Anonymous'}</strong>
                    <span className="feedback-rating">Rated: {item.rating} / 5</span>
                </div>
                <p className="feedback-comment">{item.comment}</p>
                <small className="feedback-timestamp">
                  {formatDateTime(item.createdAt)}
                </small>
              </li>
            ))}
          </ul>
        )}

        {/* Feedback Form */}
        {token && role === 'ROLE_USER' && !userHasGivenFeedback && ( // Show form only if logged in as user and hasn't given feedback
            <form onSubmit={submitFeedback} className="feedback-form">
                <h4>Leave Your Feedback</h4>
                <div className="form-group rating-group">
                <label htmlFor="rating">Rating:</label>
                <select
                    id="rating"
                    name="rating"
                    value={newFb.rating}
                    onChange={handleFeedbackChange}
                    required
                    disabled={isSubmittingFeedback}
                >
                    {[5, 4, 3, 2, 1].map(n => ( // Descending order often preferred
                    <option key={n} value={n}>
                        {n} Star{n > 1 ? 's' : ''}
                    </option>
                    ))}
                </select>
                </div>
                <div className="form-group">
                <label htmlFor="comment">Comment:</label>
                <textarea
                    id="comment"
                    name="comment"
                    placeholder="Share your thoughts about the product..."
                    value={newFb.comment}
                    onChange={handleFeedbackChange}
                    required
                    disabled={isSubmittingFeedback}
                    rows={4} // Suggest number of lines
                />
                </div>
                <button type="submit" className="submit-feedback-btn" disabled={isSubmittingFeedback}>
                 {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </form>
        )}
        {token && role === 'ROLE_USER' && userHasGivenFeedback && (
            <p className="feedback-thanks">Thanks for your feedback!</p>
        )}
        {!token && (
            <p className="login-prompt feedback-login-prompt">
               <Link to={`/login?redirect=/products/${id}`}>Log in</Link> to leave feedback.
            </p>
        )}
      </section>
    </div>
  );
}