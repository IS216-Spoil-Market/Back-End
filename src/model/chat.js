const ChatModel = require("../schema/chat.js");
const { Request, Response } = require("express");
const UserModel = require("../schema/user.js");

module.exports = {
    /**
     * Get all chats belonging to a single user
     * Requires the getUserByEmail middleware to inject the user in the req
     *
     * @param {Request} req
     * @param {Response} res
     * @returns {[number, Object]}
     */
    getChats: async (req, res) => {
        try {
            const author = req.user;

            let chats = await ChatModel.find({
                users: { $elemMatch: { $eq: author._id } },
            })
                .populate("users")
                .populate("latestMessage")
                .sort({ updatedAt: -1 });

            chats = await UserModel.populate(chats, {
                path: "latestMessage.sender",
                select: "name picture email",
            });

            return [200, chats];
        } catch (e) {
            console.log(e);
            return [
                500,
                {
                    error: "Internal Server Error",
                    message: "There is an error retrieving your chats",
                },
            ];
        }
    },
    /**
     * Get a chat by the receiver's id (from the user body)
     * If the chat between the author and the receiver is missing, create a new chat between them instead
     * Requires the getUserByEmail middleware to inject the user in the req
     * 
     * In either cases, always return the chat item unless there is an error
     * 
     * @param {Request} req
     * @param {Response} res
     * @returns {[number, Object]}
     */
    getChatById: async ({ body, user }, res) => {
        try {
            const { id: receiverId } = body;

            // Retrieve the user based on the email first
            const author = user;

            // Try to find the chat by the author and receiver id
            let isChat = await ChatModel.find({
                $and: [
                    { users: { $elemMatch: { $eq: author._id } } },
                    { users: { $elemMatch: { $eq: receiverId } } },
                ],
            })
                .populate("users")
                .populate("latestMessage");

            // Get from User Model to append additional fields in isChat
            isChat = await UserModel.populate(isChat, {
                path: "latestMessage.sender",
                select: "name picture email",
            });

            // If isChat is populated, it means the chat existed, return it directly
            if (isChat.length > 0) {
                return [200, isChat[0]];
            }

            const chatData = {
                users: [author._id, receiverId],
            };

            // Create new chat for cases where the chat is missing
            const createdChat = await ChatModel.create(chatData);
            const fullChat = await ChatModel.findOne({
                _id: createdChat._id,
            }).populate("users");

            return [201, fullChat];
        } catch (e) {
            console.log(e);
            return [
                500,
                {
                    error: "Internal Server Error",
                    message: "There is an error retrieving the chat",
                },
            ];
        }
    },
};
