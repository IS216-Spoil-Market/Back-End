const UserModel = require("../schema/user.js");
const { Request, Response } = require("express");

module.exports = {
    /**
     * Creates a new user if yet to exists and return the user
     * Else, returns the user only
     * 
     * @param {Request} req
     * @param {Response} res
     * @returns {[number, Object]}
     */
    createOrGetUser: async (req, res) => {
        try {
            const { email, name, picture } = req.user;

            // Check if user exists, if exists, return the user directly
            const retrievedUser = await UserModel.findOne({
                email,
            });

            if (retrievedUser) {
                return [200, retrievedUser];
            }

            // Save the user if it is new
            const newUser = await new UserModel({
                email,
                name,
                picture,
            }).save();

            return [201, newUser];
        } catch (e) {
            console.log(e);
            return [
                500,
                {
                    error: "Internal Server Error",
                    message: "There is an error retrieving or saving a user",
                },
            ];
        }
    },
};
