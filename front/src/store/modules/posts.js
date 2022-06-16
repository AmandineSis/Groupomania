import instance from '../axios'

/**
 * Modifie la quantité de commentaires d'une publication
 * @param {array of object} arr tableau contenant toutes les publications
 * @param {object} payload objet contenant l'Id du post à modifier
 */
function increaseCommentNumber(arr, payload){
    let postId = payload.postId;
    const index = arr.map(object => object.postId).indexOf(postId);
    arr[index].comments += 1
}

/**
 * Modifie la quantité de commentaires d'une publication
 * @param {array of object} arr tableau contenant toutes les publications
 * @param {object} payload objet contenant l'Id du post à modifier
 */
function decreaseCommentNumber(arr, payload){
    let postId = payload.postId;
    const index = arr.map(object => object.postId).indexOf(postId);
    arr[index].comments -= 1
}

/**
 * Modifie la quantité de commentaires d'une publication
 * @param {array of object} arr tableau contenant toutes les publications
 * @param {object} payload objet contenant l'Id du post à modifier
 */
function updatePostItem(arr, payload){
    let postId = payload.postId;
    const index = arr.map(object => object.postId).indexOf(postId);
    arr[index].content = payload.postContent;
    arr[index].imageUrl = payload.postImage; 
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
        //Page d'accueil
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
        //Page profil
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
        INCREASE_COMMENT_NUMBER(state, payload){
            let mode = payload.mode;
            if(mode == 'recentPosts'){
                let arr = state.postsByDate;
                return increaseCommentNumber(arr, payload)
            } else if (mode == 'popularPosts'){
                let arr = state.postsByLike;
                return increaseCommentNumber(arr, payload)
            }else if ( mode == 'reportedPosts'){
                let arr = state.reportedPosts;
                return increaseCommentNumber(arr, payload)
            } else if (mode == 'recentUserPosts'){
                let arr = state.postsByUserId;
                return increaseCommentNumber(arr, payload)
            } else {
                let arr = state.postsByUserIdByLike;
                return increaseCommentNumber(arr, payload)
            }
        },
        DECREASE_COMMENT_NUMBER(state, payload){
            let mode = payload.mode;
            if(mode == 'recentPosts'){
                let arr = state.postsByDate;
                return decreaseCommentNumber(arr, payload)
            } else if (mode == 'popularPosts'){
                let arr = state.postsByLike;
                return decreaseCommentNumber(arr, payload)
            }else if ( mode == 'reportedPosts'){
                let arr = state.reportedPosts;
                return decreaseCommentNumber(arr, payload)
            } else if (mode == 'recentUserPosts'){
                let arr = state.postsByUserId;
                return decreaseCommentNumber(arr, payload)
            } else {
                let arr = state.postsByUserIdByLike;
                return decreaseCommentNumber(arr, payload)
            }
        },
        UPDATE_LIKE_NUMBER(state, payload){
            let mode = payload.mode;
            let like = payload.like;
            let postId = payload.postId;
            const index1 = state.postsByDate.map(object => object.postId).indexOf(postId);
            const index2 =  state.postsByLike.map(object => object.postId).indexOf(postId);
            
            if(like == 1){
                state.postsByDate[index1].likes += 1
                state.postsByLike[index2].likes += 1
                if (mode == 'reportedPosts') {
                    const index3 = state.reportedPosts.map(object => object.postId).indexOf(postId);
                    state.reportedPosts[index3].likes += 1
                }
            } else {
                state.postsByDate[index1].likes -= 1
                state.postsByLike[index2].likes -= 1
                if (mode == 'reportedPosts') {
                    const index3 = state.reportedPosts.map(object => object.postId).indexOf(postId);
                    state.reportedPosts[index3].likes -= 1
                }
            }
        },
        POSTS_BY_USERID_BY_LIKE(state, postsByUserIdByLike){
            state.postsByUserIdByLike = postsByUserIdByLike;
        },
        UPDATE_POST(state, payload){
            let mode = payload.mode;
            if(mode == 'recentPosts'){
                let arr = state.postsByDate;
                return updatePostItem(arr, payload)
            } else if (mode == 'popularPosts'){
                let arr = state.postsByLike;
                return updatePostItem(arr, payload)
            }else if ( mode == 'reportedPosts'){
                let arr = state.reportedPosts;
                return updatePostItem(arr, payload)
            } else if (mode == 'recentUserPosts'){
                let arr = state.postsByUserId;
                return updatePostItem(arr, payload)
            } else {
                let arr = state.postsByUserIdByLike;
                return updatePostItem(arr, payload)
            }
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
            let mode = postToUpdate.mode;
            console.log(mode)
            return new Promise ((resolve, reject) => {
            instance
                .put(`/posts/${postToUpdate.postId}`, postToUpdate.postUpdate) //envoi de FORMDATA
                .then(function (response) {
                    console.log(response.data.results.content)
                    commit('UPDATE_POST', {
                            postId: postToUpdate.postId, 
                            postContent: response.data.results.content,
                            postImage: response.data.results.imageUrl,
                            mode: mode
                        });
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
            let mode = postLike.mode;
            let request = {userId: userId, like: like}
            return new Promise ((resolve, reject) => {
            instance
                .post(`/posts/${postLike.postId}/like`, request)
                .then(function (response) {
                    console.log(response)
                    commit('SET_STATUS', 'post_liked', { root: true })
                    commit('UPDATE_LIKE_NUMBER', {
                            postId:postLike.postId, 
                            like:response.data.like, 
                            mode:mode
                        });
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
            let userId = rootState.user.userId;
            let report = postReport.report;
            return new Promise ((resolve, reject) => {
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
        removeReport: ({ commit}, postId) => {
                instance
                    .delete(`/posts/${postId}/removeReport`)
                    .then(function () {
                        commit('SET_STATUS', 'post_reported', { root: true })
                    })
                    .catch(function () {
                        commit('SET_STATUS', 'error_report', { root: true })
                    });
        },
    }
}