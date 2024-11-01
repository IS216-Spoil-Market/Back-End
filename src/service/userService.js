const message = require("../model/message");
const UserModel = require("../schema/user");

const getUserByEmail = async (req, res, next) => {
    try {
        const { email } = req.headers;

        // Retrieve the user based on the email first
        const user = await UserModel.findOne({
            email,
        });

        if (!user) {
            return res
                .status(404)
                .json({ error: "Not Found", message: "User is not found" });
        }

        req.user = user;

        next();
    } catch (e) {
        return res.status(500).json({
            error: "Internal Server Error",
            message: "There is an error trying to retrieve the user",
        });
    }
};

module.exports = { getUserByEmail };
