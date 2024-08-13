import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import axios from 'axios';
import ProductPage from './ProductPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CartItemProvider } from './CartItems'; // Ensure correct import of CartItemProvider

// Mocking axios to control and inspect its behavior in the test
jest.mock('axios');

// Mocking react-router-dom's useParams hook to control the productId parameter
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ productId: '1' }),
}));

describe('ProductPage - Review Submission', () => {
  //Sample data for the product, reviews, and user blocked status
  const productData = { id: '1', name: 'Apple', price: 8.99, image: 'apple.jpg', isSpecial: false, discount: 0 };
  const reviewsData = [];
  const userStatusData = { isBlocked: false };

  // Before each test, ensure user is logged in and uuid exists in localStorage
  beforeEach(() => {
    // Set the local storage values for uuid and loggedin status
    localStorage.setItem('uuid', 'test-uuid');
    localStorage.setItem('loggedin', 'true');

//Mock axios GET requests based on the URL
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/product/')) {
        return Promise.resolve({ data: productData });
      } else if (url.includes('/api/reviews/')) {
        return Promise.resolve({ data: reviewsData });
      } else if (url.includes('/api/user/')) {
        return Promise.resolve({ data: userStatusData });
      }
    });

//Mock axios POST request to return a successful response
    axios.post.mockResolvedValueOnce({ status: 201 });
  });

  // Clear localStorage after each test to avoid state leakage (prevent tests to affect the state of another test)
  afterEach(() => {
    localStorage.clear();
  });

  test('submits a review correctly when under word limit', async () => {
    const reviewText = "Great product!"; // Review text under 100 words

    // Render the component within a CartItemProvider (to show num cart items) and BrowserRouter context
    await act(async () => {
      render(
        <CartItemProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ProductPage loggedin={true} />} />
            </Routes>
          </BrowserRouter>
        </CartItemProvider>
      );
    });

    // Wait for the product to be fully loaded and displayed
    await waitFor(() => expect(screen.getByText(/Apple/)).toBeInTheDocument());

    // Mock user typing into the review in the textarea
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: reviewText } });

    // Mock user clicking the submit button
    fireEvent.click(screen.getByText('Submit Review'));

    // Wait for  POST request to be made and check if it was called with the correct data
    await waitFor(() => {
      // Expect an axios POST call to be made with the correct data
      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/api/reviews'), {
        product_id: '1', //The value set in the useParams mock
        user_id: 'test-uuid', // The value set in localStorage
        content: reviewText,
        rating: 5 // selected rating
      });
      //Expect the review to be added to the page
      expect(screen.getByText(reviewText)).toBeInTheDocument();
    });
  });
});
