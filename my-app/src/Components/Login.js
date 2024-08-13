import React, { useState } from "react";
import "./Login.css";
import Popup from "./Popup";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const initialvalues = {
  name: "",
  email: "",
  password: "",
  cfmpassword: "",
};

const Login = (props) => {
  const [popup, setPopup] = useState(false); // handles confirmation cue and navigate hook to home
  const [formValues, setFormValues] = useState(initialvalues); //handles input values
  const [formErrors, setFormErrors] = useState({}); // handles error/validation
  const currentDate = new Date().toLocaleDateString();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const handleChange = (e) => {
    // whenever a change happens to input fields
    const { name, value } = e.target; // sets the name (e.g email) from 'target' and value of the input
    setFormValues({ ...formValues, [name]: value }); // updates the formvalues state with current name and value from e.target
  };
  
  const [uuidInfo, setUuidInfo] = useState({});
  const validateForm = () => {
    let errors = {};

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // USE .test if using Regex
    // Name validation: at least 4 characters, no numbers or special characters
    if (formValues.name.length < 4) {
      errors.name = "Name must be more than 4 letters.";
    } else if (
      /[0-9`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(formValues.name)
    ) {
      errors.name = "Name must not contain numbers or special characters.";
    }

    // Email validation
    if (!formValues.email.includes("@")) {
      errors.email = "Email should contain an '@' symbol.";
    }
    //password validation
    if (formValues.password.length < 8) {
      errors.password =
        "Password is too short. It must be at least 8 characters.";
    } else if (!/\d/.test(formValues.password)) {
      errors.password = "Password must include a number.";
    } else if (
      !/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(formValues.password)
    ) {
      errors.password = "Password must include at least one special character.";
    }
    if (formValues.password !== formValues.cfmpassword) {
      errors.cfmpassword = "Password must Match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // No errors, form is valid
  };
  const clearForm = () => {
    setFormValues({
      name: '',
      email: '',
      password: '',
      cfmpassword: ''
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      const userData = {
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
        joindate: currentDate  
    }; //sets form values and activates send to database function
   
    sendDataToServer(userData).then((response) => {
      console.log('User created:', response);
      if (response === undefined) {
        alert("Sign-up Unsuccessful - username and mail may already be in use")
      }
      else {
        clearForm();
      setPopup(true);  
      
      }
    })
    .catch(error => {
      console.error("Failed to create user:", error);
  });
    }
    
  };
  const sendDataToServer = async (userData) => {
    try {
        const response = await axios.post('http://localhost:3001/users', {
            user_name: userData.name,
            mail: userData.email,
            password: userData.password,
        });
        console.log('User created:', response.data);
        return response.data;  // Return data for further processing if necessary
    } catch (error) {
        console.error('Error sending data:', error);
        console.error('Error sending data:', error.response.data);
       
        if (error.response && error.response.status === 400) {
        
            setFormErrors({ general: error.response.data.errors });
        } else {
            setFormErrors({ general: "An unexpected error occurred." });
        }
    }
};

const handleLoginSubmit = async (event) => {
  event.preventDefault();
  try {
      const response = await axios.post('http://localhost:3001/api/login', {
          email: formValues.email,
          password: formValues.cfmpassword
      });
     
      localStorage.setItem('uuid', response.data.uuid);
      const uuid = localStorage.getItem('uuid');
      if (uuid) {
        try {
          const response = await axios.get(`http://localhost:3001/api/user/${uuid}`);
          setUuidInfo(response.data); 
        } catch (error) {
          console.error('Error fetching user details:', error);
          setUuidInfo({});
        }
      }
      setPopup(true);
        setFormErrors({ login: response.data.message });
      
  } catch (error) {
      console.error("Login failed:", error.response?.data || "Unknown error");
      alert("Login Failed. Could not retrieve login info, Please check your credentials and try again.")
      setFormErrors({ general: "Login failed. Please check your credentials and try again." });
  }
};
  const handleClosePopup = () => {
    navigate("/Home"); //  to Home
    props.onLoginSuccess();
  };
  const loginbutton = (event) => {
    setIsLogin(true);
  };
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormErrors({}); // Clear form
  };
  if (!isLogin) {
    return (
      <div>
        <div className="container">
          <div className="input_space">
            <input
              placeholder="Name"
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleChange}
            />
            {formErrors.name && <p className="error">{formErrors.name}</p>}
          </div>
          <div className="input_space">
            <input
              placeholder="Email"
              type="text"
              name="email"
              value={formValues.email}
              onChange={handleChange}
            />
            {formErrors.email && <p className="error">{formErrors.email}</p>}
          </div>
          <div className="input_space">
            <input
              placeholder="Password"
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
            />
            {formErrors.password && (
              <p className="error">{formErrors.password}</p>
            )}
          </div>
          <div className="input_space">
            <input
              placeholder="Confirm Password"
              type="password"
              name="cfmpassword"
              value={formValues.cfmpassword}
              onChange={handleChange}
            />
            {formErrors.cfmpassword && (
              <p className="error">{formErrors.cfmpassword}</p>
            )}
          </div>
          <button className="login_btn" onClick={handleSubmit}>
            Signup
          </button>
          <button className="login_btn2" onClick={loginbutton}>
            Login Instead
          </button>
          <Popup
            trigger={popup}
            setTrigger={setPopup}
          >
            <h3>
            Thank you for joining!! Please login again to verify your login.
            </h3>

          </Popup>
          
        </div>
      </div>
    );
  } else {
    return (
      <div className="container">
        <div className="input_space">
          <input
            placeholder="Email"
            type="text"
            name="email"
            value={formValues.email}
            onChange={handleChange}
          />
          {formErrors.email && <p className="error">{formErrors.email}</p>}
        </div>
        <div className="input_space">
          <input
            placeholder="Password"
            type="password"
            name="cfmpassword"
            value={formValues.cfmpassword}
            onChange={handleChange}
          />
          {formErrors.cfmpassword && (
            <p className="error">{formErrors.cfmpassword}</p>
          )}
        </div>
        <button className="login_btn" onClick={handleLoginSubmit}>
          Login
        </button>
        <button className="toggle_btn" onClick={toggleForm}>
          Signup Instead
        </button>
        <Popup trigger={popup} setTrigger={setPopup} onClose={handleClosePopup}>
          <h3>Welcome Back, {uuidInfo.user_name}</h3>
        </Popup>
      </div>
    );
  }
};

export default Login;
