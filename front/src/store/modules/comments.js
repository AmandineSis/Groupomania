
const axios = require('axios'); 

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

export default {
    namespaced: true, 
    state:{
        postComments: [],
        commentsByPostId: [],
    },
    getters:{
        /*postsByDateLength(state){
            if(state.postsByDate){
                return state.postsByDate.length
            }else{
            return 0
            }
        },*/
    },
    mutations:{
        POST_COMMENTS(state, postComments){
            //state.postComments.push(postComments);
            state.postComments = postComments;
        },
        COMMENTS_BY_POST_ID(state, postId){
            let index = state.postComments.findIndex(postComments => postComments.postId == postId);
            //let selectedComment = state.postComments.splice(index, 1);
            console.log(index);
        },
        DELETE_COMMENTS(state, comId ){
            let index = state.postComments.findIndex(postComments => postComments.comId == comId);
            state.postComments.splice(index, 1);
        },
        UPDATE_COMMENTS(state, comId, commentContent, commentImage ){
            let index = state.postComments.findIndex(postComments => postComments.comId == comId);
            state.postComments.splice(index, 1, commentContent);
            state.postsByDate.splice(index, 1, commentImage);
        }
    },
    actions:{ 
        createComment: ({ commit }, newComment ) => {
            commit('SET_STATUS', 'sending');
            console.log(newComment.fdComment);
            return new Promise ((resolve, reject) => {
                instance
                    .post(`/posts/${newComment.postId}/comment`, newComment.fdComment) //envoi de FORMDATA
                    .then(function (response) {
                        commit('SET_STATUS', 'post_added')
                        resolve(response) 
                    })
                    .catch(function (error) {
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
                    commit('POST_COMMENTS', response.data.results);          
                 // commit('COMMENTS_BY_POST_ID', postId);          
                })
                .catch(function () {
                    commit('SET_STATUS', 'error_newPost')
            });
        },
        updateComment: ({ commit }, commentToUpdate)=>{
            return new Promise ((resolve, reject) => {
            instance
                .put(`/posts/${commentToUpdate.postId}/${commentToUpdate.comId}`, commentToUpdate.fdUpdatedCom) //envoi de FORMDATA
                .then(function (response) {
                    commit('UPDATE_COMMENTS', commentToUpdate.comId, commentToUpdate.fdUpdatedCom.commentContent, commentToUpdate.fdUpdatedCom.image);
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
                    commit('DELETE_COMMENTS', commentToDelete.comId);
                    console.log(response)
                })
                .catch(function () {
                    commit('SET_STATUS', 'error_updateComment', { root: true })
                });
        },
    }
}