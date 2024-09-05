import axios from 'axios';
import queryString from 'query-string';
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'content-type': 'application/json'
    },
    paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');
    const tokenCybersoft = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA2NSIsIkhldEhhblN0cmluZyI6IjIwLzExLzIwMjQiLCJIZXRIYW5UaW1lIjoiMTczMjA2MDgwMDAwMCIsIm5iZiI6MTcwMjMxNDAwMCwiZXhwIjoxNzMyMjA4NDAwfQ.8jL30xUvuN74PYnFHxIjmfu65QEtLdvz_dWZnK6QxGk';
    config.headers.Authorization = "Bearer "+token;
    config.headers.TokenCybersoft = tokenCybersoft;
    return config;
});


axiosClient.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data;
    }
    return response;
}, (error) => {
   console.log(error.response)
    return error.response;
});

export default axiosClient; 
