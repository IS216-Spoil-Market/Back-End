const express = require("express");
const { getChats, getChatById } = require("../model/chat");
const { getUserByEmail } = require("../service/userService");
const router = express.Router();

router
    .route("")
    .get(getUserByEmail, async (req, res) => {
        const [code, response] = await getChats(req, res);
        res.status(code).json(code === 200 ? response : { code, ...response });
    })
    .post(getUserByEmail, async (req, res) => {
        const [code, response] = await getChatById(req, res);
        res.status(code).json(
            code === 200 || code === 201 ? response : { code, ...response }
        );
    });

module.exports = router;
