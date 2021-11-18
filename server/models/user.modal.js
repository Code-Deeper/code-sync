const mongoose = require("mongoose");

const User = mongoose.model("User", {
    name: {
        type: "String",
        required: true,
    },
    email: {
        type: "String",
        required: true,
    },
    password: {
        type: "String",
        required: true,
    },
    id: {
        type: "String",
    },
    googleLogin: {
        type: "Boolean",
        default: false,
    },
    imageUrl: {
        type: "String",
        
    }
}); 

module.exports = User;
