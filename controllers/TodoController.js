import TodoModel from '../models/Todo.js';

export const create = async (request, response) => {
    const {text, isDone} = request.body;

    try {
        const data = new TodoModel({text, isDone});
        const todo = await data.save();
        response.status(200).json(todo);
    } catch(error) {
        console.log(error);
        response.status(500).json({
            message: 'Todo wasn\'t created'
        })
    }
}