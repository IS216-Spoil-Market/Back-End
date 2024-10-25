const express = require("express");
// const { validateToken } = require("../service/authService");
const router = express.Router();
const { checkJwt, fetchUserInfo } = require("../service/authService");

router.use(checkJwt);

router.get("/", fetchUserInfo, (req, res) => {
    console.log(req.user);
    res.send("Hello from profile");
});

module.exports = router;
