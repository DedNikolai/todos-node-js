import TodoModel from '../models/Todo.js';

export const create = async (request, response) => {
    const {text, isDone} = request.body;
    const userId = request.userId

    try {
        const data = new TodoModel({text, isDone: false, user: userId});
        const todo = await data.save();
        response.status(200).json(todo);
    } catch(error) {
        console.log(error);
        response.status(500).json({
            message: 'Todo wasn\'t created'
        })
    }
};

export const getAllByUser = async (request, response) => {
    const userId = request.userId

    try {
        const todos = await TodoModel.find({user: userId}).exec();
        return response.status(200).json(todos);
    } catch(error) {
        console.log(error);
        response.status(500).json({
            message: 'Can\'t find todos'
        })
    }
};