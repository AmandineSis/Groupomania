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
        moderator: '',
      };
  }
}

export default createStore({

  state: {
    status: '',
    user: user,
    userLoggedIn: [],
    userInfos: [],

    postsByDate: [],
    postsByLike: [],
    reportedPosts: [],

    getPostsByUserId: [],
    postsByUserIdByLike: [],

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


    postsByDateLength(state){
      if(state.postsByDate){
        return state.postsByDate.length
      }else{
      return 0
      }
    },
    postsByLikeLength(state){
      if(state.postsByLike){
        return state.postsByLike.length
      }else{
      return 0
      }
    },
    reportedPostsLength(state){
      if(state.reportedPosts){
        return state.reportedPosts.length
      }else{
      return 0
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
    postsByDate(state, postsByDate){
      state.postsByDate = postsByDate;
    },
    postsByLike(state, postsByLike){
      state.postsByLike = postsByLike;
    },
    reportedPosts(state, reportedPosts){
      state.reportedPosts = reportedPosts;
    },
    postsByUserId(state, postsByUserId){
      state.postsByUserId = postsByUserId;
    },
    postsByUserIdByLike(state, postsByUserIdByLike){
      state.postsByUserIdByLike = postsByUserIdByLike;
    },
    reportedPostsByUserId(state, reportedPostsByUserId){
      state.reportedPostsByUserId = reportedPostsByUserId;
    },
    updatePost(state, postId, postContent, postImage){
      let index = state.postsByDate.findIndex(postsByDate => postsByDate.postId == postId);
      state.postsByDate.splice(index, 1, postContent);
      state.postsByDate.splice(index, 1, postImage);
    },
    deletePost(state, postId ){
      let index = state.postsByDate.findIndex(postsByDate => postsByDate.postId == postId);
      state.postsByDate.splice(index, 1);
    },
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
      commit('setStatus', 'loading');
      return new Promise ((resolve, reject) => {
        instance
          .put(`/user/${userUpdate.userId}`, {
            firstName: userUpdate.firstName,
            lastName: userUpdate.lastName,
            email: userUpdate.email
          }
          )
          .then(function (response) {
            commit('setStatus', 'updated')
            resolve(response)
          })
          .catch(function (error) {
            commit('setStatus', 'error_update')
            reject(error)
          });
        });
    },
    updatePassword: ({commit}, password)=> {
      commit('setStatus', 'loading');
      return new Promise ((resolve, reject) => {
        instance
          .put(`/user/${password.userId}/password`, {
            oldPswd: password.oldPassword,
            newPswd: password.newPassword
          }
          )
          .then(function (response) {
            commit('setStatus', 'updated')
            resolve(response)
            console.log(response)
          })
          .catch(function (error) {
            commit('setStatus', 'error_update')
            reject(error.response.message)
          });
        });
    },
    updateUserPicture: ({commit}, newPicture)=> {
      commit('setStatus', 'loading');
      return new Promise ((resolve, reject) => {
        instance
          .put(`/user/${newPicture.userId}/profilePic`, 
            newPicture.fdProfile
          
          )
          .then(function (response) {
            commit('setStatus', 'updated')
            resolve(response)
          })
          .catch(function (error) {
            commit('setStatus', 'error_update')
            reject(error)
          });
        });
    },
    deleteUser: ({commit}, loginDetails)=>{
      console.log(loginDetails.password);
      commit('setStatus', 'loading');
      return new Promise ((resolve, reject) => {
        instance
          .delete(`/user/${loginDetails.userId}`, 
          { data: { password: loginDetails.password}}
        
          )
          .then(function (response) {
            commit('setStatus', 'deleted')
            resolve(response)
          })
          .catch(function (error) {
            commit('setStatus', 'error_delete')
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
            commit('postsByDate', response.data.results);
          })
          .catch(function () {
        });
    },
    getPopularPosts: ({ commit }) => {
      instance
        .get(`/posts/famous`)
        .then( function (response) {
          commit('postsByLike', response.data.results);
        })
        .catch(function () {
      });
    },
    getReportedPosts: ({ commit }) => {
      instance
        .get(`/posts/reported`)
        .then( function (response) {
          commit('reportedPosts', response.data.results);
        })
        .catch(function () {
      });
    },
  /*  getReportedPostsByUserId: ({ commit }, userId) => {
      instance
        .get(`/posts/${userId}/reported`)
        .then( function (response) {
          commit('reportedPostsByUserId', response.data.results);
        })
        .catch(function () {
      });
    },*/
    getPostsByUserId: ({ commit }, userId) => {
      instance
        .get(`/posts/${userId}`)
        .then( function (response) {
          commit('postsByUserId', response.data.results);
        })
        .catch(function () {
      });
    },
    getPopularPostsByUserId: ({ commit }, userId) => {
      instance
        .get(`/posts/${userId}/famous`)
        .then( function (response) {
          commit('postsByUserIdByLike', response.data.results);
        })
        .catch(function () {
      });
    },
    updatePost: ({ commit }, postToUpdate)=>{
      return new Promise ((resolve, reject) => {
      instance
        .put(`/posts/${postToUpdate.postId}`, postToUpdate.fdUpdatedPost) //envoi de FORMDATA
        .then(function (response) {
          commit('updatePost', postToUpdate.postId, postToUpdate.fdUpdatedPost.content, postToUpdate.fdUpdatedPost.image);
          resolve(response) //retourne "commentaire modifié"
        })
        .catch(function (error) {
          commit('setStatus', 'error_updateComment')
          reject(error)
        });
      });
    },
    deletePost: ({ commit }, postId)=>{
      instance
        .delete(`/posts/${postId}`)
        .then(function (response) {
          commit('deletePost', postId);
          console.log(response)
        })
        .catch(function () {
        });

    },
    reportPost: ({ commit, state }, postReport) => {
      return new Promise ((resolve, reject) => {
        let userId = state.user.userId;
        let report = postReport.report;
        console.log(report);
        instance
          .post(`/posts/${postReport.postId}/report`, {userId, report})
          .then(function (response) {
            commit('setStatus', 'post_reported')
            resolve(response)
          })
          .catch(function (error) {
            commit('setStatus', 'error_report')
            reject(error)
          });
        });
    },
    removeReport: ({ commit, state }, removeReport) => {
      return new Promise ((resolve, reject) => {
        let userId = state.user.userId;
        let report = removeReport.report;
        console.log(report);
        instance
          .post(`/posts/${removeReport.postId}/removeReport`, {userId, report})
          .then(function (response) {
            commit('setStatus', 'post_reported')
            resolve(response)
          })
          .catch(function (error) {
            commit('setStatus', 'error_report')
            reject(error)
          });
        });
    },
    /*************************LIKE******************************/
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

    /***********************COMMENTS****************************/
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
          commit('setStatus', 'error_updateComment')
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
  
    
  },
  modules: {
  },

})
