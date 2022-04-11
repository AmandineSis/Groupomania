import { createStore } from 'vuex'

const axios = require('axios');
const instance = axios.create({
  baseURL: 'http://localhost:3000/api/'
});

//Initialisation du local storage
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
      };
  }
}

export default createStore({

  state: {
    status: '',
    user: user,
    userInfos: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      profilePicUrl: "",
      moderator: 0
    }
  },
  getters: {
  },
  mutations: {
    setStatus(state, status){
      state.status = status;
    },
    logUser(state, user){
      instance.defaults.headers.common = {'Authorization': `bearer ${user.token}`}
      localStorage.setItem('user', JSON.stringify(user));
      state.user = user;
    },
    userInfos(state, userInfos){
      state.userInfos = userInfos;
    },
    logout(state) {
      state.user = {
        userId: -1,
        token: '',
      }
      localStorage.removeItem('user');
    }
  },


  actions: {
    login: ({ commit }, loginInfos ) => {
      commit('setStatus', 'loading');
      return new Promise ((resolve, reject) => {
        instance
          .post('/user/login', loginInfos)
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
    },
    getUser: ({commit}) => {
      instance
        .get(`/user/${user.userId}`)
        .then( function (response) {
          commit('userInfos', response.data.results[0]);
          
          
        })
        .catch(function () {
          
        });
      }
  },
  modules: {
  }
})
