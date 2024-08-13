import React, { useState } from "react";
import "./Home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import apple from "../Assets/apple.jpg";
import orange from "../Assets/orange.jpg";
import bananas from "../Assets/Bananas.jfif";
import tomatoes from "../Assets/Ripe Tomatoes.jfif";
import pears from "../Assets/Pears.jpg";
import lemons from "../Assets/Lemons.jpg";
import mandarins from "../Assets/pexels-pixabay-327098.jpg";
import blueberries from "../Assets/Blueberries.jpg";
import strawberries from "../Assets/Strawberries.jpg";

//main/hero Component
const HeroSection = () => {
  return (
    <div className="jumbotron text-center bg-primary text-white">
      <h1>Welcome to Fresh Farm Fruits</h1>
      <p>Organically grown, locally sourced.</p>
    </div>
  );
};

// About Section
const AboutSection = () => {
  return (
    <div className="container py-5">
      <h2>About Us</h2>
      <p>
        We are a family-owned farm dedicated to providing fresh, organic fruits
        to our community. Our farming practices ensure sustainable growth and
        preservation of the environment.
      </p>
    </div>
  );
};

// Featured Products
const FeaturedProducts = () => {
  // Sample product data
  const products = [
    {
      id: 1,
      name: "Organic Apples",
      image: apple,
      description: "Crisp and sweet, perfect for snacking.",
    },
    {
      id: 2,
      name: "Yummy Oranges",
      image: orange,
      description: "Fresh, juicy Oranges, great for desserts.",
    },
    {
      id: 3,
      name: "Bananas",
      image: bananas,
      description: "Potassium, rich Bananas, for health benfits.",
    },
    {
      id: 4,
      name: "Ripe Tomatoes",
      image: tomatoes,
      description: "Delicious and sweet, perfect for salads.",
    },
    {
      id: 5,
      name: "Pears",
      image: pears,
      description: "Soft and creamy, highly nutritious.",
    },
    {
      id: 6,
      name: "Lemons",
      image: lemons,
      description: "Yellow and juicy, perfect for losing weight.",
    },
    {
      id: 7,
      name: "Mandarins",
      image: mandarins,
      description: "Soft and tasty, easy to peel.",
    },
    {
      id: 8,
      name: "Blueberries",
      image: blueberries,
      description: "Wonderful to eat and great for sweets",
    },
    {
      id: 9,
      name: "Strawberries",
      image: strawberries,
      description: "Juicy and fragrant, perfect for flavour",
    },
  ];

  return (
    <div className="container py-5 FeaturedProducts">
      <h2>Featured Products</h2>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4 mb-3">
            <div className="card">
              <img
                src={product.image}
                className="card-img-top"
                alt={product.name}
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContactSection = () => {
  return (
    <div className="text-center py-5 bg-light">
      <h2>Get in Touch</h2>
      <p>
        Interested in our products or have any questions? Feel free to reach
        out.
      </p>
      <button className="btn btn-primary">Contact Us</button>
    </div>
  );
};

// SpecialsPage is fit on screen in home page
const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <div className="d-flex flex-column">
        <FeaturedProducts />
      </div>
      <div className="nextTo">
        <ShoppingPage />
      </div>
      <ContactSection />
    </div>
  );
};

//ShoppingCart from home
const ShoppingPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate(false);

  const Verify = (event) => {
    event.preventDefault();
    var isLogin = localStorage.getItem("loggedIn");

    if (isLogin === "true") {
      navigate("/shoppingCart", { replace: true });
    } else {
      setError("User is not Logged in!");
    }
  };

  return (
    <div className="ShoppingContent">
      <p>Click the 'Buy' button to start shopping now!</p>
      <div className="error">{error}</div>
      <form onSubmit={Verify}>
        <button className="btn btn-primary" type="submit">
          Buy
        </button>
      </form>
    </div>
  );
};

export default HomePage;
