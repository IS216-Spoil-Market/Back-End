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
    /**
* Get the users info 
* 
* @param {Request} req
* @param {Response} res
* @returns {[number, Object]}
*/
    getUsers: async (skill) => {
        try {

            // Check if user exists, if exists, return the user directly
            const users = await UserModel.aggregate([
                {
                    $lookup: {
                        from: "reviews",
                        localField: "_id",
                        foreignField: "reviewee_id",
                        as: "userRatings"
                    }

                },
                {
                    $addFields: {
                        averageRating: {               // Calculate average rating for each user
                            $cond: {
                                if: { $gt: [{ $size: "$userRatings" }, 0] },
                                then: { $avg: "$userRatings.rating" },
                                else: 0
                            }
                        }
                    }
                },
                {
                    $unwind: "$my_skills" 
                },
                {
                    $project: {     
                        name: 1,
                        picture: 1,
                        about: 1,
                        selectedSkill: "$my_skills",
                        averageRating: 1,
                    }
                }]);

            if (users.length > 0) {
                return [200, users];
            } else {
                return [404, {
                    error: "Not Found",
                    message: "Users not found"
                }]
            }

        } catch (e) {
            console.log(e);
            return [
                500,
                {
                    error: "Internal Server Error",
                    message: "There is an error retrieving users info",
                },
            ];
        }
    },

    /**
    * Get the user info by skill
    * 
    * @param {Request} req
    * @param {Response} res
    * @returns {[number, Object]}
    */
    getUsersBySkill: async (skill) => {
        try {
            // Check if user exists, if exists, return the user directly
            const usersWithRatings = await UserModel.aggregate([{
                $match: { my_skills: { $regex: skill, $options: 'i' } }
            },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "reviewee_id",
                    as: "userRatings"
                }

            },
            {
                $addFields: {
                    averageRating: {               // Calculate average rating for each user
                        $cond: {
                            if: { $gt: [{ $size: "$userRatings" }, 0] },
                            then: { $avg: "$userRatings.rating" },
                            else: 0
                        }
                    }
                }
            },
            {
                $unwind: "$my_skills" 
            },
            {
                $match: {
                    my_skills: { $regex: `^${skill}`, $options: 'i' } 
                }
            },
            {
                $project: {    
                    name: 1,
                    picture: 1,
                    about: 1,
                    selectedSkill: "$my_skills",
                    averageRating: 1,
                }
            }]);

            if (usersWithRatings.length > 0) {
                return [200, usersWithRatings];
            } else {
                return [404, {
                    error: "Not Found",
                    message: "User with specified skills not found"
                }]
            }

        } catch (e) {
            console.log(e);
            return [
                500,
                {
                    error: "Internal Server Error",
                    message: "There is an error retrieving user info",
                },
            ];
        }
    },

    /**
     * Updates the user profile based on form values passed from the front end
     *
     * @param {Request} req
     * @param {Response} res
     * @returns {[number, Object]}
     */
    updateProfile: async ({ body }, res) => {
        try {
            // Email is purposely removed so that it won't be updated
            const { id, email, ...rest } = body;

            const updatedUser = await UserModel.findByIdAndUpdate(id, rest, {
                new: true,
                runValidators: true,
            });

            if (!updatedUser)
                return [
                    404,
                    {
                        error: "Not Found",
                        message: `User with ID ${id} not found.`,
                    },
                ];

            return [200, updatedUser];
        } catch (e) {
            console.log(e);
            return [
                500,
                {
                    error: "Internal Server Error",
                    message: "There is an error updating user profile ",
                },
            ];
        }
    },
};
