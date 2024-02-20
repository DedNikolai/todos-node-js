import TodoModel from '../models/Todo.js';

export const create = async (request, response) => {
    const {text} = request.body;
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
    const done = request.query.isDone;
    let conditions;

    if (done === undefined || done === '') {
        conditions = {user: userId}
    } else {
        conditions = {user: userId, isDone: done}
    }

    try {
        const todos = await TodoModel.find(conditions)
            .sort({updatedAt: 'desc'})
            .exec();
        return response.status(200).json(todos);
    } catch(error) {
        console.log(error);
        response.status(500).json({
            message: 'Can\'t find todos'
        })
    }
};

export const update = async (request, response) => {
    const {text, isDone} = request.body;

    try {
        const todoId = request.params.id;

        TodoModel.updateOne({_id: todoId}, {
            text,
            isDone
        }).then(doc => { 
            if (!doc) {
                
                return response.status(400).json({message: `Todo ${todoId} not found`})
            }

            return response.status(200).json({message: `Todo ${todoId} was updated`})
            
        }).catch(() => {
            return response.status(400).json({message: `Todo ${todoId} not found`})
        })
    } catch (error) {
            console.log(error);
            response.status(500).json({
                message: 'Can\'t update todo'
            })
    }
};

export const remove = (request, response) => {
    try {
       const todoId = request.params.id;
       TodoModel.findOneAndDelete({_id: todoId}).then(doc => {
            if (!doc) {
                return response.status(404).json({message: "Todo not found"})
            }

            return response.status(200).json({message: `Todo ${todoId} was deleted`})
       }).catch(err => {
        if (err) {
            console.log(err);
            return response.status(500).json({
                        message: 'Can\'t delete todo'
                    })
        }
       })

    } catch (error) {
        console.log(error);
        response.status(500).json({
            message: 'Can\'t delete todo'
        })
    }
};

export const updateAll = async (request, response) => {
    const idArray = request.body;

    try {
        const res = await TodoModel.updateMany({_id: {$in: idArray}},
            {isDone: true});
        return response.status(200).json({message: `${res.matchedCount} Todos was updated`});            
    } catch (error) {
            console.log(error);
            response.status(500).json({
                message: 'Can\'t update some todos'
            })
    }
};

export const removeAll = async (request, response) => {
    const idArray = request.body;
    try {
        const res = await TodoModel.deleteMany({isDone: true });
        return response.status(200).json({message: `${res.deletedCount} Todos was deleted`});            
    } catch (error) {
            console.log(error);
            response.status(500).json({
                message: 'Can\'t delete some todos'
            })
    }
};