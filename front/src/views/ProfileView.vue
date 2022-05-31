<template>
    <nav class="topMenu" v-once>
        <SettingsMenu class="topMenu__settings" v-once />
        <router-link class="topMenu__home" :to="`/home/`" ><font-awesome-icon icon="house"/></router-link>
    </nav> 

    <UserProfile :profileView="true"/>
    <button class="button" v-if="user.userId == 1 && userIdProfile !== 1" @click="showDeleteBlock" >Supprimer cet utilisateur</button>
    <AdminDeleteContainer v-if="deleteBlock"/>

    <transition name="bounce">
        <UpdateMenu 
            v-if="updateMenu" 
            :current-page="currentPage" 
            :selected-mode="selectedMode"/>
    </transition>

    <AddPost 
        :current-page="currentPage" 
        :selected-mode="selectedMode" 
        v-once/> 

    <div class="toggle">
        <button class="toggle__btn toggle__btn--isSelected" :class="{'toggle__btn--isActive' : selectedMode=='recentUserPosts'}" @click="getUserRecentPosts"> Récents </button>
        <button class="toggle__btn toggle__btn--isSelected" :class="{'toggle__btn--isActive' : selectedMode=='popularUserPosts'}" @click="getUserPopularPosts"> Populaires </button>
    </div>

    <!--Loader-->
    <main class="loaderContainer" v-if="status == 'loading'">
        <div class="lds-ring" ><div></div><div></div><div></div><div></div></div>
    </main>

    <main v-else>
        <!------------------------------------POSTS BY DATE------------------------------------------------------------------>
        <div class="postsContainer" v-if="selectedMode == 'recentUserPosts' && postByUserLength!=0">  
            <RecentPosts 
                v-for="postItem in postsByUser" 
                :key="postItem.postId" 
                :postItem="postItem" 
                :current-page="currentPage"
                :selected-mode="selectedMode"/>  
        </div>
        <div class="noPost" v-if="selectedMode == 'recentUserPosts' && postByUserLength==0"> 
            <p class="noPost__text">Il n'existe pas encore de publication !</p>
        </div> 
        <!------------------------------------POSTS BY LIKE------------------------------------------------------------------>
        <div class="postsContainer" v-if="selectedMode == 'popularUserPosts'&& popularPostsByUserLength!=0">
            <RecentPosts 
                v-for="popularPostItem in popularPostsByUser" 
                :key="popularPostItem.postId" 
                :postItem="popularPostItem" 
                :current-page="currentPage"
                :selected-mode="selectedMode"/>   
        </div>
        <div class="noPost" v-if="selectedMode == 'popularUserPosts' && popularPostsByUserLength==0">
            <p class="noPost__text">Il n'existe pas encore de publication !</p>
        </div>
    </main>

</template>

<script>

//Components import

import SettingsMenu from '@/components/Home/Nav/SettingsMenu.vue'
import UserProfile from '@/components/Home/Nav/UserProfile.vue'
import UpdateMenu from '@/components/Home/Nav/UpdateMenu.vue'
import AdminDeleteContainer from '@/components/Home/Nav/AdminDeleteContainer.vue'
import AddPost from '@/components/Home/Posts/AddPost.vue'
import RecentPosts from '@/components/Home/Posts/RecentPosts.vue'

//store and mixins import
import { mapMutations, mapState } from 'vuex';
import { profilePostsMixin } from '../mixins/profilePostsMixin'


export default {
    name: 'profileView',
    mixins: [profilePostsMixin],
    components : {
        SettingsMenu,
        UpdateMenu,
        AdminDeleteContainer,
        UserProfile,
        AddPost,
        RecentPosts
    },
    data(){
        return{
            currentPage: 'profilePage',
            selectedMode: 'recentUserPosts',
            userIdProfile: '',
            deleteBlock: false
        }
    },
    beforeMount: 
        //Loading all recent posts from selected user to display
        function(){
            this.userIdProfile = parseInt(this.$route.params.userId);
            const userId = this.userIdProfile;
            this.getAllUserPosts(userId)     
            //Closing updateMenu if previously openend on homePage
            if(this.updateMenu){
                this.UPDATE_MENU_TOGGLE()
            }
        }, 
    computed: {
        ...mapState({
            status: 'status',
            user: 'user'
        }),
        ...mapState('toggle',{
            updateMenu: 'updateMenuIsActive'
        }),
    },
    methods: {
        ...mapMutations('toggle',['UPDATE_MENU_TOGGLE']),
        //toggle delete block
        showDeleteBlock(){
            this.deleteBlock = !this.deleteBlock;
        },
        getUserRecentPosts(){
            this.selectedMode='recentUserPosts';
            const userId = this.$route.params.userId;
            this.getAllUserPosts(userId)
        },
        getUserPopularPosts(){
            this.selectedMode = 'popularUserPosts';
            const userId = this.$route.params.userId;
            console.log(this.mode);
            this.getAllUserPopularPosts(userId)
        },
    }
}
</script>

<style scoped lang="scss">

/************************** TOPNAV ******************* */

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
        &__home{
            color: white;
            margin-right: 15px;
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
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}



/*******************NAV********************* */
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
.button{
font-size: 1em;
                color: white;
                width: 195px;
                height: 25px;
                margin: 3px auto;
                border-radius: 5px;
                background-color: #ee7575;
                transition: .4s background-color;
                &:hover {
                    background-color: #a71e05;
                    color: #ffffff;
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
        color: #2c3e50;
        margin: 15px;
    }
}

</style>
