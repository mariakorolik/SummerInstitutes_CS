const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    user : {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    handle: {
        type: String,
        required: true,
        max: 40
    },
    company: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    githubusername: {
        type: String,
        required: false
    },
    social: {
        youtube: {
            type: String,
            required: false
        },
        twitter: {
            type: String,
            required: false
        },
        facebook: {
            type: String,
            required: false
        },
        linkedin: {
            type: String,
            required: false
        },
        instagram: {
            type: String,
            required: false
        },
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);