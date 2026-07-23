

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists', success: false });
        }

        const hashed = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashed });
        await newUser.save();

        return res.status(201).json({ message: 'User created successfully', success: true, userId: newUser._id });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

const login = async (req, res) => {
    try {
        const {  email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(403).json({ message: 'User not found', success: false });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(403).json({ message: 'Invalid credentials', success: false });
        }
        const jwtToken = jwt.sign({email: existingUser.email, id: existingUser._id}, process.env.JWT_SECRET, { expiresIn: '24h' });

        return res.status(200).json({ message: 'Login successful', success: true,  jwtToken  ,email : existingUser.email, name: existingUser.name });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}
module.exports = { signup,login };