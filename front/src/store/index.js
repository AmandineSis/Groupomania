import { createStore, createLogger } from 'vuex'
import instance from './axios'
import toggle from './modules/toggle'
import auth from './modules/auth'
import posts from './modules/posts'
import comments from './modules/comments'

//Initialisation du local storage
let user = localStorage.getItem('user');
user = JSON.parse(user);

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  //Enabling the Vuex built-in logger plugin
  strict: debug,
  plugins: debug ? [createLogger()] : [],
  
  modules: {
    toggle,
    auth,
    posts,
    comments
  },
  state: {
    status: '',
    user: user,
    userLoggedIn: [],
    userInfos: [],
    searchResults: []
  },
  getters: {
    fullNameUserLoggedIn(state){
      return `${state.userLoggedIn.firstName} ${state.userLoggedIn.lastName}`
    },
    fullNameUser(state){
      return `${state.userInfos.firstName} ${state.userInfos.lastName}`
    },
  },
  mutations: {
    SET_STATUS(state, status){
      state.status = status;
    },
    LOG_USER(state, user){
      instance.defaults.headers.common['Authorization'] = 'Bearer: ' + user.token
      localStorage.setItem('user', JSON.stringify(user));
      state.user = user;
    },
    LOG_OUT(state) {
      delete instance.defaults.headers.common["Authorization"];
      state.user = {
        userId: -1,
        token: '',
      }
      localStorage.removeItem('user');
    },
    USER_LOGGED_IN(state, userLoggedIn){
      state.userLoggedIn = userLoggedIn;
    },
    USER_INFOS(state, userInfos){
      state.userInfos = userInfos;
    },
    SEARCH_RESULT(state, searchResults){
      state.searchResults = searchResults;
    },
    CLEAR_SEARCH(state){
      state.searchResults = [];
    }
  },
  actions: {

    getUserLoggedIn: ({ commit, state }) => {
      const userId = state.user.userId;
      instance
        .get(`/user/${userId}`)
        .then( function (response) {
          commit('USER_LOGGED_IN', response.data.results[0]);
        })
        .catch(function () {
        });
    },
    getUser: ({ commit }, userId) => {
      instance
        .get(`/user/${userId}`)
        .then( function (response) {
          commit('USER_INFOS', response.data.results[0]);
        })
        .catch(function () {
        });
    },
    updateUser: ({commit}, userUpdate) => {
      commit('SET_STATUS', 'loading');
      return new Promise ((resolve, reject) => {
        instance
          .put(`/user/${userUpdate.userId}`, {
            firstName: userUpdate.firstName,
            lastName: userUpdate.lastName,
            email: userUpdate.email
          })
          .then(function (response) {
            commit('SET_STATUS', 'updated')
            resolve(response)
          })
          .catch(function (error) {
            commit('SET_STATUS', 'error_update')
            reject(error)
          });
        });
    },
    updatePassword: ({commit}, password)=> {
      console.log('testupdate')
      commit('SET_STATUS', 'loading');
      return new Promise ((resolve, reject) => {
        instance
          .put(`/user/${password.userId}/password`, {
            oldPswd: password.oldPassword,
            newPswd: password.newPassword
          })
          .then(function (response) {
            commit('SET_STATUS', 'updated')
            resolve(response)
            console.log(response)
          })
          .catch(function (error) {
            commit('SET_STATUS', 'error_update')
            reject(error.response.message)
            console.log(error.message)
          });
        });
    },
    updateUserPicture: ({commit}, newPicture)=> {
      commit('SET_STATUS', 'loading');
      return new Promise ((resolve, reject) => {
        instance
          .put(`/user/${newPicture.userId}/profilePic`, 
            newPicture.fdProfile
          )
          .then(function (response) {
            commit('SET_STATUS', 'updated')
            resolve(response)
          })
          .catch(function (error) {
            commit('SET_STATUS', 'error_update')
            reject(error)
          });
        });
    },
    deleteUser: ({commit}, loginDetails)=>{
      commit('SET_STATUS', 'loading');
      return new Promise ((resolve, reject) => {
        instance
          .delete(`/user/${loginDetails.userId}`, {data: {
              password: loginDetails.password}
            }
          )
          .then(function (response) {
            commit('SET_STATUS', 'deleted')
            resolve(response)
          })
          .catch(function (error) {
            commit('SET_STATUS', 'error_delete')
            reject(error)
          });
        });
    },
    moderatorDelete: ({commit}, loginDetails)=>{
      commit('SET_STATUS', 'loading');
      return new Promise ((resolve, reject) => {
        instance
          .delete(`/user/${loginDetails.userId}/${loginDetails.moderatorId}`, {data: {
              password: loginDetails.password}
            }
          )
          .then(function (response) {
            commit('SET_STATUS', 'deleted')
            resolve(response)
          })
          .catch(function (error) {
            commit('SET_STATUS', 'error_delete')
            reject(error)
          });
        });
    },
    searchUser: ({commit}, searchName) => {
      console.log(typeof searchName);
      instance
          .post(`/user`, searchName)
          .then( function (response) {
            commit('SEARCH_RESULT', response.data.results);
          })
          .catch(function () {
        });
    },    
  }
})
