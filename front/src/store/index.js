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
    userInfos: [],
    currentPost: "",
    posts: [],
//like and comment counter test
    like:0,
    comment:0
  },
  getters: {
    fullName(state){
      return `${state.userInfos.firstName} ${state.userInfos.lastName}`
    },
   /* getPostById: (state) => (postId) => {
      return state.posts.find(post => post.postId === postId)
    }*/

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
    posts(state, posts){
        state.posts = posts;
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

    /**************************** USER ********************** */
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
    getUser: ({commit}, userId) => {
      instance
        .get(`/user/${userId}`)
        .then( function (response) {
          commit('userInfos', response.data.results[0]);
        })
        .catch(function () {
        });
      },
      
    /**************************** POSTS ********************** */  
    
    createPost: ({ commit }, newPost ) => {
      commit('setStatus', 'sending');
      return new Promise ((resolve, reject) => {
        instance
          .post('/posts', newPost)
          .then(function (response) {
            commit('setStatus', 'post_added')
            resolve(response)
          })
          .catch(function (error) {
            commit('setStatus', 'error_newPost')
            reject(error)
          });
        });
    },

    getPostsByDate: ({commit}) => {
        instance
          .get(`/posts`)
          .then( function (response) {
            commit('posts', response.data.results);
          })
          .catch(function () {
          });
        }
/*
  incrementLike({commit}, index) {
    let postId = this.getters.getPostById(index)
    return new Promise ((resolve, reject) => {
      instance
        .post(`/posts/${postId}/like`, newPost)
        .then(function (response) {
          commit('setStatus', 'post_added')
          resolve(response)
        })
        .catch(function (error) {
          commit('setStatus', 'error_newPost')
          reject(error)
        });
      });*/
  },
  modules: {
  }
})
