## Frontend
* Will need to run "cd my-app" before running
* Run "npm install" in my-app/ to install dependencies
* Run the code using "npm start"

## Backend/API
* Will need to run "cd server" within "my-app" and then run "node server.js"
* Are now using Sequalize instead of localStorage for our data by connecting to mySQL database or myadmin.
* The connection is included inside our db.js file inside the server directory.
* Included api credentials using a demo account on edamam 
* Api functionality is required for dietplan demonstartion 

## Admin Dashboard
* Will need to run "cd admin-dashboard" before running using "npm run start"
* Run "npm install" in my-app/ to install dependencies
## Admin Dashboard Backend/GraphQL Server
* Will need to run "cd graphql-server" before running using "node server.js"
* Run "npm install" in my-app/ to install dependencies

## Inside src
* An assets folder which stores all the photos
* A compentents folder which stores all our major js files
* An API folder that calls our API

## Inside server
* A directory called models which contains all our database models: products, reviews, shoppingCart, user
* A db.j which is our sequalize connection that connects to the database
* server.js: Sets up our routes, requests and responses for our server

### JS Files
* ProductPage.js: contains all reviews for a particular product and where loggedin and authorised users can post,edit and delete reviews
* CartItems.js: initialises and sets numitems to display num items in header when user logs in.
* changepassword.js: Handles how a user can change their password when logged in
* diet.js: Contains our api setup (we used edamam), where users selects a goal and either weekly/   daily meals which they can select, confirm the slection and then drop from dropdown menu.
* Dietplan.js: Contains any dietplans the user has made for either weekly or daily
* Header.js and Header.css: Handles the top Navigation bar
* Home.js and Home.css: Handles the home page and its contents
* Login.js and Login.css: Handles how the user logins in and stores the info in the database
* payment.js and payment.css: Handles the payment of the user
* Popup.js and Popup.css
* Profile.js and Profile.css: Handles whats displayed in the user profile
* ShoppingCart.js and ShoppingCart.css: Handles how the user adds products to cart and is able to naviage to the product details section
* Cart.js and cart.css: Handles the user removing a product, shows the total price of cart and navigates you to the payment page
* summary.js and summary.css: The summary page after the user pays for their items
* Vegetables.js and Vegetables.css: Located in the home page, instructions on how to grow vegetables
* ProductsPage.js and ProductsPage.css: Shows the details of the product selected with an add to cart button. It has a reviews section where a user can post a review about the product

### Testing Files
* 3 Unit tests for the Shopping Cart and 1 unit test for the Reviews Section.
* We also have one test for the App.js file which just tests if the frontpage is working.
* shoppingCart.test.js: Tests for adding products to cart, if the product details can be viewed by clicking on image, products are rendered successfully.
* reviews.test.js:
### Development Features
* User Authentication: Implementation of sign-up and sign-in functionalities with hashed password storage.
* Profile Management: Users can view and edit their profiles.
* Product Handling: Standard and special products can be viewed and managed.
* Shopping Cart: Fully functional shopping cart integrated with the backend.
* Admin Portal: Separate admin dashboard using GraphQL for user and product management.
* Moderation Features: Real-time moderation features in the admin dashboard to manage user interactions and content dynamically.
### Features
- When using diet plan - users are given breakfast, snacks and dinner, this as dinner/lunch meals are considered the same by edamam so users can select multiple and judge for themselves what they want to have given their recommended calories.
- Health Profile Customization: Users can set their health goals (e.g., weight loss, muscle gain), dietary preferences, and activity levels.
- Dynamic Meal Planning: Depending on the chosen plan (daily or weekly), users can select meals for breakfast, snack, and dinner from a fetched list of recipes that fit their calorie needs.
- Calorie Tracking: The app calculates the total calories for selected meals using the Mifflin-St Jeor Equation which takes, age, weight, activity level etc into accountto suggest whether the plan is within the required calorie intake.
- Local Storage: Meal plans are saved locally on the user’s device using localStorage, enabling persistent state across sessions.

### UNIT Tests
- unit tests for review can be found in review.test.js in components
- unit tests for shoppingCart can be found in shoppingCart.test.js in components  
#### IMPLEMENTATION DETAILS:

# Sign-up & Sign-in
- Password are stored in hashed format and compared using bcryt within database
- When signing up, user input is validated in frontend and backend to prevent sql injections before account creation (initially user is set to not blocked)
- a uuid is generated upon successful login which is used for session tracking and retrieving user-speicfic data.
# Profile Management
- All details of profile inclduing age, name, weight, height, activity level and dietary preferences are stored in database instead of local storage.
# Standard and Special Products
-Used the same table in phpmyadmin for for both special and standard products, however special products had the isSpecial tag set to true with a required Discount int tag, which was applied in frontend to show discount and new price
# Shopping Cart
- All added data is stored in database shopping cart table
- Removing products from cart occurs only in the checkout page before payment
- After adding to there cart, a user can click checkout and then from there, navigate to the payment page

# Reviews
- All data is stored in database related to reviews
- Reviews can only be seen in productpage after clicking on a product in 'products' header
- reviews are scanned for profanity using library 'npm bad-words' and 'npm badwords-list', this scan happens when creating or updating a review.
- when a user deletes a review, it gets deleted from the database
- when admin deletes the review, the isDeleted flag is set true and a comment (as required) can be in place of review that was deleted by admin
# HD Implementation
- when a admin blocks a user, it prevent user in frontend from creating, editing or deleting any reviews
- admin can also add/edit/delete all product types
- reviews can filtered by flages (isDeleted and isFlagged) and date of submission
- implemented distinct metrics using react chartjs, where i depicted: Review Counts by Product, Average Ratings by Product and Review Counts by User.

## Scenarios for Flagging Reviews
# Use of Profanity and Offensive Language:
Automated Detection: The system uses the bad-words library to automatically scan reviews upon submission. Reviews containing blacklisted words are flagged automatically.
Example: A review contains derogatory terms or explicit language which is deemed offensive to other users.

# Spam or Irrelevent Review
Automated/Manual Detection: Reviews that contain promotional content, links to external sites, or are off-topic can be automatically detected using keyword filters or manually flagged by users.
Example: A review consists of repeated text, promotional links to third-party websites, or completely irrelevant to the product.

# Admin Actions and User Feedback
When an admin deletes a review deemed inappropriate based on the scenarios outlined, the following message replaces the original content:
[**** This review has been deleted by the admin ***]
Explanation for Admin Dashboard Sorting

IsFlagged Sorting: Admins can sort or filter reviews based on the flagged status to prioritize review moderation efforts.

User Interface: Admins have the capability to view all reviews, but flagged reviews can be filtered using a dropdown menu. This allows for efficient moderation, focusing on reviews that may violate community guidelines.
