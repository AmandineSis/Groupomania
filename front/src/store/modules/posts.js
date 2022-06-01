
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
        postsByDate: [],
        postsByLike: [],
        reportedPosts: [],

        postsByUserId: [],
        postsByUserIdByLike: [],
    },
    getters:{
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
        },
        postsByUserIdByDateLength(state){
            if(state.postsByUserId){
                return state.postsByUserId.length
            }else{
            return 0
            }
        },
        postsByUserIdByLikeLength(state){
            if(state.postsByUserIdByLike){
                return state.postsByUserIdByLike.length
            }else{
            return 0
            }
        },
    },
    mutations:{
        POSTS_BY_DATE(state, postsByDate){
            state.postsByDate = postsByDate;
        },
        POSTS_BY_LIKE(state, postsByLike){
            state.postsByLike = postsByLike;
        },
        REPORTED_POSTS(state, reportedPosts){
            state.reportedPosts = reportedPosts;
        },
        POSTS_BY_USER_ID(state, postsByUserId){
            state.postsByUserId = postsByUserId;
        },
        POSTS_BY_USERID_BY_LIKE(state, postsByUserIdByLike){
            state.postsByUserIdByLike = postsByUserIdByLike;
        },
        UPDATE_POST(state, postsByDate, postId, postContent, postImage){
            let index = state.postsByDate.findIndex(postsByDate => postsByDate.postId == postId);
            state.postsByDate.splice(index, 1, postContent);
            state.postsByDate.splice(index, 1, postImage);
        },
        DELETE_POST(state, postId ){
            let index = state.postsByDate.findIndex(postsByDate => postsByDate.postId == postId);
            state.postsByDate.splice(index, 1);
        },
    },
    actions:{ 
        createPost: ({ commit }, newPost ) => {
            commit('SET_STATUS', 'sending', { root: true });
            return new Promise ((resolve, reject) => {
            instance
                .post('/posts', newPost)
                .then(function (response) {
                    commit('SET_STATUS', 'post_added', { root: true })
                    resolve(response)
                })
                .catch(function (error) {
                    commit('SET_STATUS', 'error_newPost', { root: true })
                    reject(error)
                });
            });
        },
        getPostsByDate: ({ commit }) => {
            commit('SET_STATUS', 'loading', { root: true })
            instance
                .get(`/posts`)
                .then( function (response) {
                    console.log(response.data.results)
                    commit('POSTS_BY_DATE', response.data.results);
                    commit('SET_STATUS', 'posts_by_date_loaded', { root: true })
                })
                .catch(function () {
                    commit('SET_STATUS', 'error_posts_by_date', { root: true })
            });
        },
        getPopularPosts: ({ commit }) => {
            commit('SET_STATUS', 'loading', { root: true })
            instance
            .get(`/posts/famous`)
            .then( function (response) {
                commit('POSTS_BY_LIKE', response.data.results);
                commit('SET_STATUS', 'posts_by_date_loaded', { root: true })
            })
            .catch(function () {
                commit('SET_STATUS', 'error_popular_posts', { root: true })
            });
        },
        getReportedPosts: ({ commit }) => {
            commit('SET_STATUS', 'loading', { root: true })
            instance
            .get(`/posts/reported`)
            .then( function (response) {
                commit('REPORTED_POSTS', response.data.results);
                commit('SET_STATUS', 'posts_by_date_loaded', { root: true })
            })
            .catch(function () {
                commit('SET_STATUS', 'error_reported_posts', { root: true })
            });
        },
        getPostsByUserId: ({ commit }, userId) => {
            commit('SET_STATUS', 'loading', { root: true })
            console.log(userId)
            instance
                .get(`/posts/${userId}`)
                .then( function (response) {
                    console.log(response.data)
                commit('POSTS_BY_USER_ID', response.data.results);
                commit('SET_STATUS', 'posts_by_user_loaded', { root: true })
                })
                .catch(function () {
                    commit('SET_STATUS', 'error_posts_by_user', { root: true })
            });
        },
        getPopularPostsByUserId: ({ commit }, userId) => {
            commit('SET_STATUS', 'loading', { root: true })
            instance
                .get(`/posts/${userId}/famous`)
                .then( function (response) {
                    commit('POSTS_BY_USERID_BY_LIKE', response.data.results);
                    commit('SET_STATUS', 'popular_posts_by_user_loaded', { root: true })
                })
                .catch(function () {
                    commit('SET_STATUS', 'error_popular_posts_by_user', { root: true })
            });
        },
        updatePost: ({ commit }, postToUpdate)=>{
            return new Promise ((resolve, reject) => {
            instance
                .put(`/posts/${postToUpdate.postId}`, postToUpdate.fdUpdatedPost) //envoi de FORMDATA
                .then(function (response) {
                    commit('UPDATE_POST', postToUpdate.postId, postToUpdate.fdUpdatedPost.content, postToUpdate.fdUpdatedPost.image);
                    resolve(response) 
                })
                .catch(function (error) {
                    commit('SET_STATUS', 'error_updatePost', { root: true })
                    reject(error)
                });
            });
        },
        likePost: ({ commit, rootState }, postLike) => {
            let userId = rootState.user.userId;
            let like = postLike.like;
            return new Promise ((resolve, reject) => {
            instance
                .post(`/posts/${postLike.postId}/like`, {userId, like})
                .then(function (response) {
                    commit('SET_STATUS', 'post_liked', { root: true })
                    resolve(response)
                })
                .catch(function (error) {
                    commit('SET_STATUS', 'error_like', { root: true })
                    reject(error)
                });
            });
        },
        deletePost: ({ commit }, postId)=>{
            instance
                .delete(`/posts/${postId}`)
                .then(function (response) {
                    commit('DELETE_POST', postId);
                    console.log(response)
                })
                .catch(function () {
                });
    
        },
        reportPost: ({ commit, rootState }, postReport) => {
            return new Promise ((resolve, reject) => {
            let userId = rootState.user.userId;
            let report = postReport.report;
            instance
                .post(`/posts/${postReport.postId}/report`, {userId, report})
                .then(function (response) {
                    commit('SET_STATUS', 'post_reported', { root: true })
                    resolve(response)
                })
                .catch(function (error) {
                    commit('SET_STATUS', 'error_report', { root: true })
                    reject(error)
                });
            });
        },
        removeReport: ({ commit, rootState }, removeReport) => {
            return new Promise ((resolve, reject) => {
                let userId = rootState.user.userId;
                let report = removeReport.report;
                console.log(report);
                instance
                    .post(`/posts/${removeReport.postId}/removeReport`, {userId, report})
                    .then(function (response) {
                        commit('SET_STATUS', 'post_reported', { root: true })
                        resolve(response)
                    })
                    .catch(function (error) {
                        commit('SET_STATUS', 'error_report', { root: true })
                        reject(error)
                    });
                });
        },
    }
}