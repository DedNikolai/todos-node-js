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
    }
    });

    export default mongoose.model('VerifyToken', VerifyTokenSchema);