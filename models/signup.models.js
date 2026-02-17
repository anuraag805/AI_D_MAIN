const mongoose = require('mongoose');

const signupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        }, 

        email: {
            type: String,
            unique: true,
            required: true
        },

        username: {
            type: String,
            unique: true,
            required: true
        },

        password: {
            type: String,
            minlength: 6,
            required: true
        }
    }, {
        timestamps: true
    }
)

const signup = mongoose.model('signup', signupSchema);
module.exports = signup;