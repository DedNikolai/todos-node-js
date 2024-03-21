import UserModel from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';
import fs from 'fs';
import VerifyToken from '../models/VerifyToken.js';
import ResetPassToken from '../models/ResetPassToken.js';
import crypto from 'crypto';
import {sendEmail} from '../utils/index.js'

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

        let chekUser = await UserModel.findOne({ email: email });
       
        if (chekUser) {
            return response.status(400).json({message: "User with given email already exist!"});
        }
        
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
        
        if (userFromDB) {
            let setToken = await VerifyToken.create({
                user: userFromDB._id,
                token: crypto.randomBytes(16).toString("hex"),
            });

            const message = `http://localhost:3000/auth/verify/${userFromDB._id}?token=${setToken.token}`;
            await sendEmail(userFromDB.email, "Verify Email", message);
        }

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

        if (!user || !user.verified) {
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

export const verify = async (request, response) => {
    const {token} = request.query;
    const id = request.params.id;

    try {

        const verifyToken = await VerifyToken.findOne({user: id, token: token});

        if (!verifyToken) {
            return response.status(400).json({message: "Email was not confirmed"})
        }

        UserModel.findOneAndUpdate({_id: id}, {verified: true}, {returnDocument: 'after'})
        .then(res => {
            if (!res) {
                return response.status(400).json({message: `User ${id} not found`})
            }
            verifyToken.deleteOne();
            return response.status(200).json({message: "Email was confirmed"});
        }) 
            
    
    } catch(error) {
        console.log(error);
        response.status(500).json({
            message: 'Can\'t confirm email'
        })
    }
};

export const forgotPass = async (request, response) => {
    const {email} = request.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({message: "Email was not found"})
        }

        let token = await ResetPassToken.findOne({ user: user._id });
        
        if (token) { 
            await token.deleteOne()
        };

        const salt = await bcrypt.genSalt(10);
        const resetToken = crypto.randomBytes(16).toString("hex");
        const hash = await bcrypt.hash(resetToken, salt);



        await new ResetPassToken({
            user: user._id,
            token: hash,
            createdAt: Date.now(),
          }).save();
 
          const message = `http://localhost:3000/reset-pass/${user._id}?token=${resetToken}`;
          await sendEmail(user.email, "Verify Email", message);
          return response.status(200).json({message: "To reset pass check ypur email"});

    } catch(error) {
        console.log(error);
        response.status(500).json({
            message: 'Can\'t reset password'
        })
    }
};

export const resetPass = async (request, response) => {
    const {password, id, token} = request.body

    try {
        const  passwordResetToken = await ResetPassToken.findOne({user: id });
        
        if (!passwordResetToken) {
            throw new Error("Invalid or expired password reset token");
        }

        const isValid = await bcrypt.compare(token, passwordResetToken.token);
        
        if (!isValid) {
            throw new Error("Invalid password reset token");
        }

        const salt = await bcrypt.genSalt(10);
        const passHash = await bcrypt.hash(password, salt);
        
        UserModel.findOneAndUpdate({_id: id}, {passwordHash: passHash}, {returnDocument: 'after'})
        .then(res => {
            if (!res) {
                return response.status(400).json({message: `Password was not updated`})
            }
            passwordResetToken.deleteOne();
            return response.status(200).json({message: "Password was updated"});
        }) 
            
    
    } catch(error) {
        console.log(error);
        response.status(500).json({
            message: 'Can\'t update password'
        })
    }
};

export const updateEmail = async (request, response) => {

    try {
        const {email} = request.body;
        const id = request.params.id;
        const user = await UserModel.findById(id);

        if (!user) {
            return response.status(400).json({message: "User not found"})
        };

        let token = await VerifyToken.findOne({ user: user._doc._id });
        
        if (token) { 
            await token.deleteOne()
        };

        let setToken = await VerifyToken.create({
            user: user._doc._id,
            token: crypto.randomBytes(16).toString("hex"),
        });

        const message = `Verify code:    ${setToken.token}`;
        await sendEmail(email, "Verify Email", message);

        return response.status(200).json({message: "We send verify code to you email to confirm changes"})
        
    } catch (error) {
        console.log(error);
        response.status(500).json({message: 'Update Failed'});
    }

};

