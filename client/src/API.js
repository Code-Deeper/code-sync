import axios from 'axios';
import { BaseURL } from './BaseURL'
const AXIOS = axios.create({
    baseURL: BaseURL,
    withCredentials: true
});

AXIOS.interceptors.request.use((req) => {
    if (localStorage.getItem('authUser')) {
        req.headers.Authorization = 'Bearer ' + JSON.parse(localStorage.getItem('authUser')).token;
    }
    return req;
})



export default AXIOS;