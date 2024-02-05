import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import {TodoController} from './controllers/index.js';

const app = express();
const PORT = 8000;

mongoose.connect('mongodb+srv://DedNikolai:As541035@cluster0.ez3irsp.mongodb.net/todos?retryWrites=true&w=majority')
.then(() => console.log("DB OK"))
.catch((error) => console.log('DB error', error));

app.use(express.json());
app.use(cors());

app.get('/', (request, response) => {
    return response.send('Hello Node Server')
});

app.post('/todos', TodoController.create);

app.listen(PORT, (error) => {
    if (error) {
        return console.log(error);
    }

    console.log('Server OK')
})