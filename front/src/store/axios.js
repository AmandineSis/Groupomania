import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:3000/api/',
    timeout: 20000
})
let user = localStorage.getItem('user');
user = JSON.parse(user);
if (user) {
    instance.defaults.headers.common['Authorization'] = 'Bearer: ' + user.token
} else {
    instance.defaults.headers.common['Authorization'] = ''
}

export default instance