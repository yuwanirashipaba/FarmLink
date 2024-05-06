import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Cart() {
    const [cart, setCart] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const fetchCart = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/cart/611f4a5b8f7a040015c6c851');
                setCart(response.data);
                setTotalAmount(response.data.totalAmount);
            } catch (err) {
                setError(err.message || 'Failed to fetch cart');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCart();
    }, []);

    const handleDeleteItem = async (itemId) => {
        try {
            await axios.delete(`http://localhost:5000/api/cart/delete/${itemId}`);
            // Remove deleted item from cart
            setCart(prevCart => ({
                ...prevCart,
                items: prevCart.items.filter(item => item._id !== itemId),
            }));
            toast.success('Item deleted successfully!');
        } catch (err) {
            console.error('Error deleting item from cart:', err);
            toast.error('Failed to delete item from cart.');
        }
    };

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/cart/updateQuantity/${itemId}`, { quantity: newQuantity });
            // Update quantity for the item in the cart
            setCart(prevCart => ({
                ...prevCart,
                items: prevCart.items.map(item => item._id === itemId ? { ...item, quantity: newQuantity } : item),
            }));
            setTotalAmount(response.data.totalAmount);
        } catch (err) {
            console.error('Error updating item quantity:', err);
            toast.error('Failed to update item quantity.');
        }
    };

    const handleCheckout = () => {
        // Redirect to the correct checkout page with cart ID
        window.location.href = `/cartcheckout/${cart._id}`;
    };
    

    const handleClosePaymentModal = () => {
        setShowPaymentModal(false);
    };

    const handleSubmitPayment = async () => {
        const userId = '611f4a5b8f7a040015c6c851'; // Hardcoded user ID
        try {
            console.log('User ID:', userId);
            const response = await axios.post('http://localhost:5000/api/cart/pay', { userId });
            if (response.status === 200) {
                toast.success('Payment processed successfully. Order has been placed.');
                setShowPaymentModal(false);
                // You can redirect or perform any additional actions after successful payment
            } else {
                toast.error('Payment processing failed. Please try again.');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            toast.error('Payment processing failed. Please try again.');
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!cart || cart.items.length === 0) {
        return <div>Cart is empty.</div>;
    }
    return (
        <div className="card">
            <div className="row">
                <div className="col-md-8 cart">
                    <div className="title">
                        <div className="row">
                            <div className="col"><h4><b>Shopping Cart</b></h4></div>
                            <div className="col align-self-center text-right text-muted">{cart.items.length} items</div>
                        </div>
                    </div>
                    {cart.items.map((item) => (
                        <div className="row border-top border-bottom" key={item._id}>
                            <div className="row main align-items-center">
                                <div className="col-2"><img className="img-fluid" src={item.imageUrl} alt={item.productName} /></div>
                                <div className="col">
                                    <div className="row text-muted">{item.category}</div>
                                    <div className="row">{item.productName}</div>
                                </div>
                                <div className="col">
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleUpdateQuantity(item._id, parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="col">$ {(item.quantity * item.productPrice).toFixed(2)}</div>
                                <div className="col">
                                    <button onClick={() => handleDeleteItem(item._id)} className="close">&#10005;</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="back-to-shop"><a href="/home">Back to shop</a><span className="text-muted"></span></div>
                </div>
                <div className="col-md-4 summary">
                    <div><h5><b>Summary</b></h5></div>
                    <hr />
                    <div className="row">
                        <div className="col" style={{ paddingLeft: 0 }}>ITEMS {cart.items.length}</div>
                        <div className="col text-right"> $ {totalAmount.toFixed(2)}</div>
                    </div>
                    
                    <div className="row" style={{ borderTop: '1px solid rgba(0,0,0,.1)', padding: '2vh 0' }}>
                        <div className="col">TOTAL PRICE</div>
                        <div className="col text-right"> $ {totalAmount.toFixed(2)}</div>
                    </div>
                    <button className="btn" onClick={handleCheckout}>CHECKOUT</button>
                </div>
            </div>
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                totalAmount={totalAmount}
                onSubmitPayment={handleSubmitPayment}
            />
        </div>
    );
}


function PaymentModal({ isOpen, onClose, totalAmount, onSubmitPayment }) {
    if (!isOpen) return null;

    return (
        <div className="payment-modal-container">
            <div className="payment-modal-content" style={{ width: '480px' }}>
                <div className="payment-modal-header">
                    <h2>Checkout</h2>
                </div>
                <CheckoutForm totalAmount={totalAmount} onSubmit={onSubmitPayment} onClose={onClose} />
                <div className="button-row" style={{ textAlign: 'center' }}>
                    <button type="submit" onClick={onSubmitPayment}>
                        Submit Payment
                    </button>
                    <button onClick={onClose} style={{ backgroundColor: 'red' }}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}


function CheckoutForm({ totalAmount, onClose, onSubmit }) {
    const [creditCardNumber, setCreditCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvv, setCvv] = useState('');

    const validate = () => {
        let isValid = true;

        // Example validation: simple length checks
        if (creditCardNumber.replace(/\s/g, '').length !== 16) {
            isValid = false;
        }

        if (!expirationDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
            isValid = false;
        }

        if (cvv.length !== 3) {
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validate()) {
            onSubmit({ creditCardNumber, expirationDate, cvv });
            onClose();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Credit Card Number:</label>
                <input
                    type="text"
                    placeholder="4111 1111 1111 1111"
                    required
                    value={creditCardNumber}
                    onChange={(e) => setCreditCardNumber(e.target.value)}
                    pattern="\d{4} \d{4} \d{4} \d{4}"
                    title="Enter a credit card number in the format: 4111 1111 1111 1111"
                />
            </div>
            <div>
                <label>Expiration Date:</label>
                <input
                    type="text"
                    placeholder="MM/YY"
                    required
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    pattern="(0[1-9]|1[0-2])\/\d{2}"
                    title="Enter an expiration date in the format MM/YY"
                />
            </div>
            <div>
                <label>CVV:</label>
                <input
                    type="text"
                    placeholder="123"
                    required
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    pattern="\d{3}"
                    title="Enter a 3-digit CVV"
                />
            </div>
            <div>
                <label>Total Amount: ${totalAmount.toFixed(2)}</label>
            </div>            
        </form>
    );
}

export default Cart;