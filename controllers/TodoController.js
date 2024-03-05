import TodoModel from '../models/Todo.js';

export const create = async (request, response) => {
    const {text, todoDate} = request.body;
    const userId = request.userId

    try {
        const data = new TodoModel({text, todoDate, isDone: false, user: userId});
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
    const conditions = {user: request.userId};
    const {page, size, ...options} = request.query;
    console.log(page, size, options)
    for (let key in options) {
        if (options[key]) {
            conditions[key] = options[key];
        }
    }

    try {
        const todos = await TodoModel.find(conditions)
            .limit(+size * 1)
            .skip((+page - 1) * +size)
            .sort({createdAt: 'desc'})
            .exec();
        const count = await TodoModel.countDocuments(conditions);    
        return response.status(200).json({
            todos,
            totalPages: Math.ceil(count / size),
            currentPage: +page,
        });
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
        const res = await TodoModel.deleteMany({_id: {$in: idArray}, isDone: true });
        return response.status(200).json({message: `${res.deletedCount} Todos was deleted`});            
    } catch (error) {
            console.log(error);
            response.status(500).json({
                message: 'Can\'t delete some todos'
            })
    }
};