<template>
    <nav class="topBar" v-once>
        <TopBar @show-settings="openSettings" v-once />
        <router-link :to="`/profile/${user.userId}`"><UserProfile/></router-link>
    </nav> 
    <UserSettings v-if="settings"/>
    <NewPost v-once/>  
   <div class="toggle">
        <button class="toggle__btn toggle__btn--isSelected" :class="{'toggle__btn--isActive' : mode=='recentPosts'}" @click="getRecentPosts"> Récents </button>
        <button class="toggle__btn toggle__btn--isSelected" :class="{'toggle__btn--isActive' : mode=='popularPosts'}" @click="getPopularPosts"> Populaires </button>
        <button class="toggle__btn toggle__btn--isSelected" :class="{'toggle__btn--isActive' : mode=='reportedPosts'}" @click="getReportedPosts" v-if="user.moderator==1"> Signalés </button>
    </div>
    <main v-if="mode == 'recentPosts'">  
        <div v-if="posts.length>= 1">
            <div class="posts__container" v-for="postItem in posts" :key="postItem.postId">
                <RecentPosts :postItem="postItem" :selectedMode="mode"/>   
            </div>
        </div>
        <div class="noPost" v-else>
            <p class="noPost__text">Il n'existe pas encore de publication !</p>
        </div>
    </main> 
    <main v-if="mode == 'popularPosts'">
        <div v-if="popularPosts.length>=1">
            <div class="posts__container" v-for="popularPostItem in popularPosts" :key="popularPostItem.postId">
                <RecentPosts :postItem="popularPostItem" :selectedMode="mode"/>   
            </div>
        </div>
        <div class="noPost" v-else>
            <p class="noPost__text">Il n'existe pas encore de publication !</p>
        </div>
    </main>
    <main v-if="mode == 'reportedPosts'">
        <div v-if="reportedPosts.length>=1">
            <div class="posts__container" v-for="reportedPostsItem in reportedPosts" :key="reportedPostsItem.postId">
                <RecentPosts :postItem="reportedPostsItem" :selectedMode="mode"/>   
            </div>
        </div >
        <div class="noPost" v-else>
            <p class="noPost__text">Aucune publication n'a été signalée !</p>
        </div>
    </main>
</template>

<script>
import {mapState} from 'vuex';
import TopBar from '@/components/Home/Nav/TopBar.vue'
import UserProfile from '@/components/Home/Nav/UserProfile.vue'
import UserSettings from '@/components/Home/Settings/UserSettings.vue'
import NewPost from '@/components/Home/Posts/NewPost.vue'
import RecentPosts from '@/components/Home/Posts/RecentPosts.vue'

export default {
    name: 'HomeView',
    components : {
        TopBar,
        UserSettings,
        UserProfile,
        NewPost,
        RecentPosts
    },
    data(){
        return{
            search: false,
            settings: false,
            mode: 'recentPosts'
        }
    },
    computed: {
        ...mapState({
            posts: 'postsByDate',
            popularPosts: 'postsByLike',
            reportedPosts: 'reportedPosts',
            user: 'user',
            
        })
    },
    beforeMount: 
        function(){

            this.$store
                .dispatch('getPostsByDate')
                .then(() => {
                    console.log("getPostsByDate dispatch done !")
                   /* this.$store     ////////WARNING ADD IF MODE = "reported" dans une fct séparée
                        .dispatch('getReportedPosts')
                        .then(() => {
                            console.log("getReportedPosts dispatch done !")
                        });*/
                })
                .catch((err) => {
                        console.log(err);
                        window.alert('Aucune publication !');
            
        })
        }
    ,  
    methods: {
        openSettings(){
                this.settings=!this.settings;
            },
        getPopularPosts(){
            this.mode = 'popularPosts';
            console.log(this.mode);
            this.$store
                .dispatch('getPopularPosts')
                .then(() => {
                    console.log("getPopularPosts dispatch done !")
                });
        },
        getRecentPosts(){
            this.mode='recentPosts';
            this.$store
                .dispatch('getPostsByDate')
                .then(() => {
                    console.log("getPostsByDate dispatch done !")
                });
        },
        getReportedPosts(){
            this.mode='reportedPosts';
            this.$store
                .dispatch('getReportedPosts')
                .then(() => {
                    console.log("getReportedPosts dispatch done !")
                });
        }
    }
}
</script>

<style scoped lang="scss">

/************************** TOPNAV ******************* */
p {
  color: black;
}

.topBar {
         position: absolute;
        top: 90px;
        width: 100%;
        height: 25px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

.toggle {
    width: 500px;
    display: flex;
    flex-direction: row;
    justify-content:  space-between;
    &__btn{
        background: white;
        color:grey;
        font-weight: 800;
        font-size: 15px;
        border-bottom: 1px  solid grey;
        padding: 0px;
        width: 50%;
        height: 40px;
        transition: .4s background-color;
        &--isActive{
            color: #ee7575;
            border-bottom: 2px  solid #ee7575;
        }
        &:hover{
            color: #ee7575;
            border-bottom: 2px  solid #ee7575;
        }
    }
}
/************************new post*************************** */
/************************new post*************************** */
.posts__container{
        max-width: 500px;
        height: auto;
        margin:  50px auto;
    }
.noPost {
    border: 2px solid #ee7575;
    border-radius: 5px;
    max-width: 500px;
    height: 50px;
    margin: 50px auto;
    &__text{
        margin: 15px;
    }
}

</style>
