<template>
    <nav class="topBar" v-once>
        <TopBar @show-settings="openSettings" v-once />
    </nav> 

    <UserProfile :profileView="true" :posts="posts"/>
    <UserSettings v-if="settings"/>
    <NewPost v-once/>  
    <div class="toggle">
        <button class="toggle__btn toggle__btn--isSelected" :class="{'toggle__btn--isActive' : mode=='recentPosts'}" @click="getUserRecentPosts"> Récents </button>
        <button class="toggle__btn toggle__btn--isSelected" :class="{'toggle__btn--isActive' : mode=='popularPosts'}" @click="getUserPopularPosts"> Populaires </button>
    </div>
    <main v-if="mode == 'recentPosts'">  
        <div class="recentPosts" v-for="postItem in posts" :key="postItem.postId">
            <RecentPosts :postItem="postItem"/>   
        </div>
    </main> 
    <main v-if="mode == 'popularPosts'">
        <div class="PopularPosts" v-for="popularPostItem in popularPosts" :key="popularPostItem.postId">
            <RecentPosts :postItem="popularPostItem"/>   
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
            mode: 'recentPosts',
            search: false,
            settings: false,
        }
    },
    computed: {
        ...mapState({
           posts: 'postsByUserId',
            popularPosts: 'postsByUserIdByLike',
            user: 'userInfos'
        })
    },
    mounted:
        function(){
            const userId = this.$route.params.userId;
            console.log(userId);
            this.$store
                .dispatch('getPostsByUserId', userId)
                .then(() => {
                    console.log("getPostsByUserId dispatch done !")
                });
            
        },
    methods: {
        openSettings(){
                this.settings=!this.settings;
            },
        getUserPopularPosts(){
            this.mode = 'popularPosts';
            const userId = this.$route.params.userId;
            console.log(this.mode);
            this.$store
                .dispatch('getPopularPostsByUserId', userId)
                .then(() => {
                    console.log("getPopularPostsByUserId dispatch done !")
                });
        },
        getUserRecentPosts(){
            this.mode='recentPosts';
            const userId = this.$route.params.userId;
            this.$store
                 .dispatch('getPostsByUserId', userId)
                .then(() => {
                    console.log("getPostsByUserId dispatch done !")
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
        background: #efefef;
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
.recentPosts{
        height: auto;
    }


</style>
