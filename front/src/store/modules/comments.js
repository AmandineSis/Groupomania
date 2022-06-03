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
        postComments: []
    },
    getters:{
       /* postCommentsLength(state){
            if(state.postComments){
                return state.postComments.length
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
            state.postComments.splice(index, 1, commentImage);
        }
    },
    actions:{ 
        createComment: ({ commit }, newComment ) => {
            commit('SET_STATUS', 'sending', { root: true });
            console.log(newComment.fdComment);
            return new Promise ((resolve, reject) => {
                instance
                    .post(`/posts/${newComment.postId}/comment`, newComment.fdComment) //envoi de FORMDATA
                    .then(function (response) {
                        commit('SET_STATUS', 'comments_added', { root: true })
                        resolve(response) 
                    })
                    .catch(function (error) {
                        commit('SET_STATUS', 'error_comments', { root: true })
                        reject(error)
                    });
            });
        },
        getComments: ({ commit }, postId) => {
            instance
                .get(`/posts/${postId}/comment`)
                .then( function (response) {
                    console.log(response.data.results)
                    commit('POST_COMMENTS', response.data.results);  
                    commit('SET_STATUS', 'comments_loaded', { root: true })        
                 // commit('COMMENTS_BY_POST_ID', postId);          
                })
                .catch(function () {
                    commit('SET_STATUS', 'error_getComments', { root: true })
            });
        },
        updateComment: ({ commit }, commentToUpdate)=>{
            return new Promise ((resolve, reject) => {
            instance
                .put(`/posts/${commentToUpdate.postId}/${commentToUpdate.comId}`, commentToUpdate.fdUpdatedCom) //envoi de FORMDATA
                .then(function (response) {
                    commit('UPDATE_COMMENTS', commentToUpdate.comId, commentToUpdate.fdUpdatedCom.commentContent, commentToUpdate.fdUpdatedCom.image);
                    commit('SET_STATUS', 'comment_updated', { root: true })
                    resolve(response) //retourne "commentaire modifié"
                })
                .catch(function (error) {
                    commit('SET_STATUS', 'error_updateComment', { root: true })
                    reject(error)
                });
            });
        },
        deleteComment: ({ commit }, commentToDelete)=>{
            instance
                .delete(`/posts/${commentToDelete.postId}/${commentToDelete.comId}`)
                .then(function (response) {
                    commit('DELETE_COMMENTS', commentToDelete.comId);
                    commit('SET_STATUS', 'comments_deleted', { root: true })
                    console.log(response)
                })
                .catch(function () {
                    commit('SET_STATUS', 'error_delete_comment', { root: true })
                });
        },
    }
}