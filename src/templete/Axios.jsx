import axios from 'axios';

export const customAxios = axios.create({
    baseURL: process.env.REACT_APP_API_URL + "/v2",
    withCredentials: true,
    validateStatus: function (status) {
        return status < 500;
    }
})