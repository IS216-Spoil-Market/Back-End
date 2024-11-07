const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
    {
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
        ],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "message",
        },
    },
    { timestamps: true }
);

ChatSchema.set("toJSON", {
    transform: (_, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject._v;
        delete returnedObject.__v;
    },
});

const Chat = mongoose.model("chat", ChatSchema);
module.exports = Chat
