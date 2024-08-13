import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductPage.css';
import CartItem from './CartItems.js';
import Filter from 'bad-words';

const ProductPage = (loggedin) => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [editingReview, setEditingReview] = useState(null);
    const [newContent, setNewContent] = useState('');
    const [newRating, setNewRating] = useState(5);
    const [rating, setRating] = useState(5);
    const [isUserBlocked, setIsUserBlocked] = useState(false);
    const uuid = localStorage.getItem('uuid');
    const { setNumItems } = useContext(CartItem);
    const filter = new Filter();

    useEffect(() => {
        async function fetchUserStatus() {
            try {
                const { data } = await axios.get(`http://localhost:3001/api/user/${uuid}`);
                setIsUserBlocked(data.isBlocked);
                
            } catch (error) {
                console.error('Error fetching user status:', error);
            }
        }

        fetchUserStatus();
    }, [uuid]);

    useEffect(() => {
        async function fetchData() {
            try {
                const productResponse = await axios.get(`http://localhost:3001/api/product/${productId}`);
                const reviewsResponse = await axios.get(`http://localhost:3001/api/reviews/${productId}`);
                setProduct(productResponse.data);
                setReviews(reviewsResponse.data.map(review => ({
                    ...review,
                    content: review.isDeleted ? "[**** This review has been deleted by the admin ***]" : review.content,
                    showRating: !review.isDeleted
                })));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, [productId]);

    const wordCount = text => text.split(/\s+/).length;

    const addToCart = async (productId, item) => {
        try {
            await axios.post('http://localhost:3001/api/cart', { user_id: uuid, product_id: productId });
            alert(`${item.name} has been added to the cart!`);
            setNumItems(prev => prev + 1);
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    const submitReview = async () => {
        if (isUserBlocked) {
            alert("You are blocked from submitting reviews.");
            return;
        }
        if (wordCount(newReview) > 100) {
            alert("Review must be 100 words or less.");
            return;
        }
        filter.addWords('toy', 'bad', 'word');
        const isFlagged = filter.isProfane(newReview);
        try {
            const response = await axios.post(`http://localhost:3001/api/reviews`, {
                product_id: productId,
                user_id: uuid,
                content: newReview,
                rating,
                isFlagged 
            });
            if (response.status === 201) {
                setReviews([...reviews, {
                    ...response.data,
                    content: response.data.isDeleted ? "[**** This review has been deleted by the admin ***]" : response.data.content,
                    showRating: !response.data.isDeleted
                }]);
                setNewReview('');
                setRating(5);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const handleEdit = (review) => {
        if (isUserBlocked) {
            alert("You are blocked from editing reviews.");
            return;
        }
        setEditingReview(review);
        setNewContent(review.content);
        setNewRating(review.rating);
    };

    const handleSave = async () => {
        if (wordCount(newContent) > 100) {
            alert("Review must be 100 words or less.");
            return;
        }

        const isFlagged = filter.isProfane(newContent);
        try {
            const response = await axios.put(`http://localhost:3001/api/reviews/${editingReview.review_id}`, {
                content: newContent,
                rating: newRating,
                user_id: uuid,
                isFlagged
            });
            const updatedReviews = reviews.map(review => review.review_id === editingReview.review_id ? { ...review, content: newContent, rating: newRating } : review);
            setReviews(updatedReviews);
            setEditingReview(null);
        } catch (error) {
            console.error('Error updating review:', error);
        }
    };

    const handleDelete = async (reviewId) => {
        if (isUserBlocked) {
            alert("You are blocked from deleting reviews.");
            return;
        }
        try {
            const config = {
                headers: { uuid: uuid }
            };
            await axios.delete(`http://localhost:3001/api/reviews/${reviewId}`, config);
            const updatedReviews = reviews.map(review => review.review_id === reviewId ? { ...review, content: "[**** This review has been deleted by the admin ***]", isDeleted: true, showRating: false } : review);
            setReviews(updatedReviews);
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };
    const discount = (price, discount) => {
        const dis = parseFloat(price - (price * (discount / 100))).toFixed(2);
        return dis;
    }

    const handleCancel = () => {
        setEditingReview(null);
    };

    const renderStars = (rating) => "★".repeat(rating) + "☆".repeat(5 - rating);
  
  if (!loggedin || !uuid) {
    return <div>Cannot view without Logging in.</div>;
  }
    return (
        <div className="product-page-container">
            {product ? (
                <>
                    <div className="product-layout">
                        <div className="product-image">
                            <img src={product.image} alt={product.name} />
                        </div>
                        <div className="product-details">
                            <h1>{product.name}</h1>
                            <p className="price">${product.price}</p>
                            <p>
                            {product.isSpecial ? 
                                        <>
                                            Old Price: ${parseFloat(product.price)}<br />
                                            New Price: ${discount(product.price, product.discount)}<br />
                                        </>
                                        :
                                        <>Price: ${product.price}<br /></>
                                    }
                                    {product.isSpecial ? 'On Sale' : ''}
                                </p>
                            
                            <button onClick={() => addToCart(productId, product)} className="add-to-cart">Add to Cart</button>
                        </div>
                    </div>
                    <div className="product-reviews">
                        <div className="review-form">
                            <h2>Add a Review</h2>
                            <textarea value={newReview} onChange={e => setNewReview(e.target.value)} />
                            <label>
                                Rating:
                                <select value={rating} onChange={e => setRating(Number(e.target.value))}>
                                    {[1, 2, 3, 4, 5].map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </label>
                            <button onClick={submitReview}>Submit Review</button>
                        </div>
                        <h2>Reviews</h2>
                        {reviews.map((review, index) => (
                            <div key={index} className="review-item">
                                <div className="review-content">
                                    <p>{review.showRating ? renderStars(review.rating) : ""} {review.content}</p>
                                </div>
                                {review.user_id === uuid && !review.isDeleted && (
                                    <div className="review-actions">
                                        <button onClick={() => handleEdit(review)}>Edit</button>
                                        <button onClick={() => handleDelete(review.review_id)}>Delete</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {editingReview && (
                        <div className="modal">
                            <div className="modal-content">
                                <h2>Edit Review</h2>
                                <textarea value={newContent} onChange={e => setNewContent(e.target.value)} />
                                <select value={newRating} onChange={e => setNewRating(parseInt(e.target.value, 10))}>
                                    {[1, 2, 3, 4, 5].map(rating => (
                                        <option key={rating} value={rating}>{rating}</option>
                                    ))}
                                </select>
                                <button onClick={handleSave}>Save</button>
                                <button onClick={handleCancel}>Cancel</button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ProductPage;
