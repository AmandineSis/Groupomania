import instance from '../axios'

/*const axios = require('axios'); 

const instance = axios.create({
    baseURL: 'http://localhost:3000/api/'
});

//Initialisation du local storage
//Ajout du token d'authorisation à l'en-tête des requêtes API
let user = localStorage.getItem('user');

if (!user) {
    user = {
        userId: -1,
        token: '',
    }; 
} else {
    try {
        user = JSON.parse(user);
        instance.defaults.headers.common = {'Authorization': `bearer ${user.token}`}
    } catch (ex) {
        user = {
            userId: -1,
            token: '',
            moderator: '',
        };
    }
}
*/
export default {
    namespaced: true, 
    state:{
    },
    getters:{
    },
    mutation:{
    },
    actions:{
        login: ({ commit }, loginInfos ) => {
            commit('SET_STATUS', 'loading', { root: true });
            return new Promise ((resolve, reject) => {
            instance
                .post('/user/login', loginInfos)
                .then((res) => {
                    commit('SET_STATUS', '', { root: true });
                    commit('LOG_USER', res.data,{ root: true } )
                    resolve(res)
                })
                .catch((err) => {
                    commit('SET_STATUS', 'error_login', { root: true });
                    reject(err)
                });
            })
        },
        createAccount: ({ commit }, userInfos ) => {
            commit('SET_STATUS', 'loading',{ root: true });
            return new Promise ((resolve, reject) => {
            instance
                .post('/user/signup', userInfos)
                .then(function (response) {
                    commit('SET_STATUS', 'created',{ root: true })
                    resolve(response)
                })
                .catch(function (error) {
                    commit('SET_STATUS', 'error_create',{ root: true })
                    reject(error)
                });
            });
        },
    }
}