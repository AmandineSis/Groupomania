import instance from '../axios'

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
                    console.log(response)
                })
                .catch(function (error) {
                    commit('SET_STATUS', 'error_create',{ root: true })
                    if(error.response){
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                        reject(error.response.data.message)
                    }
                });
            });
        },
    }
}