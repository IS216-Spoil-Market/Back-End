const ReviewSchema = require("../schema/reviews.js");
const UserSchema = require("../schema/user.js");
const { Request, Response } = require("express");

module.exports = {
    /**
     *
     * @param {Request} req
     * @param {Response} res
     * @returns {[number, Object]}
     */

    // get reviews by id
    // Get reviews by id
    getReviewById: async (req, res) => {
        try {
            const userId = req.params.id;

            // Directly pass the `reviewee_id` to `findById` without wrapping in `{ _id: ... }`
            let retrievedUser = await UserSchema.findById(userId);

            if (retrievedUser) {
                const reviews = await ReviewSchema.find({ reviewee_id: userId })
                    .populate("reviewer_id")
                    .lean();
                retrievedUser = retrievedUser.toObject();
                retrievedUser.reviews = reviews;

                // console.log(retrievedUser)

                return [200, retrievedUser];
            }

            return [
                404,
                {
                    error: "Not Found",
                    message: "User is not found",
                },
            ];
        } catch (e) {
            console.log(e);
            return [
                500,
                {
                    error: "Internal Server Error",
                    message: "There is an error retrieving this user by ID",
                },
            ];
        }
    },

    // post reviews
    postReview: async ({ body, headers }, res) => {
        try {
            const { reviewee_id, rating, review_of_user } = body;
            const { email } = headers;

            console.log(rating)
            console.log(review_of_user)

            let review = await ReviewSchema.create({
                reviewee_id,
                rating,
                review_of_user,
                email,
            });

            // populate is like a join to get the rows based on the reviewer_id
            review = await review.populate("reviewer_id", "name picture");
            review = await review.populate("reviewee_id", "name picture");

            console.log(review);

            return [200, review];
        } catch (e) {
            console.log(e);
            return [
                500,
                {
                    error: "Internal Server Error",
                    message: "There is an error posting user review",
                },
            ];
        }
    },
};
