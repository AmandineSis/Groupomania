<template>
    <nav class="topMenu" v-once>
        <SettingsMenu class="topMenu__settings" @show-settings="openSettings" v-once />
        <router-link :to="`/profile/${userLoggedIn.userId}`"><UserProfile/></router-link>
    </nav> 
    <UpdateMenu v-if="settings"/>
    <NewPost v-once/>

   <div class="toggle">
        <button class="toggle__btn toggle__btn--isSelected" :class="{'toggle__btn--isActive' : mode=='recentPosts'}" @click="showRecentPosts"> Récents </button>
        <button class="toggle__btn toggle__btn--isSelected" :class="{'toggle__btn--isActive' : mode=='popularPosts'}" @click="showPopularPosts"> Populaires </button>
        <button class="toggle__btn toggle__btn--isSelected" :class="{'toggle__btn--isActive' : mode=='reportedPosts'}" @click="showReportedPosts" v-if="user.moderator==1"> Signalés </button>
    </div>

    <!------------------------------------POSTS BY DATE------------------------------------------------------------------>
    <main class="postsContainer" v-if="mode == 'recentPosts' && postLength!=0">  
        <RecentPosts v-for="postItem in posts" :key="postItem.postId" :postItem="postItem" :selectedMode="mode"/>  
    </main>
    <main class="noPost" v-if="mode == 'recentPosts' && postLength==0"> 
        <p class="noPost__text">Il n'existe pas encore de publication !</p>
    </main> 
    <!------------------------------------POSTS BY LIKE------------------------------------------------------------------>
    <main class="postsContainer" v-if="mode == 'popularPosts'&& popularPostsLength!=0">
        <RecentPosts v-for="popularPostItem in popularPosts" :key="popularPostItem.postId" :postItem="popularPostItem" :selectedMode="mode"/>   
    </main>
    <main class="noPost" v-if="mode == 'popularPosts' && popularPostsLength==0">
        <p class="noPost__text">Il n'existe pas encore de publication !</p>
    </main>
    <!------------------------------------POSTS REPORTED------------------------------------------------------------------>
    <main class="postsContainer" v-if="mode == 'reportedPosts'&& reportedPostsLength!=0">
        <RecentPosts v-for="reportedPostsItem in reportedPosts" :key="reportedPostsItem.postId" :postItem="reportedPostsItem" :selectedMode="mode"/>   
    </main>
    <main class="noPost" v-if="mode == 'reportedPosts' && reportedPostsLength==0">
        <p class="noPost__text">Aucune publication n'a été signalée !</p>
    </main>

</template>

<script>
import {mapState, mapActions, mapGetters} from 'vuex';
import SettingsMenu from '@/components/Home/Nav/SettingsMenu.vue'
import UserProfile from '@/components/Home/Nav/UserProfile.vue'
import UpdateMenu from '@/components/Home/Nav/UpdateMenu.vue'
import NewPost from '@/components/Home/Posts/NewPost.vue'
import RecentPosts from '@/components/Home/Posts/RecentPosts.vue'

export default {
    name: 'HomeView',
    components : {
        SettingsMenu,
        UpdateMenu,
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
            user: 'user',
            userLoggedIn: 'userLoggedIn',
            posts: 'postsByDate',
            popularPosts: 'postsByLike',
            reportedPosts: 'reportedPosts',
        }),
        ...mapGetters({
            postLength: 'postsByDateLength',
            popularPostsLength: 'postsByLikeLength',
            reportedPostsLength: 'reportedPostsLength' 
        })
    },
    beforeMount: 
        function(){
            if (this.user.userId == -1) {
            this.$router.push('/');
            return ;
            }
            this.getUserLoggedIn()
                .then(() => {
                    console.log("getUserLoggedIn dispatch done !")
                    this.getPostsByDate()
                        .then(() => {
                            console.log("getPostsByDate dispatch done !")
                            })
                        .catch((err) => {
                            console.log(err);
                            window.alert('Aucune publication !');
                        })
        })},  
    methods: {
        ...mapActions(['getUserLoggedIn','getUserInfos','getPostsByDate','getPopularPosts','getReportedPosts']),
        openSettings(){
                this.settings=!this.settings;
            },
        showRecentPosts(){
            this.mode='recentPosts';
            this.getPostsByDate()
                .then(() => {
                    console.log("getPostsByDate dispatch done !")
                });
        },    
        showPopularPosts(){
            this.mode = 'popularPosts';
            this.getPopularPosts()
            .then(() => {
                    console.log("getPopularPosts dispatch done !")
                });
        },
        showReportedPosts(){
            this.mode='reportedPosts';
            this.getReportedPosts()
                .then(() => {
                    console.log("getReportedPosts dispatch done !")
                });
        }
    }
}
</script>

<style scoped lang="scss">

.topMenu {
        position: absolute;
        top: 90px;
        width: 100%;
        height: 25px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        &__settings{
            width: 50%;
            margin-left: 15px;
        }
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

.postsContainer{
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
