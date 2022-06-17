
<template>
    <nav class="topMenu" v-once>
        <SettingsMenu class="topMenu__settings" v-once />
        <router-link class="topMenu__home" :to="`/home/`" ><font-awesome-icon icon="house"/></router-link>
    </nav> 

    <UserProfile :profileView="true"/>
    <!-----Delete button only visible to moderator and not showing on moderator profile------->
    <button class="button" v-if="user.moderator == 1 && userIdProfile !== user.userId" @click="showDeleteBlock" >Supprimer cet utilisateur</button>
    <transition name="bounce">
        <AdminDeleteContainer :current-page="currentPage"  v-if="deleteUserMenu"/>
    </transition>
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
        v-if="userIdProfile == user.userId"
        v-once/> 
        
    <!--Toggle entre selectedMode -->
    <div class="toggle">
        <button class="toggle__btn toggle__btn--isSelected" :class="{'toggle__btn--isActive' : selectedMode=='recentUserPosts'}" @click="getUserRecentPosts"> Récents </button>
        <button class="toggle__btn toggle__btn--isSelected" :class="{'toggle__btn--isActive' : selectedMode=='popularUserPosts'}" @click="getUserPopularPosts"> Populaires </button>
    </div>

    <!-- Loader visible pendant le chargement des publications -->
    <main class="loaderContainer" v-if="status == 'loading'">
        <div class="lds-ring" ><div></div><div></div><div></div><div></div></div>
    </main>

    <main v-else>
        <!------------------------------------POSTS BY DATE------------------------------------------------------------------>
        <div class="postsContainer" v-if="selectedMode == 'recentUserPosts' && postByUserLength!=0">  
            <PostItem 
                v-for="postItem in postByDateByUserLoaded" 
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
            <PostItem 
                v-for="popularPostItem in popularPostByUserLoaded" 
                :key="popularPostItem.postId" 
                :postItem="popularPostItem" 
                :current-page="currentPage"
                :selected-mode="selectedMode"/>   
        </div>
        <div class="noPost" v-if="selectedMode == 'popularUserPosts' && popularPostsByUserLength==0">
            <p class="noPost__text">Il n'existe pas encore de publication !</p>
        </div>
    </main>
    <button class="loadButton" @click="loadMore()" v-if="selectedMode == 'recentUserPosts' && postDisplay < postByUserLength">Afficher plus...</button>
    <button class="loadButton" @click="loadMore()" v-if="selectedMode == 'popularUserPosts' && popularPostDisplay < popularPostsByUserLength">Afficher plus...</button>
    <MainFooter/>
</template>

<script>

//Components import

import SettingsMenu from '@/components//Nav/SettingsMenu.vue'
import UserProfile from '@/components//Nav/UserProfile.vue'
import UpdateMenu from '@/components//Nav/UpdateMenu.vue'
import AdminDeleteContainer from '@/components//Nav/AdminDeleteContainer.vue'
import AddPost from '@/components//Posts/AddPost.vue'
import PostItem from '@/components//Posts/PostItem.vue'
import MainFooter from '@/components/Base/TheFooter.vue'

//store and mixins import
import { mapMutations, mapState } from 'vuex';
import { profilePostsMixin } from '../mixins/profilePostsMixin'


export default {
    //ajout de mediaqueries
    inject: ["mq"],
    name: 'profileView',
    mixins: [profilePostsMixin],
    components : {
        SettingsMenu,
        UpdateMenu,
        AdminDeleteContainer,
        UserProfile,
        AddPost,
        PostItem,
        MainFooter
    },
    data(){
        return{
            currentPage: 'profilePage',
            selectedMode: 'recentUserPosts',
            userIdProfile: '',
            deleteBlock: false,
            postDisplay: 2,
            popularPostDisplay: 2
        }
    },
    mounted: 
        //Loading all recent posts from selected user to display
        function(){
            this.userIdProfile = parseInt(this.$route.params.userId);
            const userId = this.userIdProfile;
            this.getAllUserPosts(userId)  
            this.getAllUserPopularPosts(userId)   
            //Closing updateMenu if previously openend on homePage
            if(this.updateMenu){
                this.UPDATE_MENU_TOGGLE()
            }
        }, 
    computed: {
        postByDateByUserLoaded() {
            return this.postsByUser.slice(0, this.postDisplay);
        },
        popularPostByUserLoaded() {
            return this.popularPostsByUser.slice(0, this.popularPostDisplay);
        },
        ...mapState({
            status: 'status',
            user: 'user'
        }),
        ...mapState('toggle',{
            updateMenu: 'updateMenuIsActive',
            deleteUserMenu: 'deleteUserBlockIsActive'
        }),
    },
    methods: {
        ...mapMutations('toggle',['UPDATE_MENU_TOGGLE','UPDATE_MENU_CLOSE','DELETE_USER_CLOSE', 'DELETE_USER_TOGGLE']),
        //toggle delete block
        showDeleteBlock(){
            //this.deleteBlock = !this.deleteBlock;
            this.UPDATE_MENU_CLOSE()
            this.DELETE_USER_TOGGLE()
        },
        getUserRecentPosts(){
            this.selectedMode='recentUserPosts';
            this.postsByUser;
        },
        getUserPopularPosts(){
            this.selectedMode = 'popularUserPosts';
            this.popularPostsByUser;
        },
        //Affiche 3 publications en plus
        loadMore() {
            if(this.selectedMode == 'recentUserPosts'){
                if (this.postDisplay > this.postByUserLength) return;
                this.postDisplay = this.postDisplay + 3;
            } else {
                if (this.popularPostDisplay > this.popularPostsByUserLength) return;
                this.popularPostDisplay = this.popularPostDisplay + 3;
            }
        },
    },

    beforeUnmount:
        function(){
            this.UPDATE_MENU_CLOSE();
            this.DELETE_USER_CLOSE();
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
    max-width: 500px;
    display: flex;
    flex-direction: row;
    justify-content:  space-between;
    &__btn{
        background: white;
        color:#4E5166;
        font-weight: 800;
        font-size: 15px;
        border-bottom: 1px  solid #4E5166;
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
    min-height: 500px;
    margin:  50px auto;
}
.noPost {
    border: 2px solid #ee7575;
    border-radius: 5px;
    max-width: 500px;
    height: 50px;
    margin: 100px auto 300px;
    &__text{
        color: #4E5166;
        margin: 15px;
    }
}

.loadButton{
    width: 25%;
    margin: 0 0 20px ;
    border-radius: 100px;
    height: 40px;
    background-color: #ee7575;
    color: #ffffff;
        &:hover {
            background-color:  #ffffff;
            color:#ee7575;
            border: solid 1.5px #ee7575;
        }
}

</style>
