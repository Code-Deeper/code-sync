import React, { useState } from 'react'
import Input from '../../Input/Input'
import { Grid, TextField, Button, Stack } from '@mui/material'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import GoogleLogin from 'react-google-login';
import Icon from './Icon'
import { registerUser } from '../../../Action/UserAction';
import { useHistory } from 'react-router-dom'

const initialState = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: ""

}
function Register() {
    const history = useHistory()
    const dispatch = useDispatch();
    const [isLogin, setIsLogin] = useState(false)
    const [formData, setFormData] = useState(initialState)
    const submitHandler = (e) => {
        ///TODO:
        e.preventDefault()
        console.log({ formData })
        dispatch(registerUser(formData, history));

    }
    const handleChange = (e) => {
        e.preventDefault()
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const [showPassword, setShowPassword] = useState(false)
    const handleShowPassword = (e) => {
        setShowPassword((prev) => !prev)
    }
    return (
        <div>
            <div>
                <div className="login-container">
                    <form onSubmit={submitHandler}>
                        <Grid container spacing={2}>
                            <Input
                                name="firstname"
                                label="firstname"
                                handleChange={handleChange}
                                autoFocus={true}
                                half
                            />
                            <Input
                                name="lastname"
                                label="lastname"
                                handleChange={handleChange}
                                autoFocus={true}
                                half
                            />

                            <Input
                                name="email"
                                label='Email Address'
                                handleChange={handleChange}
                                type="email"

                            />
                            <Input
                                name="password"
                                label='Password'
                                handleChange={handleChange}
                                type={showPassword ? 'text' : 'password'}
                                handleShowPassword={handleShowPassword}
                            />
                            <Input
                                name="confirmpassword"
                                label='Repeat Password'
                                handleChange={handleChange}
                                type="password"
                            />
                            <div className="submit-buttons">
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"

                                >
                                    Register User
                                </Button>
                            </div>

                        </Grid>
                        <div> Already Registered? account !! <Link to='/login'>Login Here</Link></div>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default Register
