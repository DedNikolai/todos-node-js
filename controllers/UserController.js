import UserModel from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
      try {
        if (!fs.existsSync('uploads/avatars')) {
            fs.mkdirSync('uploads/avatars', {recursive: true});
          }
      } catch (error) {
        console.error(error)
      }
      cb(null, 'uploads/avatars');
    },
    filename: (request, file, cb) => {
      const savedFileName = Date.now() + '-' + file.originalname;
      request.fileName = savedFileName; 
      cb(null, savedFileName);
    }
  });

export const upload = multer({storage});

export const registerUser = async (request, response) => {
    try {
        const {firstName, lastName, password, email, avatarUrl} = request.body;
        const salt = await bcrypt.genSalt(10);
        const passHash = await bcrypt.hash(password, salt);

        const data = new UserModel({
            email,
            firstName,
            lastName,
            avatarUrl,
            passwordHash: passHash
        });

        const userFromDB = await data.save();
        const token = jwt.sign({
            _id: userFromDB._id,

        }, 'todosSK', {expiresIn: '30d'});

        const {passwordHash, ...user} = userFromDB._doc;
        return response.status(200).json({...user, token});

    } catch (error) {
        console.log(error);
        response.status(500).json({message: 'Rgistration Failed'});
    }

};

export const login = async (request, response) => {
    try {
        const {password, email} = request.body;
        const user = await UserModel.findOne({email});

        if (!user) {
            return response.status(403).json({message: 'User not found' })
        }
        const isValidPass = await bcrypt.compare(password, user._doc.passwordHash);
        
        if (!isValidPass) {
            return response.status(403).json({message: 'Wrong mail or pass' })
        }

        const token =jwt.sign({
            _id: user._doc._id,
        }, 'todosSK', {expiresIn: '30d'});

        const {passwordHash, ...userFromDB} = user._doc;

        return response.json({...userFromDB, token})

    } catch (error) {
        console.log(error);
        response.status(500).json({
        message: 'Auth Failed'
    })
    }
};

export const getMe = async (request, response) => {
    try {
        const user = await UserModel.findById(request.userId);

        if (!user) {
            return response.status(403).json({message: 'User not found'})
        }

        const {passwordHash, ...userFromDb} = user._doc;
        return response.status(200).json(userFromDb);

    } catch(error) {
        console.log(error);
        response.status(500).json({
        message: 'Rgistration Failed'
        })
    }
};

export const uploadAvatar = async (request, response) => {
    try {
        response.json({
            url: `/uploads/avatars/${request.fileName}`
        })
    } catch (error) {
        console.log(error);
        response.status(500).json({
        message: 'Upload Failed'
        })
    }
};

export const updateUser = async (request, response) => {

    try {
        const {...user} = request.body;
        const id = request.params.id;
        UserModel.findOneAndUpdate({_id: id}, {...user}, {returnDocument: 'after'})
        .then(res => {
            if (!res) {
                return response.status(400).json({message: `User ${id} not found`})
            }

            return response.status(200).json(res._doc)
        }) 
        
    } catch (error) {
        console.log(error);
        response.status(500).json({message: 'Update Failed'});
    }

};