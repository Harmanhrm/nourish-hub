const Review = require('./models/reviews'); 
async function testReviewModel() {
    try {
      
        console.log("Creating a new review...");
        const review = await Review.create({
            product_id: 'b8e0149a-19d2-11ef-bd2c-000d3a6a18b7', 
            user_id: '293d156d-19db-11ef-bd2c-000d3a6a18b7', // Sample UUID
            content: 'mid product',
            rating: 3,
           
        });
        console.log("Review created:", review.toJSON());

       
        console.log("Retrieving the review...");
        const fetchedReview = await Review.findOne({ where: { review_id: review.review_id } });
        console.log("Review fetched:", fetchedReview.toJSON());

      /*  console.log("Updating the review's content...");
        fetchedReview.content = 'good product';
        await fetchedReview.save();
        console.log("Review updated:", fetchedReview.toJSON());*/
/*
        console.log("Deleting the review...");
        fetchedReview.isDeleted = true;
        await fetchedReview.save();
        console.log("Review marked as deleted.");
*/
    } catch (error) {
        console.error('Error testing Review model:', error);
    }
}


testReviewModel();
