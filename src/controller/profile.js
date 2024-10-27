const express = require("express");
const router = express.Router();
const { fetchUserInfo } = require("../service/authService");
const { createOrGetUser, updateProfile } = require("../model/user");

router.post("/", fetchUserInfo, async (req, res) => {
    const [code, response] = await createOrGetUser(req, res);
    res.status(code).json(code === 500 ? { code, ...response } : response);
});

router.put("/", fetchUserInfo, async (req, res) => {
    const [code, response] = await updateProfile(req, res);
    res.status(code).json(code === 200 ? response : { code, ...response });
});

module.exports = router;
