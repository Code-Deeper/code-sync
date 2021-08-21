import axios from 'axios';
import { BaseURL } from './BaseURL'
const API = axios.create({
    baseURL: BaseURL,
    withCredentials: true
});

export default API;