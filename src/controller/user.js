const express = require("express");
const router = express.Router();
const { getUsersBySkill} = require("../model/user");


router.get("/:skill", async (req, res) => {
    const skill = req.params.skill;
    const [code, response] = await getUsersBySkill(skill);
    res.status(code).json(code === 200 ? response : { code, ...response });
});

router.get("", async (req, res) => {
    const [code, response] = await getUsersBySkill("");
    res.status(code).json(code === 200 ? response : { code, ...response });
});

module.exports = router;