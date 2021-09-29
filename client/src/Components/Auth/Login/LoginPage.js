import React, { useState } from 'react'
import './LoginPage.css'
import { Grid, TextField, Button, Stack } from '@mui/material'
import Input from '../../Input/Input'
import { Link } from 'react-router-dom'
import GoogleLogin from 'react-google-login';
import Icon from '../Register/Icon'
import dotenv from 'dotenv'
import { useDispatch } from 'react-redux'
import { addUser, loginUser } from '../../../Action/UserAction'
import { useHistory } from 'react-router-dom'

const initialState = {
    email: "",
    password: "",
}

dotenv.config()
function LoginPage() {

    const history = useHistory()
    const dispatch = useDispatch()

    const [isLogin, setIsLogin] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(initialState)

    const submitHandler = (e) => {
        ///TODO:
        e.preventDefault()
        console.log({ formData })
        dispatch(loginUser(formData, history));
    }
    const handleChange = (e) => {
        e.preventDefault()
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const handleShowPassword = (e) => {
        setShowPassword((prev) => !prev)
    }
    const googleSuccess = async (res) => {
        // TODO:
        console.log(res)
        const result = res?.profileObj
        const token = res?.tokenId

        try {
            dispatch(addUser({ result, token }))
            history.push('/room')
        } catch (err) {
            console.log(err)
        }
    }
    const googleFailure = (res) => {
        // TODO:
        console.log('Failed while google login!!!')
    }

    return (
        <div>
            <div className="login-container">
                <form onSubmit={submitHandler}>
                    <Grid container spacing={2}>
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
                        <div className="submit-buttons">
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"

                            >
                                Log In
                            </Button>
                            <div className='google-button'>
                                <GoogleLogin

                                    clientId={process.env.REACT_GOOGLE_CLIENT_API_KEY}
                                    render={
                                        (renderProps) => (
                                            <>
                                                <Button
                                                    className='google-button'
                                                    color="primary"
                                                    fullWidth
                                                    onClick={renderProps.onClick}
                                                    disabled={renderProps.disabled}
                                                    startIcon={<Icon />}
                                                    variant="contained"
                                                >
                                                    Google
                                                </Button>
                                            </>
                                        )
                                    }
                                    onSuccess={googleSuccess}
                                    onFailure={googleFailure}
                                    cookiePolicy={'single_host_origin'}

                                />
                            </div>

                        </div>


                    </Grid>

                    <div> Havn't account !! <Link to='/register'>Register Here</Link></div>
                </form>

            </div>
        </div>
    )
}

export default LoginPage
