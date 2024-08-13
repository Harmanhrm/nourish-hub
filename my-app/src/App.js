import React , {useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Components/Header';
import Login from './Components/Login'; // Ensure this path is correct
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Profile from './Components/Profile';
import Diet from './Components/diet'
import { useState  } from 'react';
import Changepassword from './Components/changepassword';
import ShoppingCart from './Components/ShoppingCart';
import CartItem from './Components/CartItems';
import Cart from './Components/Cart'
import PaymentValidation from './Components/payment';
import Dietplan from './Components/Dietplan'
import ProductPage from './Components/ProductPage'
function App() {
  const [loggedin, setLoggedin] = useState(localStorage.getItem("loggedIn") === "true");
  const [numItems, setNumItems] = useState(0); 

  useEffect(() => {
    localStorage.setItem("loggedIn", loggedin);
  }, [loggedin]);

  const handleLoginSuccess = () => {
    setLoggedin(true);
    
  };
  const deleteaccount = () => {
    setLoggedin(false);
    localStorage.clear();

  };
  return (
    <CartItem.Provider value={{ numItems, setNumItems }}>
    <Router>
      <Header loggedin={loggedin} onDeleteAccount={deleteaccount}  />
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Profile" element={<Profile onDelete={deleteaccount} loggedin={loggedin} />} />
        <Route path="/changepassword" element={<Changepassword loggedin={loggedin}/>} />
        <Route path="/diet" element={<Diet loggedin={loggedin}/>} />
        <Route path='/shoppingCart' element={<ShoppingCart />} />
        <Route path='/payment' element={<PaymentValidation />} />
        <Route path='/Dietplan' element={<Dietplan />} />
        <Route path='/checkout' element={<Cart />} />
        <Route path='/product/:productId' element={<ProductPage />}/>

      </Routes>
    </Router>
    </CartItem.Provider>
  );
}
export default App;
