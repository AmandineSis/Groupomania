/***************************************************************************/
/*         Objet mixin de récupération des publications par utilisateur    */
/***************************************************************************/

import { mapActions } from 'vuex';
export const profilePostsMixin = {
    ...mapActions('posts',['getPostsByUserId','getPopularPostsByUserId','getReportedPosts']),
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
