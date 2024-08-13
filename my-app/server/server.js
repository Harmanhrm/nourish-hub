const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./models/user');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Products = require('./models/products');
const Cart = require('./models/shoppingCart');
const Reviews = require('./models/reviews')
const app = express()

app.use(bodyParser.json());


// const jwt = require('jsonwebtoken');

app.use(cors())

//API Endpoint
app.get('/api/user', (req, res) => {
    //select user information from the database
    db.query('SELECT user_name, mail, sign_up_date, age, gender, dietaryPreferences, activityLevel, height, weight, isDeleted  uuidPrimary FROM user', (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        //Send user information bck as a response
        res.json(result);
      }
    });
  });
  
app.get('/', (re,res)=> {
    return res.json("From Backend side")
})
app.post('/users', async (req, res) => {
    try {
        const { user_name, mail, password } = req.body;
        const salt = await bcrypt.genSalt(10); // increases security
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = await User.create({
            user_name,
            mail,
            password: hashedPassword,
        });
        res.json({ message: "User created successfully", user: newUser });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            const errorMessage = error.errors.map(e => e.message).join(", ");
            res.status(400).json({ message: "Error creating user", errors: errorMessage });
        } else {
            console.error('Error creating user:', error);
            res.status(500).send("Internal server error");
        }
    }
});
app.listen(3001, () => {
    console.log("listening")
})

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { mail: email } });
        
        if (!user) {
            return res.status(404).send("User not found");
        }
        if (user.isDeleted) {
            return res.status(403).send("User account is Deleted");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send("Invalid credentials");
        }
        else {
            // send uuid to be used for future calls for data
            res.json({ message: "Login successful", uuid: user.uuid });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send("Internal server error");
    }
});
app.put('/api/user/:uuid', async (req, res) => {
    const { uuid } = req.params;
    const updateData = req.body;

    try {
        const user = await User.findOne({ where: { uuid: uuid } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        await user.update(updateData);
        res.json({ message: "Profile updated successfully", user: { user_name: user.user_name } });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send("Internal server error");
    }
});

app.get(`/api/product/:productId`, async (req, res) => {
    const productID = req.params.productId;
    try {
        const products = await Products.findOne({
            where: { id: productID },
            attributes: ['name','image','price', 'isSpecial', 'discount']  //info you can get with productID
        });
        if (products) {
            res.json(products);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/api/user/:uuid', async (req, res) => {
    const uuid = req.params.uuid;
    try {
        const user = await User.findOne({
            where: { uuid: uuid },
            attributes: ['user_name', 'mail', 'sign_up_date',  'age', 'gender', 'dietaryPreferences', 'activityLevel', 'height', 'weight', 'isBlocked', 'isDeleted']  //info you can get with uuid
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Internal Server Error');
    }
});

//updated change password:
app.post('/api/change-password', async (req, res) => {
    const { uuid, currentPassword, newPassword } = req.body;

    try {
        const user = await User.findOne({ where: { uuid: uuid } });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).send("Current password is incorrect");
        }


        if (await bcrypt.compare(newPassword, user.password)) {
            return res.status(400).send("New password cannot be the same as current password");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();

        res.send("Password changed successfully");
    } catch (error) {
        console.error('Error during password change:', error);
        res.status(500).send(" server error");
    }
});


app.put('/api/user/:uuid', async (req, res) => {
    const { uuid } = req.params;

    try {
        const user = await User.findOne({ where: { uuid: uuid } });
        if (!user) {
            return res.status(404).send("User not found");
        }

        await user.destroy();
        res.send("User deleted successfully");
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send("Internal server error");
    }
});
app.put('/api/user/:uuid/delete', async (req, res) => {
    const { uuid } = req.params;

    try {
        const user = await User.findOne({ where: { uuid: uuid } });
        if (!user) {
            return res.status(404).send("User not found");
        }

        user.isDeleted = true;
        await user.save();

        res.send("User account deactivated successfully");
    } catch (error) {
        console.error('Error deactivating user:', error);
        res.status(500).send("Internal server error");
    }
});
const ShoppingCart = require('./models/shoppingCart');
const { where } = require('sequelize');

// Create a new item in the shopping cart
app.post('/api/cart', async (req, res) => {
    try {
        const { user_id, product_id } = req.body;
        const newCartItem = await ShoppingCart.create({user_id: user_id, product_id: product_id});
        res.json({ message: "Item added to cart", item: newCartItem });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).send("Internal server error");
    }
});

// Update an existing item in the shopping cart
app.put('/api/cart/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cartItem = await ShoppingCart.findByPk(id);
        if (!cartItem) {
            return res.status(404).send("Item not found in the cart");
        }
        res.json({ message: "Item updated in the cart", item: cartItem });
    } catch (error) {
        console.error('Error updating item in the cart:', error);
        res.status(500).send("Internal server error");
    }
});

// Remove an item from the shopping cart
app.delete('/api/cart', async (req, res) => {
    try {
        const { user_id, product_id } = req.body;
        const cartItem = await ShoppingCart.findOne({where: {user_id, product_id}});
        if (!cartItem) {
            return res.status(404).send("Item not found in the cart");
        }
        await cartItem.destroy();
        res.json({ message: "Item removed from the cart" });
    } catch (error) {
        console.error('Error removing item from the cart:', error);
        res.status(500).send("Internal server error");
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const products = await Products.findAll();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/cart', async (req, res) => {
    try {
        const cart = await Cart.findAll();
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/api/cart/:uuid', async (req, res) => {
    const uuid = req.params.uuid;
    try {
        const cart = await ShoppingCart.findAll({
            where: { user_id: uuid },
            include: [
                {
                    model: Products,
                    as: 'products'
                }
            ]
        });
        res.json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).send('Internal Server Error');
    }
});

//getting reviews
app.get('/api/reviews/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
        const reviews = await Reviews.findAll({
            where: { product_id: productId },
            
        });
        res.json(reviews.map(review => ({
            ...review.get(),
            user_name: review.user ? review.user.user_name : 'Anonymous',  // Handling possible null user
        })));
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/api/reviews', async (req, res) => {
    const { product_id, user_id, content, rating, isFlagged } = req.body;
    try {
        const newReview = await Reviews.create({
            product_id,
            user_id,
            content,
            rating,
            isFlagged
        });
        res.status(201).json(newReview);
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/api/reviews/:reviewId', async (req, res) => {
    const { reviewId } = req.params;
    const { content, rating, isFlagged } = req.body;

    try {
        const review = await Reviews.findOne({
            where: { review_id: reviewId }
        });

        if (!review) {
            return res.status(404).send("Review not found or user not authorized to edit this review.");
        }

        review.content = content;
        review.rating = rating;
        review.isFlagged = isFlagged;
        await review.save();

        res.json({ message: "Review updated successfully", review });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).send("Internal server error");
    }
});

app.delete('/api/reviews/:reviewId', async (req, res) => {
    const { reviewId } = req.params;
    const uuid = req.headers.uuid; 

    try {
        const review = await Reviews.findOne({
            where: { review_id: reviewId, user_id: uuid }
        });

        if (!review) {
            return res.status(404).send("Review not found or user not authorized to delete this review.");
        }

        await review.destroy(); 

        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).send("Internal server error");
    }
});

app.delete('/api/cart/all/:uuid', async (req, res) => {
    const { uuid } = req.params;
    try {
        await ShoppingCart.destroy({
            where: { user_id: uuid }
        });
        res.send("All cart items removed successfully");
    } catch (error) {
        console.error('Error clearing cart for user:', error);
        res.status(500).send("Internal server error");
    }
});
