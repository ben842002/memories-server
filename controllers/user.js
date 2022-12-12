import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

export const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        // check if email is in the mongo database
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User doesn't exist!" });
        }    

        // if email is in database, check if the password that was entered is correct
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // if email and password are correct, login the user and create a token that lasts for a certain amount of time (expiresIn)
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "2h" });
        res.status(200).json({ result: existingUser, token });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const signUp = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    try {
        // check if user already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(404).json({ message: "User already exist!" });
        }    

        // check if password is equal to the confirmPassword
        if (password != confirmPassword) {
            return res.status(400).json({ message: "Passwords don't match!" })
        }

        // hash password via bcrypt
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // create new user
        const newUser = {
            email, 
            password: hashedPassword,
            name: `${firstName} ${lastName}`
        }

        const result = await User.create(newUser);
        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: "2h" });

        res.status(200).json({ result, token });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}