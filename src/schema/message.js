const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        content: {
            type: String,
            trim: true,
        },
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "chat",
        },
    },
    { timestamps: true }
);

MessageSchema.set("toJSON", {
    transform: (_, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject._v;
        delete returnedObject.__v;
    },
});

const Message = mongoose.model("message", MessageSchema);
module.exports = Message;
