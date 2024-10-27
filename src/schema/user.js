const mongoose = require("mongoose");
const muv = require("mongoose-unique-validator");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true,
    },
    name: {
        type: String,
        require: true,
    },
    picture: {
        type: String,
        require: true,
    },
    about: {
        type: String,
        require: true,
        default: "",
    },
    skills_interested: {
        type: [String],
        require: true,
        default: [],
    },
    my_skills: {
        type: [String],
        require: true,
        default: [],
    },
});

UserSchema.set("toJSON", {
    // This is to return _id as id and the unnecessary _v property
    transform: (_, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject._v;
    },
});

UserSchema.plugin(muv, { message: "Email is already in use" });

const User = mongoose.model("user", UserSchema);
module.exports = User;
