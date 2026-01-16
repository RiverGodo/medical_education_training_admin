import axios from 'axios';
import url from '../../../config/url'
export default axios.create({
    baseURL: url,
    timeout: 60000,
    withCredentials: false,
    data: {  token: sessionStorage.getItem('token') || '' }
});
