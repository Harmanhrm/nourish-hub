const User = require('./models/user'); 


async function testUserModel() {
    try {
       
        console.log("Creating a new user...");
        const user = await User.create({
            user_name: 'TestUser',
            mail: 'testuser@example.com',
            password: 'password123',
            sign_up_date: new Date()
        });
        console.log("User created:", user.toJSON());

       
        console.log("Retrieving the user...");
        const fetchedUser = await User.findOne({ where: { user_name: 'TestUser' } });
        console.log("User fetched:", fetchedUser.toJSON());

       
        console.log("Updating the user's mail...");
        fetchedUser.mail = 'newemail@example.com';
        await fetchedUser.save();
        console.log("User updated:", fetchedUser.toJSON());

      
        console.log("Deleting the user...");
        await fetchedUser.destroy();
        console.log("User deleted successfully.");

    } catch (error) {
        console.error('Error testing User model:', error);
    }
}


testUserModel();
