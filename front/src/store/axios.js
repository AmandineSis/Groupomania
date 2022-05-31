const axios = require('axios'); 

const instance = axios.create({
    baseURL: 'http://localhost:3000/api/'
});

instance.interceptors.request.use(function (config) {
    const token = store.getState().session.token;
    instance.defaults.headers.common = {'Authorization': `bearer ${user.token}`}

    return config;
}