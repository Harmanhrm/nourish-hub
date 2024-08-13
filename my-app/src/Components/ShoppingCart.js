import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import './ShoppingCart.css';
import CartItem from './CartItems.js'; 

const ShoppingCart = () => {
    const [products, setProducts] = useState([]);
    const { setNumItems } = useContext(CartItem);
   // const [cart, setCart] = useState([]);
   // const [total, setTotal] = useState(0);
    const navigate = useNavigate();
    const uuid = localStorage.getItem('uuid');
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/products');
                setProducts(response.data);
               
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

       /* const fetchCart = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/cart');
                setCart(response.data);
                calculateTotal();
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        }; */

        fetchProducts();
       // fetchCart();
    }, []);

    // Adds products to cart
    const addToCart = async (productId, item) => {
        try {
            await axios.post('http://localhost:3001/api/cart', { user_id: uuid, product_id: productId });
            alert(`${item.name} has been added to the cart!`);
            setNumItems(prev => prev + 1);
        } catch (error) {
            console.error('Error adding item to cart:', error);
            console.log(productId);
        }
    };

    // Calculates the discount of a product (when on special in return function)
    const discount = (price, discount) => {
        const dis = parseFloat(price - (price * (discount / 100))).toFixed(2);
        return dis;
    }

   /* const removeFromCart = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/cart/${id}`);
            
            alert(`Item has been removed from the cart!`);
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };
*/

    const viewProductDetails = (productId) => {
        navigate(`/product/${productId}`); // Navigate to product details page
    };
    
  if (!uuid) {
    return <div>Cannot view without Logging in.</div>;
  }
    return (
        <div className="container py-5 cart">
            <h2>Click add to add the product onto the cart and click remove to remove the product.</h2>
            <div className="row">
                {products.map((item) => (
                    <div key={item.id} className="col-md-4 mb-3">
                        <div className="card" >
                            <img src={item.image} className="card-img-top" alt={item.name} onClick={() => viewProductDetails(item.id)}/>
                            <div className="card-body">
                                <p className="card-text">
                                    Name: {item.name}<br />
                                    {item.isSpecial ? 
                                        <>
                                            Old Price: ${parseFloat(item.price)}<br />
                                            New Price: ${discount(item.price, item.discount)}<br />
                                        </>
                                        :
                                        <>Price: ${item.price}<br /></>
                                    }
                                    {item.isSpecial ? 'On Sale' : ''}
                                </p>
                                <button onClick={() => addToCart(item.id, item)} className='AddCart' type='submit'>Add</button>
                               
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShoppingCart;