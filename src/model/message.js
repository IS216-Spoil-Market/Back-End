const { Request, Response } = require("express");
const MessageModel = require("../schema/message.js");
const UserModel = require("../schema/user.js");
const ChatModel = require("../schema/chat.js");

module.exports = {
    /**
     * Get all messages belonging to the user based on value in the params
     *
     * @param {Request} req
     * @param {Response} res
     * @returns {[number, Object]}
     */
    getMessages: async (req, res) => {
        try {
            const messages = await MessageModel.find({ chat: req.params.id })
                .populate("sender", "name pic email")
                .populate("chat");

            return [200, messages];
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
     * Send a message from the author (in req.user) to the receiver based on the chatId
     * Note that receiver is not in the payload, the chat is identified directly by using chatId instead
     * Updates the latest message as well (based on the currently created message)
     * Requires the getUserByEmail middleware to inject the user in the req
     *
     * @param {Request} req
     * @param {Response} res
     * @returns {[number, Object]}
     */
    sendMessage: async ({ body, user }, res) => {
        try {
            const { content, chatId } = body;
            const author = user;

            if (!content || !chatId) {
                return [
                    400,
                    {
                        error: "Bad Request",
                        message:
                            "There are missing parameters in the request body",
                    },
                ];
            }

            const newMessage = {
                sender: author._id,
                content: content,
                chat: chatId,
            };

            let message = await MessageModel.create(newMessage);

            message = await message.populate("sender", "name pic");
            message = await message.populate("chat");
            message = await UserModel.populate(message, {
                path: "chat.users",
                select: "name picture email",
            });

            await ChatModel.findByIdAndUpdate(body.chatId, {
                latestMessage: message,
            });

            return [201, message];
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
