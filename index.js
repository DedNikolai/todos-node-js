import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import {TodoController, UserController} from './controllers/index.js';
import {checkAuth, handleValidationErrors} from './utils/index.js';
import { loginValidation, registerValidation, userValidation } from "./validations/validation.js";
import handlevalidationErrors from './utils/handlevalidationErrors.js';

const app = express();
const PORT = 8000;

mongoose.connect('mongodb+srv://DedNikolai:As541035@cluster0.ez3irsp.mongodb.net/todos?retryWrites=true&w=majority')
.then(() => console.log("DB OK"))
.catch((error) => console.log('DB error', error));

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(express.static('public'))

app.get('/', (request, response) => {
    response.render('index');
});

app.post('/todos', TodoController.create);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.registerUser);
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);
app.post('/auth/upload-image', checkAuth, UserController.upload.single('image'), UserController.uploadAvatar);
app.patch('/auth/update/:id', checkAuth, userValidation, handlevalidationErrors, UserController.updateUser);

app.listen(PORT, (error) => {
    if (error) {
        return console.log(error);
    }
    console.log('Server OK');
})