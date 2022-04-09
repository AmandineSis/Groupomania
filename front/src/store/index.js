import { createStore } from 'vuex'

const axios = require('axios');
const instance = axios.create({
  baseURL: 'http://localhost:3000/api/'
});

export default createStore({
  state: {
    status: '',
    user: {
      userId: -1,
      token: ''
    }
  },
  getters: {
  },
  mutations: {
    setStatus(state, status){
      state.status = status;
    },
    logUser(state, user){
      state.user = user
    }
  },
  actions: {
    login: ({ commit }, userInfos ) => {
      commit;
      return new Promise ((resolve, reject) => {
        instance.post('/user/login', userInfos)
        .then(function (response) {
          commit('setStatus', '')
          commit('logUser', response.data )
          resolve(response)
        })
        .catch(function (error) {
          commit('setStatus', 'error_login')
          reject(error)
        });
      })
    },
    createAccount: ({ commit }, userInfos ) => {
      commit('setStatus', 'loading');
      return new Promise ((resolve, reject) => {
        instance
          .post('/user/signup', userInfos)
          .then(function (response) {
            commit('setStatus', 'created')
            resolve(response)
          })
          .catch(function (error) {
            commit('setStatus', 'error_create')
            reject(error)
          });
        });
      }      
  },
  modules: {
  }
})
