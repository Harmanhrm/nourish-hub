import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import ShoppingCart from './ShoppingCart';
import { BrowserRouter, useNavigate } from 'react-router-dom';

// Mocking axios and react-router-dom 
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), 
  useNavigate: jest.fn(), 
}));

describe('ShoppingCart component', () => {
  // Initialize mockNavigate inside beforeEach
  let mockNavigate;
  beforeEach(() => {
    window.alert = jest.fn();
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();  
  });

  test('Renders product cards', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { id: 1, name: 'Apple', price: 8.99, image: 'apple.jpg', isSpecial: false, discount: 0 },
        { id: 2, name: 'Orange', price: 4.70, image: 'orange.jpg', isSpecial: true, discount: 1 },
      ],
    });

    const { findByText } = render(
      <BrowserRouter>
        <ShoppingCart />
      </BrowserRouter>
    );

    expect(await findByText(/Apple/i)).toBeInTheDocument();
    expect(await findByText(/Orange/i)).toBeInTheDocument();
  });
  
  test('Adds product to cart on click', async () => {
    const productData = [
      { id: 'uuid-product-1', name: 'Apple', price: 8.99, image: 'apple.jpg', isSpecial: false, discount: 0 }
    ];
    axios.get.mockResolvedValueOnce({ data: productData });
    axios.post.mockResolvedValueOnce({});
  
    const { findByText, findByAltText } = render(
      <BrowserRouter>
        <ShoppingCart />
      </BrowserRouter>
    );
  
    // Wait for the product to be fully loaded and displayed
    const appleText = await findByText(/Apple/); // Use regex to allow for flexible text matching
    const appleImage = await findByAltText('Apple');
    const addButton = await appleImage.closest('.card').querySelector('.AddCart'); // Ensure `closest` is called on resolved promise
  
    fireEvent.click(addButton);
  
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/api/cart', {
        user_id: localStorage.getItem('uuid'),
        product_id: productData[0].id
      });
      expect(window.alert).toHaveBeenCalledWith('Apple has been added to the cart!');
    });
  });
  

  test('Navigates to product details page on image click', async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ id: 1, name: 'Apple', price: 8.99, image: 'apple.jpg', isSpecial: false, discount: 0 }],
    });

    const { findByAltText } = render(
      <BrowserRouter>
        <ShoppingCart />
      </BrowserRouter>
    );

    const appleImage = await findByAltText('Apple');
    fireEvent.click(appleImage);

    expect(mockNavigate).toHaveBeenCalledWith('/product/1');
  });
});

