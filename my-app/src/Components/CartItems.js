// CartItems.js
import React, { useState } from 'react';

const CartItems = React.createContext({
  numItems: 0,
  setNumItems: () => {}
});

export const CartItemProvider = ({ children }) => {
  const [numItems, setNumItems] = useState(0);

  return (
    <CartItems.Provider value={{ numItems, setNumItems }}>
      {children}
    </CartItems.Provider>
  );
};

export default CartItems;
