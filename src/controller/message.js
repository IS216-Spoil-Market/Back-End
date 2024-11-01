const express = require("express");
const { getMessages, sendMessage } = require("../model/message.js");
const { getUserByEmail } = require("../service/userService");
const router = express.Router();

router.get("/:id", async (req, res) => {
    const [code, response] = await getMessages(req, res);
    res.status(code).json(code === 200 ? response : { code, ...response });
});

router.post("", getUserByEmail, async (req, res) => {
    const [code, response] = await sendMessage(req, res);
    res.status(code).json(
        code === 200 || code === 201 ? response : { code, ...response }
    );
});

module.exports = router;
