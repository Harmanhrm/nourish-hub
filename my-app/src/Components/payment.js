import React, { useState, useContext } from "react";
import validator from "validator";
import './payment.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import CartItem from './CartItems.js'; 

const Payment = ({ loggedin }) => {
    const { setNumItems } = useContext(CartItem);
    const [cardVal, setCardVal] = useState('');
    const [error, setError] = useState('');
    const [date, setDate] = useState('');
    const navigate = useNavigate();

    const uuid = localStorage.getItem('uuid');
    if (!uuid) {
        return <div>Cannot view without Logging in.</div>;
    }

    const validateAndPay = async (event) => {
        event.preventDefault();
        const currentDate = new Date().toLocaleDateString();
        const cardDate =  new Date(date).toLocaleDateString();

        if (validator.isCreditCard(cardVal) && cardDate >= currentDate) {
            try {
                await axios.delete(`http://localhost:3001/api/cart/all/${uuid}`);
                setNumItems(0); // Correctly use setNumItems to update state
                alert('Payment Successful')
                navigate('/home', { replace: true });

            } catch (error) {
                console.error('Error clearing cart:', error);
                setError('Failed to process payment and clear cart.');
            }
        } else {
            setError('Invalid credit card number or date');
        }
    };

    const handleCardChange = (event) => {
        setCardVal(event.target.value);
    };

    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    return (
        <div>
            <div className="banner">
                <h1>Pay Here</h1>
            </div>
            <form onSubmit={validateAndPay}>
                <div className='login'>
                    <div className="error">{error}</div>
                    <p>Credit Card Number:</p>
                    <input type="number" value={cardVal} onChange={handleCardChange}/>
                    <p>Expiry Date:</p>
                    <input type="date" value={date} onChange={handleDateChange}/>
                    <button className='button-login' type="submit">Pay</button>
                </div>
            </form>
        </div>
    )
}

export default Payment;
