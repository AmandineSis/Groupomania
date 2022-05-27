/********************************************************/
/*     Objet mixin de récupération des publications     */
/********************************************************/


import { mapActions } from 'vuex';
export const homePostsMixin = {
    methods: {
        ...mapActions('posts',['getPostsByDate','getPopularPosts','getReportedPosts']),
        getAllRecentPosts(){
            const self = this;
            self.getPostsByDate()
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