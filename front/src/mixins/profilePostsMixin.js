/***************************************************************************/
/*         Mixin object for posts by user loading                          */
/***************************************************************************/

import { mapState, mapGetters, mapActions } from 'vuex';

export const profilePostsMixin = {
    computed: {
        ...mapState('posts',{
            postsByUser: 'postsByUserId',
            popularPostsByUser: 'postsByUserIdByLike'
        }),
        ...mapGetters('posts',{
            postByUserLength: 'postsByUserIdByDateLength',
            popularPostsByUserLength: 'postsByUserIdByLikeLength'
        })
    },
    methods: {
    ...mapActions('posts',['getPostsByUserId','getPopularPostsByUserId']),
    getAllUserPosts(userId){
        this.getPostsByUserId(userId)
            .then(() => {
                console.log("getPostsByUserId dispatch done !")
            })
            .catch((err) => {
                console.log(err);
            })
    },
    getAllUserPopularPosts(userId){
        this.getPopularPostsByUserId(userId)
            .then(() => {
                console.log("getPopularPostsByUserId dispatch done !")
            })
            .catch((err) => {
                console.log(err);
            })
    }
    }
}
