/***************************************************************************/
/*         Mixin pour chargement des publications                          */
/***************************************************************************/

import { mapState, mapGetters, mapActions } from 'vuex';

export const homePostsMixin = {
    computed: {
        ...mapState('posts',{
            posts: 'postsByDate',
            popularPosts: 'postsByLike',
            reportedPosts: 'reportedPosts',
        }),
        ...mapGetters('posts',{
            postLength: 'postsByDateLength',
            popularPostsLength: 'postsByLikeLength',
            reportedPostsLength: 'reportedPostsLength' 
        })
    },
    methods: {
        ...mapActions('posts',['getPostsByDate','getPopularPosts','getReportedPosts']),
        getAllRecentPosts(){
            this.getPostsByDate()
                .then(() => {
                    console.log("getPostsByDate dispatch done !")
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        getAllPopularPosts(){
            this.getPopularPosts()
                .then(() => {
                        console.log("getPopularPosts dispatch done !")
                    })
                    .catch((err) => {
                        console.log(err);
                    })
        },
        getAllReportedPosts(){
            this.getReportedPosts()
                .then(() => {
                    console.log("getReportedPosts dispatch done !")
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }
}