const express = require("express");
const router = express.Router();
const { postReview, getReviewById } = require("../model/reviews.js");
const { getUserByEmail } = require("../service/userService.js");

// post review
router.post("/", getUserByEmail, async (req, res) => {
    try {
        const [code, response] = await postReview(req, res);
        res.status(code).json(response);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            code: 500,
            error: "Internal Server Error",
            message: "An unknown error occurred",
        });
    }
});

// get reviews by id
router.get("/:id", async (req, res) => {
    const [code, response] = await getReviewById(req, res);
    res.status(code).json(code === 200 ? response : { code, ...response });
});

module.exports = router;
