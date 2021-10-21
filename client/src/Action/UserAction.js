import React from 'react'
import { ADD_USER, REMOVE_USER, ADD_USER_ERROR, REMOVE_USER_ERROR, AUTHORIZATION} from '../Constant/UserConst'
import axios from 'axios'
import { push } from 'react-router-redux'

export const addUser = (data) =>
    async dispatch => {
        try {
            dispatch({
                type: ADD_USER,
                payload: data
            })
        } catch (err) {
            dispatch({
                type: ADD_USER_ERROR,
                payload: err
            })
        }
    }

export const removeUser = () =>
    async dispatch => {
        try {
            dispatch({
                type: REMOVE_USER,
                payload: {}
            })
        } catch (err) {
            dispatch({
                type: REMOVE_USER_ERROR,
                payload: {}
            })
        }
    }

export const loginUser = (formData, push) =>
    async dispatch => {
        try {
           
            // const { data } = await axios.post('/api/user/login', formData);
            console.log(formData)
            dispatch({
                type: AUTHORIZATION,
                payload: formData
            })
            // history.push('/room')
            // console.log(push)
            // console.log("hererer")
            // push('/room')
        } catch (err) {
            console.log(err)
            push('/')
        }
    }

export const registerUser = (formData, history) =>
    async dispatch => {
        try {
            const {data} = await axios.post('/api/user/register', formData);
            console.log({data})
            dispatch({
                type: AUTHORIZATION,
                payload: data
            })
            history.push('/room')
        } catch (err) {
            console.log(err)
            history?.push('/')
        }
    }