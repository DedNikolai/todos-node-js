import mongoose from "mongoose";

const VerifyTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 24*3600
   },
    });

    export default mongoose.model('VerifyToken', VerifyTokenSchema);