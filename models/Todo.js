import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },

    isDone: {
        type: Boolean,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    todoDate: {
        type: Date,
        required: true
    }},
    
    {
        timestamps: true,
    }
    
);

export default mongoose.model('Todo', TodoSchema);

