const express = require("express");
const router = express.Router();
const { fetchUserInfo } = require("../service/authService");
const { createOrGetUser } = require("../model/user");

router.post("/", fetchUserInfo, async (req, res) => {
    const [code, response] = await createOrGetUser(req, res);
    res.status(code).json(code === 500 ? { code, ...response } : response);
});

module.exports = router;
