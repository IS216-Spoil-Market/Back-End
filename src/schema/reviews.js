const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
    {
        // authored by
        reviewer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        // reviewed to
        reviewee_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        rating: {
            type: Number,
            required: true,
        },
        review_of_user: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

ReviewSchema.set("toJSON", {
    transform: (_, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject._v;
        delete returnedObject.__v;
    },
});

const UserReview = mongoose.model("review", ReviewSchema);
module.exports = UserReview;