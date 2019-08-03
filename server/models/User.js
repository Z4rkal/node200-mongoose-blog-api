const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true }, // firstName property is a string and required
    lastName: { type: String, required: true },

    email: { type: String, required: true },

    social: {
        facebook: { type: String, required: false },
        twitter: { type: String, required: false },
        linkedIn: { type: String, required: false }
    },

    blogs: [{ type: Schema.Types.ObjectId, ref: 'Blog' }]
});

module.exports = mongoose.model('User', UserSchema);