import User from '../models/User'
import bcrypt from 'bcrypt';
import { generateToken } from '../services/authService';

export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({email})

        if(!user){
            return res.status(404).json({msg: 'Invalid email or password'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(404).json({msg: 'Invalid email or password'})
        }

        const token = generateToken(user)
        return res.status(200).json({msg: 'Login successful', token})


    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}