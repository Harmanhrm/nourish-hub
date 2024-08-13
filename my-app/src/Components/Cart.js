import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './cart.css';

const Cart = ({loggedin}) => {
    const [cart, setCart] = useState({});
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();
    const uuid = localStorage.getItem('uuid');

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/cart/${uuid}`);
                calculateTotal(response.data);
                updateCart(response.data);
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        };

        fetchCart();
    }, [uuid]);

    const calculateTotal = (cart) => {
        let total = 0;
        let itemdis = 0;
        cart.forEach((item) => {
            if(item.products.isSpecial) {
                itemdis = item.products.price - (item.products.price * item.products.discount / 100);
                total += itemdis * (cart[item.product_id]?.quantity || 1);
            } else {
                total += item.products.price * (cart[item.product_id]?.quantity || 1);
            }
        });
        setTotal(total.toFixed(2));
    };

    const updateCart = (cart) => {
        const items = {};
        cart.forEach((item) => {
            if (items[item.product_id]) {
                items[item.product_id].quantity += 1;
            } else {
                items[item.product_id] = { ...item.products, quantity: 1 };
            }
        });
        setCart(items);
    };

    const removeFromCart = async (productId) => {
        try {
            await axios.delete(`http://localhost:3001/api/cart`, { data: { user_id: uuid, product_id: productId } });
            const updatedCartItems = { ...cart };
            if (updatedCartItems[productId].quantity > 1) {
                updatedCartItems[productId].quantity -= 1;
            } else {
                delete updatedCartItems[productId];
            }
            setCart(updatedCartItems);
            
            let total = 0;
            let itemdis = 0;
            Object.values(updatedCartItems).forEach((item) => {
                if(item.isSpecial) {
                    itemdis = item.price - (item.price * item.discount / 100);
                    total += itemdis * (updatedCartItems[item.product_id]?.quantity || 1);
                } else {
                    total += item.price * item.quantity;
                }
            });
            setTotal(total);

        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const discount = (price, discount) => {
        const dis = parseFloat(price - (price * (discount / 100)));
        return dis;
    }

    const checkout = () => {
        navigate('/payment');
    };
    
  if (!uuid) {
    return <div>Cannot view without Logging in.</div>;
  }
    return (
        <div className="container py-5 cart">
            <h2>Your Cart</h2>
            <div className="row cart-items">
                {Object.values(cart).map((item) => (
                    <div key={item.id} className="col-md-4 mb-3">
                        <div className="card">
                            <img src={item.image} className="card-img-top" alt={item.name} />
                            <div className="card-body">
                                <p className="card-text">
                                    Name: {item.name}<br />
                                    {item.isSpecial ? 
                                        <>
                                            Old Price: ${parseFloat(item.price)}<br />
                                            New Price: ${discount(item.price, item.discount).toFixed(2)}<br />
                                        </>
                                        :
                                        <>Price: ${item.price}<br /></>
                                    }
                                    Quantity: {cart[item.id]?.quantity || 1}<br />
                                    {item.isSpecial ? 'On Sale' : ''}
                                </p>
                                <button className="remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4">
                <h3>Cart Total: ${total}</h3>
                <button className='pay' onClick={checkout}>Checkout</button>
            </div>
        </div>
    );
};

export default Cart;
