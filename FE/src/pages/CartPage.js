import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import API from '../services/api';
import './CartPage.css'; // Import the CSS

// Optional: If you want to use an icon for the remove button
// import { FaTrash } from 'react-icons/fa';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    setError(null); // Reset error on new fetch
    API.get('/cart')
      .then(r => {
        setCart(r.data || []); // Ensure cart is always an array
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch cart:", err);
        setError("Could not load your cart. Please try again later.");
        setCart([]);
        setIsLoading(false);
      });
  }, []);

  const removeItem = id => {
    // Optimistic UI update: Remove item immediately
    const originalCart = [...cart];
    setCart(current => current.filter(item => item.id !== id));

    API.delete(`/cart/${id}`)
      .then(() => {
        // Removal successful, state is already updated
        console.log(`Item ${id} removed successfully.`);
      })
      .catch(err => {
        // Revert if API call fails
        console.error(`Failed to remove item ${id}:`, err);
        setCart(originalCart); // Restore previous cart state
        // Optionally show an error message to the user
        alert("Failed to remove item. Please try again.");
      });
  };

  // Calculate total only when cart data is available
  const total = !isLoading && cart.length > 0
    ? cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    : 0;

  // --- Render Logic ---

  if (isLoading) {
    // Optional: Basic loading indicator
    return (
      <div className="cart-page-container">
        <div className="cart-content">
          <h2>Your Cart</h2>
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    // Display error message
    return (
      <div className="cart-page-container">
        <div className="cart-content">
          <h2>Your Cart</h2>
          <p className="error-message">{error}</p> {/* Style this class if needed */}
        </div>
      </div>
    );
  }

  return (
    // Use the container class from CSS
    <div className="cart-page-container">
      {/* Use the content wrapper class */}
      <div className="cart-content">
        <h2>Your Cart</h2>

        {cart.length === 0 ? (
          // Use the specific class for empty cart message
          <p className="empty-cart-message">
            Your cart is empty. <Link to="/products">Continue Shopping</Link>
          </p>
        ) : (
          <>
            {/* Use the cart list class */}
            <ul className="cart-list">
              {cart.map(item => (
                // Use the cart item class
                <li key={item.id} className="cart-item">
                  {/* Cart Item Image */}
                  {item.product.imageUrls?.[0] ? (
                    <img
                      src={item.product.imageUrls[0]}
                      alt={item.product.name}
                      className="cart-thumb" // Use class from CSS
                    />
                  ) : (
                    // Placeholder if no image
                    <div className="cart-thumb-placeholder cart-thumb"></div> // Add styling for placeholder
                  )}

                  {/* Cart Item Details */}
                  <div className="cart-item-details">
                    {/* Use class for name, make it a link */}
                    <span className="cart-item-name">
                       {/* Assuming a route like /products/:productId */}
                      <Link to={`/products/${item.product.id}`}>
                         {item.product.name}
                      </Link>
                    </span>
                     {/* Display price per unit */}
                    <span className="cart-item-price-per-unit">
                        ${item.product.price.toFixed(2)} each
                    </span>
                    {/* Display quantity */}
                    <span className="cart-item-quantity">
                        Quantity: {item.quantity}
                    </span>
                  </div>

                  {/* Cart Item Actions & Subtotal */}
                  <div className="cart-item-actions">
                    {/* Use class for subtotal */}
                    <span className="cart-item-subtotal">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    {/* Use class for remove button */}
                    <button
                      className="cart-remove-button" // Use class from CSS
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.product.name} from cart`} // Accessibility
                    >
                      {/* Optional: Icon */}
                      {/* <FaTrash size="1em" style={{ marginRight: '5px' }} /> */}
                       Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Cart Summary Section */}
            <div className="cart-summary">
              {/* Use class for total display */}
              <div className="cart-total-display">
                 <span>Total:</span> ${total.toFixed(2)}
              </div>
              {/* Use class for checkout button */}
              <button
                className="checkout-button" // Use class from CSS
                onClick={() => navigate('/payment')}
                disabled={cart.length === 0 || isLoading} // Disable if empty or loading
              >
                Proceed to Payment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}