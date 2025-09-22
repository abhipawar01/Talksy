import e from 'express';    
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

//Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

//API to register a user

export const registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        const userExists = await User.findOne({email});
        if(userExists){
            return res.json({success: false, message:"User already Exists"});
        }
        const user = await User.create({name, email, password});

        const token = generateToken(user._id);
        res.json({success:true , token});
    } catch (error) {
        return res.json({success: false, message: error.message}); 
    }
}

//API to login a user
export const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const userExists = await User.findOne({email});
        if(userExists){
            const isMatch = await bcrypt.compare(password, userExists.password);

            if(isMatch){
                const token = generateToken(userExists._id);
                return res.json({success:true , token});
            }
        }
        return res.json({success: false, message: "Invalid Credentials"});
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

//API to get user data

export const getUser = async (req, res) => {
    try {
        const user = req.user;
        return res.json({success:true, user});
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}