const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./../models/user.modal')
var randomstring = require("randomstring");



const LoginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const existingUser = await User.findOne({ email: email })
        if (!existingUser) {
            return res.status(201).json({ code: 201, message: 'User Not Registered' })
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordCorrect) {
            return res.status(202).json({ code: 202, message: 'Invalid Password!!' })
        }
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" })
        res.status(200).json({ result: existingUser, token })
    } catch (err) {
        return res.status(500).json({ code: 500, message: 'Something went to wrong!!' })
    }
}
const registerUser = async (req, res) => {
    // Sign up
    const { email, password, confirmpassword, firstname, lastname } = req.body

    try {
        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res.status(201).json({ code: 201, message: 'User Already Registered!!' })
        }
        if (password != confirmpassword) {
            return res.status(202).json({ code: 202, message: 'Password & Confirm Password are not matched!!' })
        }
        const hashPassword = await bcrypt.hash(password, 12);
        const result = await User.create({ email, password: hashPassword, name: `${firstname} ${lastname}` })
        const token = await jwt.sign({ email: result.email, id: result._id }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" })
        // console.log({ result, token })
        res.status(200).json({ result, token })
    } catch (error) {
        return res.status(500).json({ code: 500, message: 'Something went to wrong!!' })
    }
}

const googleAuthUser = async (req, res) => {
    // Sign up
    const { userName, googleLogin, email, imageUrl } = req.body

    try {
        const existingUser = await User.findOne({ email: email })
        console.log({ existingUser })
        if (existingUser) {
            // Login Property


            const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" })
            return res.status(200).json({ result: existingUser, token })

        } else {
            // Registration Property
            let password = randomstring.generate(8);
            const hashPassword = await bcrypt.hash(password, 12);
            const result = await User.create({ email, password: hashPassword, name: userName, imageUrl: imageUrl })
            const token = await jwt.sign({ email: result.email, id: result._id }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" })
            return res.status(200).json({ result, token })

        }




        return res.status(204).send({});
        // console.log({ result, token })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ code: 500, message: 'Something went to wrong!!' })
    }
}
module.exports = { LoginUser, registerUser, googleAuthUser }