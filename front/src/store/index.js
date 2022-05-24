import { createStore, createLogger } from 'vuex'
import auth from './modules/auth'
import posts from './modules/posts'

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
        moderator: '',
      };
  }
}

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  strict: debug,
  plugins: debug ? [createLogger()] : [],
  modules: {
    auth,
    posts
  },

  state: {
    status: '',
    user: user,
    userLoggedIn: [],
    userInfos: [],

   

    postComments: [],
    commentsByPostId: [],

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
      instance.defaults.headers.common = {'Authorization': `bearer ${user.token}`}
      localStorage.setItem('user', JSON.stringify(user));
      state.user = user;
    },
    
    logout(state) {
      state.user = {
        userId: -1,
        token: '',
      }
      localStorage.removeItem('user');
    },
    userLoggedIn(state, userLoggedIn){
      state.userLoggedIn = userLoggedIn;
    },
    userInfos(state, userInfos){
      state.userInfos = userInfos;
    },
    searchResult(state, searchResults){
      state.searchResults = searchResults;
    },
    clearSearch(state){
      state.searchResults = [];
    },
    
    //COMMENT/////////////////////////////////////////
    postComments(state, postComments){
      //state.postComments.push(postComments);
      state.postComments = postComments;
    },
    commentsByPostId(state, postId){
      let index = state.postComments.findIndex(postComments => postComments.postId == postId);
      //let selectedComment = state.postComments.splice(index, 1);
      console.log(index);
    },
    deleteComments(state, comId ){
      let index = state.postComments.findIndex(postComments => postComments.comId == comId);
      state.postComments.splice(index, 1);
    },
    updateComments(state, comId, commentContent, commentImage ){
      let index = state.postComments.findIndex(postComments => postComments.comId == comId);
      state.postComments.splice(index, 1, commentContent);
      state.postsByDate.splice(index, 1, commentImage);
    }
  },

  actions: {
    /**************************** USER ********************** */
  
    getUserLoggedIn: ({ commit, state }) => {
      const userId = state.user.userId;
      instance
        .get(`/user/${userId}`)
        .then( function (response) {
          commit('userLoggedIn', response.data.results[0]);
        })
        .catch(function () {
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
    updateUser: ({commit}, userUpdate) => {
      commit('SET_STATUS', 'loading');
      return new Promise ((resolve, reject) => {
        instance
          .put(`/user/${userUpdate.userId}`, {
            firstName: userUpdate.firstName,
            lastName: userUpdate.lastName,
            email: userUpdate.email
          }
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
    updatePassword: ({commit}, password)=> {
      commit('SET_STATUS', 'loading');
      return new Promise ((resolve, reject) => {
        instance
          .put(`/user/${password.userId}/password`, {
            oldPswd: password.oldPassword,
            newPswd: password.newPassword
          }
          )
          .then(function (response) {
            commit('SET_STATUS', 'updated')
            resolve(response)
            console.log(response)
          })
          .catch(function (error) {
            commit('SET_STATUS', 'error_update')
            reject(error.response.message)
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
      console.log(loginDetails.password);
      commit('SET_STATUS', 'loading');
      return new Promise ((resolve, reject) => {
        instance
          .delete(`/user/${loginDetails.userId}`, 
          { data: { password: loginDetails.password}}
        
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
            commit('searchResult', response.data.results);
          })
          .catch(function () {
        });
    },
    /**************************** POSTS ********************** */  
    
    
  /*  getReportedPostsByUserId: ({ commit }, userId) => {
      instance
        .get(`/posts/${userId}/reported`)
        .then( function (response) {
          commit('REPORTED_POSTS_BY_USERID', response.data.results);
        })
        .catch(function () {
      });
    },*/
   
    /*************************LIKE******************************/
    likePost: ({ commit, state }, postLike) => {
      return new Promise ((resolve, reject) => {
        let userId = state.user.userId;
        let like = postLike.like;
        console.log(like);
        instance
          .post(`/posts/${postLike.postId}/like`, {userId, like})
          .then(function (response) {
            commit('SET_STATUS', 'post_liked')
            resolve(response)
          })
          .catch(function (error) {
            commit('SET_STATUS', 'error_like')
            reject(error)
          });
        });
    },

    /***********************COMMENTS****************************/
    //gestion de l'envoi du nouveau commentaire au backend
    createComment: ({ commit }, newComment ) => {
      commit('SET_STATUS', 'sending');
      console.log(newComment.fdComment);
      return new Promise ((resolve, reject) => {
        instance
          .post(`/posts/${newComment.postId}/comment`, newComment.fdComment) //envoi de FORMDATA
          .then(function (response) {
            commit('SET_STATUS', 'post_added')
            resolve(response) //retourne "commentaire ajouté"
          })
          .catch(function (error) { //sinon retourne erreur
            commit('SET_STATUS', 'error_newPost')
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
         // commit('commentsByPostId', postId);          
        })
        .catch(function () {
      });
    },
    updateComment: ({ commit }, commentToUpdate)=>{
      return new Promise ((resolve, reject) => {
      instance
        .put(`/posts/${commentToUpdate.postId}/${commentToUpdate.comId}`, commentToUpdate.fdUpdatedCom) //envoi de FORMDATA
        .then(function (response) {
          commit('updateComments', commentToUpdate.comId, commentToUpdate.fdUpdatedCom.commentContent, commentToUpdate.fdUpdatedCom.image);
          resolve(response) //retourne "commentaire modifié"
        })
        .catch(function (error) {
          commit('SET_STATUS', 'error_updateComment')
          reject(error)
        });
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

    },
  
    
  }

})
