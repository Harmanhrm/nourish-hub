import React , {useContext} from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import NavDropdown from "react-bootstrap/NavDropdown";
import { LinkContainer } from "react-router-bootstrap";
import CartItem from './CartItems';  // Import the context

const Header = ({ loggedin, onDeleteAccount }) => {
  // const [loggedOut, setLoggedOut] = useState(false);
  const handlelogout = (e) => {
    e.preventDefault();
    //  setLoggedOut(true);
    onDeleteAccount();
  };
  const { numItems } = useContext(CartItem);  // Use the cart context
  const uuid = localStorage.getItem('uuid');

  if (!uuid) {
    return (
      <nav>
        <ul>
          <li>
            <Link to="/Home">Home</Link>
          </li>
          <li className="login">
            <Link to="/login">Login/Signup</Link>
          </li>
        </ul>
      </nav>
    );
  } else {
    return (
      <nav className="ml-auto">
        <ul>
          <li>
            <Link to="/Home">Home</Link>
          </li>
          <li>
            <Link to="/diet">Create Your Diet Plan</Link>
          </li>
          <li>
            <Link to="/shoppingCart">Products</Link>
          </li>
          <li className="Cart">
          <Link to="/checkout">Checkout{numItems > 0 ? ` (${numItems})` : ""}</Link>
          </li>
          <li className="Profile">
            <NavDropdown title="Profile" id="basic-nav-dropdown">
              <LinkContainer to="/profile">
                <NavDropdown.Item>Profile</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/changepassword">
                <NavDropdown.Item>Change Password</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/Dietplan">
                <NavDropdown.Item>View Diet Plan</NavDropdown.Item>
              </LinkContainer>
              <div onClick={handlelogout} style={{ cursor: "pointer" }}>
                <NavDropdown.Item as="span">Logout</NavDropdown.Item>
              </div>
            </NavDropdown>
          </li>
        </ul>
      </nav>
    );
  }
};

export default Header;
