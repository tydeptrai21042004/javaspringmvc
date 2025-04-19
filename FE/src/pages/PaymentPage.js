// src/pages/PaymentPage.js
import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import './PaymentPage.css';

const validateForm = (shippingInfo, paymentMethod, cardInfo) => {
  const errors = {};
  if (!shippingInfo.name.trim()) errors.shipping_name = 'Name is required.';
  if (!shippingInfo.address1.trim()) errors.shipping_address1 = 'Address Line 1 is required.';
  if (!shippingInfo.city.trim()) errors.shipping_city = 'City is required.';
  if (!shippingInfo.postalCode.trim()) errors.shipping_postalCode = 'Postal Code is required.';
  if (!shippingInfo.country.trim()) errors.shipping_country = 'Country is required.';
  if (!shippingInfo.phone.trim()) errors.shipping_phone = 'Phone number is required.';
  else if (!/^\+?[0-9\s-()]{7,}$/.test(shippingInfo.phone)) 
    errors.shipping_phone = 'Invalid phone number format.';

  if (paymentMethod === 'prepay') {
    if (!cardInfo.cardNumber.trim()) errors.card_number = 'Card Number is required.';
    else if (!/^\d{13,19}$/.test(cardInfo.cardNumber.replace(/\s/g, '')))
      errors.card_number = 'Invalid card number format.';
    if (!cardInfo.expiry.trim()) errors.card_expiry = 'Expiry Date is required.';
    else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardInfo.expiry))
      errors.card_expiry = 'Invalid expiry date format (MM/YY).';
    if (!cardInfo.cvv.trim()) errors.card_cvv = 'CVV is required.';
    else if (!/^\d{3,4}$/.test(cardInfo.cvv))
      errors.card_cvv = 'Invalid CVV format.';
  }

  return errors;
};

export default function PaymentPage() {
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    name: '', address1: '', address2: '',
    city: '', postalCode: '', country: '', phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('prepay');
  const [cardInfo, setCardInfo] =
    useState({ cardNumber: '', expiry: '', cvv: '' });

  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch cart and compute total
  useEffect(() => {
    API.get('/cart')
      .then(res => {
        setCart(res.data);
        const t = res.data.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
        setCartTotal(t);
      })
      .catch(err => {
        console.error('Failed to load cart:', err);
        setGeneralError('Could not load cart. Please go back and try again.');
      });
  }, []);

  const handleShippingChange = e => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [`shipping_${name}`]: null }));
  };

  const handlePaymentMethodChange = e => {
    setPaymentMethod(e.target.value);
    setErrors({});
    setGeneralError('');
  };

  const handleCardChange = e => {
    const { name, value } = e.target;
    setCardInfo(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [`card_${name}`]: null }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');

    const validationErrors = validateForm(shippingInfo, paymentMethod, cardInfo);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      window.scrollTo(0, 0);
      return;
    }

    setIsLoading(true);

    const orderPayload = {
      shippingDetails: shippingInfo,
      paymentMethod,
      items: cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      })),
      totalAmount: cartTotal,
      ...(paymentMethod === 'prepay' && { paymentDetails: cardInfo })
    };

    try {
      await API.post('/orders', orderPayload);
      alert('Order placed successfully!');
      navigate('/order-success');
    } catch (err) {
      console.error('Order failed:', err);
      setGeneralError(
        err.response?.data?.message ||
        'Order placement failed. Please try again.'
      );
      window.scrollTo(0, 0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit} className="checkout-form" noValidate>

        {generalError && (
          <div className="error-message general-error">{generalError}</div>
        )}

        {/* Shipping Section */}
        <section className="form-section shipping-section">
                    <h3>Shipping Address</h3>
                    <div className="form-grid">
                        {/* Name */}
                        <div className="form-group full-width">
                            <label htmlFor="name">Full Name</label>
                            <input type="text" id="name" name="name" value={shippingInfo.name} onChange={handleShippingChange} required className={errors.shipping_name ? 'input-error' : ''} />
                            {errors.shipping_name && <span className="error-text">{errors.shipping_name}</span>}
                        </div>
                        {/* Address Line 1 */}
                        <div className="form-group full-width">
                            <label htmlFor="address1">Address Line 1</label>
                            <input type="text" id="address1" name="address1" value={shippingInfo.address1} onChange={handleShippingChange} required placeholder="Street address, P.O. box, etc." className={errors.shipping_address1 ? 'input-error' : ''} />
                             {errors.shipping_address1 && <span className="error-text">{errors.shipping_address1}</span>}
                        </div>
                        {/* Address Line 2 */}
                         <div className="form-group full-width">
                            <label htmlFor="address2">Address Line 2 (Optional)</label>
                            <input type="text" id="address2" name="address2" value={shippingInfo.address2} onChange={handleShippingChange} placeholder="Apartment, suite, unit, building, floor, etc." />
                        </div>
                         {/* City */}
                        <div className="form-group">
                            <label htmlFor="city">City</label>
                            <input type="text" id="city" name="city" value={shippingInfo.city} onChange={handleShippingChange} required className={errors.shipping_city ? 'input-error' : ''} />
                            {errors.shipping_city && <span className="error-text">{errors.shipping_city}</span>}
                        </div>
                        {/* Postal Code */}
                        <div className="form-group">
                            <label htmlFor="postalCode">Postal Code</label>
                            <input type="text" id="postalCode" name="postalCode" value={shippingInfo.postalCode} onChange={handleShippingChange} required className={errors.shipping_postalCode ? 'input-error' : ''} />
                             {errors.shipping_postalCode && <span className="error-text">{errors.shipping_postalCode}</span>}
                        </div>
                         {/* Country */}
                        <div className="form-group">
                             <label htmlFor="country">Country</label>
                             {/* Replace with a dropdown/select for better UX if needed */}
                            <input type="text" id="country" name="country" value={shippingInfo.country} onChange={handleShippingChange} required className={errors.shipping_country ? 'input-error' : ''} />
                            {errors.shipping_country && <span className="error-text">{errors.shipping_country}</span>}
                        </div>
                        {/* Phone */}
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input type="tel" id="phone" name="phone" value={shippingInfo.phone} onChange={handleShippingChange} required placeholder="For delivery updates" className={errors.shipping_phone ? 'input-error' : ''} />
                            {errors.shipping_phone && <span className="error-text">{errors.shipping_phone}</span>}
                        </div>
                    </div>
                </section>

                {/* --- Payment Method Section --- */}
                <section className="form-section payment-method-section">
                    <h3>Payment Method</h3>
                     <div className="radio-group">
                        <label className={`radio-label ${paymentMethod === 'prepay' ? 'selected' : ''}`}>
                            <input type="radio" name="paymentMethod" value="prepay" checked={paymentMethod === 'prepay'} onChange={handlePaymentMethodChange} />
                            <span>Pay Now (Credit/Debit Card)</span>
                        </label>
                        <label className={`radio-label ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                             <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={handlePaymentMethodChange} />
                            <span>Cash on Delivery (COD)</span>
                         </label>
                    </div>
                </section>

                {/* --- Credit Card Form (Conditional) --- */}
                {paymentMethod === 'prepay' && (
                    <section className="form-section card-form-container">
                        <h4>Enter Card Details</h4>
                        <div className="form-grid card-grid">
                             {/* Card Number */}
                            <div className="form-group full-width">
                                <label htmlFor="cardNumber">Card Number</label>
                                <input type="text" id="cardNumber" name="cardNumber" inputMode="numeric" pattern="[\d\s]{13,19}" maxLength="19" placeholder="XXXX XXXX XXXX XXXX" value={cardInfo.cardNumber} onChange={handleCardChange} required className={errors.card_number ? 'input-error' : ''} />
                                {errors.card_number && <span className="error-text">{errors.card_number}</span>}
                            </div>
                             {/* Expiry Date */}
                            <div className="form-group">
                                <label htmlFor="expiry">Expiry Date</label>
                                <input type="text" id="expiry" name="expiry" placeholder="MM/YY" maxLength="5" value={cardInfo.expiry} onChange={handleCardChange} required className={errors.card_expiry ? 'input-error' : ''} />
                                 {errors.card_expiry && <span className="error-text">{errors.card_expiry}</span>}
                            </div>
                            {/* CVV */}
                             <div className="form-group">
                                <label htmlFor="cvv">CVV</label>
                                <input type="text" id="cvv" name="cvv" inputMode="numeric" pattern="\d{3,4}" maxLength="4" placeholder="123" value={cardInfo.cvv} onChange={handleCardChange} required className={errors.card_cvv ? 'input-error' : ''}/>
                                 {errors.card_cvv && <span className="error-text">{errors.card_cvv}</span>}
                            </div>
                        </div>
                         {/* Optional: Add secure payment icons here */}
                    </section>
                 )}
        {/* Order Summary */}
        <section className="form-section order-summary-section">
          <h3>Order Summary</h3>
          <ul className="order-items">
            {cart.map(item => (
              <li key={item.id}>
                {item.product.name} × {item.quantity} — $
                {(item.product.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
          <div className="order-total">
            <strong>Total:</strong> ${cartTotal.toFixed(2)}
          </div>
        </section>

        <button
          type="submit"
          className="submit-order-btn"
          disabled={isLoading || cartTotal <= 0}
        >
          {isLoading
            ? 'Placing Order...'
            : paymentMethod === 'cod'
            ? 'Place Order (Pay on Delivery)'
            : `Pay $${cartTotal.toFixed(2)} & Place Order`}
        </button>
      </form>
    </div>
  );
}
