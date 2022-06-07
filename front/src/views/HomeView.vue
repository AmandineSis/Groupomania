<template>
    <!-- Header navigation -->
    <!-- Screen width > 768px -->
    <div v-if ="mq.current != 'phone'">
        <nav class="topMenu" v-once>
            <SettingsMenu class="topMenu__settings" v-once />
            <router-link :to="`/profile/${userLoggedIn.userId}`">
                <UserProfile/>
            </router-link>
        </nav> 
    </div>
    <!-- Screen width < 768px -->
    <div v-else>
        <nav class="topMenu" v-once>
            <SettingsMenu class="topMenu__settings" v-once />
        </nav> 
        <UserProfile :phoneView="true"/>
    </div>
    <!-- Pop-up update menu -->
    <transition name="bounce">
        <UpdateMenu 
            v-if="updateMenu" 
            :phoneView="mq.current"
            :current-page="currentPage" 
            :selected-mode="selectedMode"/>
    </transition>
    
    <AddPost 
        :phoneView="mq.current"
        :current-page="currentPage" 
        :selected-mode="selectedMode" 
        v-once/>

    <!--Toggle between selectedMode -->
    <div class="toggle">
        <button class="toggle__btn toggle__btn--isSelected" :class="{'toggle__btn--isActive' : selectedMode=='recentPosts'}" @click="showRecentPosts"> Récents </button>
        <button class="toggle__btn toggle__btn--isSelected" :class="{'toggle__btn--isActive' : selectedMode=='popularPosts'}" @click="showPopularPosts"> Populaires </button>
        <button class="toggle__btn toggle__btn--isSelected" :class="{'toggle__btn--isActive' : selectedMode=='reportedPosts'}" @click="showReportedPosts" v-if="user.moderator==1"> Signalés </button>
    </div>

    <!-- Loader visible while loading posts -->
    <main class="loaderContainer" v-if="status == 'loading'">
        <div class="lds-ring" ><div></div><div></div><div></div><div></div></div>
    </main>

    <main v-else>
        <!------------------------------------POSTS BY DATE------------------------------------------------------------------>
        <div class="postsContainer" v-if="selectedMode == 'recentPosts' && postLength!=0">  
            <div >
            <PostItem  
                v-for="(postItem, index) in posts" 
                :key="postItem.postId"
                :post-item="postItem" 
                :index="index"
                :phoneView="mq.current"
                :current-page="currentPage"
                :selected-mode="selectedMode"/>  
        </div>
        </div>
        <div class="noPost" v-if="selectedMode == 'recentPosts' && postLength==0"> 
            <p class="noPost__text">Il n'existe pas encore de publication !</p>
        </div> 
        <!------------------------------------POSTS BY LIKE------------------------------------------------------------------>
        <div class="postsContainer" v-if="selectedMode == 'popularPosts'&& popularPostsLength!=0">
            <PostItem 
                v-for="popularPostItem in popularPosts" 
                :key="popularPostItem.postId" 
                :post-item="popularPostItem"
                :current-page="currentPage"
                :selected-mode="selectedMode"/>   
        </div>
        <div class="noPost" v-if="selectedMode == 'popularPosts' && popularPostsLength==0">
            <p class="noPost__text">Il n'existe pas encore de publication !</p>
        </div>
        <!------------------------------------POSTS REPORTED------------------------------------------------------------------>
        <div class="postsContainer" v-if="selectedMode == 'reportedPosts'&& reportedPostsLength!=0">
            <PostItem 
            v-for="reportedPostsItem in reportedPosts" 
            :key="reportedPostsItem.postId" 
            :post-item="reportedPostsItem" 
            :current-page="currentPage"
            :selected-mode="selectedMode"/>   
        </div>
        <div class="noPost" v-if="selectedMode == 'reportedPosts' && reportedPostsLength==0">
            <p class="noPost__text">Aucune publication n'a été signalée !</p>
        </div>
    </main>
</template>

<script>

//Components import
import SettingsMenu from '@/components/Home/Nav/SettingsMenu.vue'
import UserProfile from '@/components/Home/Nav/UserProfile.vue'
import UpdateMenu from '@/components/Home/Nav/UpdateMenu.vue'
import AddPost from '@/components/Home/Posts/AddPost.vue'
import PostItem from '@/components/Home/Posts/PostItem.vue'

//store and mixins import
import { mapState, mapMutations } from 'vuex';
import { homePostsMixin } from '@/mixins/homePostsMixin'


export default {
    inject: ["mq"],
    name: 'HomeView',
    mixins : [homePostsMixin],
    components : {
        SettingsMenu,
        UpdateMenu,
        UserProfile,
        AddPost,
        PostItem
    },
    data(){
        return{
            currentPage: "homePage",
            selectedMode: 'recentPosts',
        }
    },
    beforeMount: 
        function(){
            //user redirected to AuthPage if userId = -1
            if (this.user.userId == -1) {
            this.$router.push('/');
            return ;
            }
            //Loading all recent posts to display
            this.getAllRecentPosts()  
            //Closing updateMenu if previously opened on profilePage   
            if(this.updateMenu){
                this.UPDATE_MENU_TOGGLE()
            }   
        }, 
    computed: {
        ...mapState({
            status: 'status',
            user: 'user',
            userLoggedIn: 'userLoggedIn',
        }),
        ...mapState('toggle',{
            updateMenu: 'updateMenuIsActive'
        }),
    }, 
    methods: {
        ...mapMutations('toggle',['UPDATE_MENU_TOGGLE']),
        //toggle between the selected tab
        showRecentPosts(){
            this.selectedMode='recentPosts';
            this.getAllRecentPosts()
        },    
        showPopularPosts(){
            this.selectedMode = 'popularPosts';
            this.getAllPopularPosts()
        },
        showReportedPosts(){
            this.selectedMode='reportedPosts';
            this.getAllReportedPosts()
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
/***********UPDATE MENU ANIMATION********* */    
.bounce-enter-active {
    animation: bounce-in .8s;
}
.bounce-leave-active {
    animation: bounce-in .8s reverse;
}
@keyframes bounce-in {
    0% {
        transform: scale(0);
    }
    70% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}
/*******************NAV********************* */
.toggle {
    max-width: 500px;
    display: flex;
    flex-direction: row;
    justify-content:  space-between;
    &__btn{
        background: white;
        color:#4E5166;
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
/*****************LOADER********************* */
.loaderContainer{
    width: 100%;
    margin-top: 50px;
}
.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #ee7575;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #ee7575 transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
/******************POSTS********************* */
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
/*
@media screen and (max-width: 768px) {

    .toggle{
        width: 100%;
    }
}*/

</style>
