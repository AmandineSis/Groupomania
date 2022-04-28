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
    postComments: []
  },
  getters: {
    fullName(state){
      return `${state.userInfos.firstName} ${state.userInfos.lastName}`
    },
    getPostById: (state) => (postId) => {
      if (state.posts.postId == postId){
        let userId = state.posts.userId;
        return userId;
      
      }
    }
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
    },
    postComments(state, postComments){
      state.postComments = postComments;
    },
    deleteComments(state, comId ){
     
      let index = state.postComments.findIndex(postComments => postComments.comId == comId);
      state.postComments.splice(index, 1);

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
    getUser: ({ commit }, userId) => {
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
    getPostsByDate: ({ commit }) => {
        instance
          .get(`/posts`)
          .then( function (response) {
            commit('posts', response.data.results);
          })
          .catch(function () {
        });
    },
    /*******************likepost function ok**************/
    likePost: ({ commit, state }, postLike) => {
      return new Promise ((resolve, reject) => {
        let userId = state.user.userId;
        let like = postLike.like;
        console.log(like);
        instance
          .post(`/posts/${postLike.postId}/like`, {userId, like})
          .then(function (response) {
            commit('setStatus', 'post_liked')
            resolve(response)
          })
          .catch(function (error) {
            commit('setStatus', 'error_like')
            reject(error)
          });
        });
    },


    //gestion de l'envoi du nouveau commentaire au backend
    createComment: ({ commit }, newComment ) => {
      commit('setStatus', 'sending');
      console.log(newComment.fdComment);
      return new Promise ((resolve, reject) => {
        instance
          .post(`/posts/${newComment.postId}/comment`, newComment.fdComment) //envoi de FORMDATA
          .then(function (response) {
            commit('setStatus', 'post_added')
            resolve(response) //retourne "commentaire ajouté"
          })
          .catch(function (error) { //sinon retourne erreur
            commit('setStatus', 'error_newPost')
            reject(error)
          });
        });
    },
    getCommentsByPostId: ({ commit }, postId) => {
      instance
        .get(`/posts/${postId}/comment`)
        .then( function (response) {
          console.log(response.data.results)
          commit('postComments', response.data.results);
        })
        .catch(function () {
      });
    },
    deleteComment: ({ commit }, commentToDelete)=>{

      instance
        .delete(`/posts/${commentToDelete.postId}/${commentToDelete.comId}`)
        .then(function (response) {
          commit('deleteComments', commentToDelete.comId);
          console.log(response)
        })
        .catch(function () {
        });

    }
  },
  modules: {
  }

})
