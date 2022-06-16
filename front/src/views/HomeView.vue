<template>
    <!-- Header navigation -->
    <!-- Screen width > 768px -->
    <div class="container">
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

        <!--Toggle entre selectedMode -->
        <div class="toggle">
            <button class="toggle__btn toggle__btn--isSelected" :class="{'toggle__btn--isActive' : selectedMode=='recentPosts'}" @click="showRecentPosts"> Récents </button>
            <button class="toggle__btn toggle__btn--isSelected" :class="{'toggle__btn--isActive' : selectedMode=='popularPosts'}" @click="showPopularPosts"> Populaires </button>
            <button class="toggle__btn toggle__btn--isSelected" :class="{'toggle__btn--isActive' : selectedMode=='reportedPosts'}" @click="showReportedPosts" v-if="user.moderator==1"> Signalés </button>
        </div>

        <!-- Loader visible pendant le chargement des publications  -->
        <main class="loaderContainer" v-if="status == 'loading'">
            <div class="lds-ring" ><div></div><div></div><div></div><div></div></div>
        </main>

        <main v-else>
            <!------------------------------------POSTS BY DATE------------------------------------------------------------------>
            <div class="postsContainer" v-if="selectedMode == 'recentPosts' && postLength!=0">  
                <div >
                <PostItem  
                    v-for="postItem in postByDateLoaded" 
                    :key="postItem.postId"
                    :post-item="postItem"
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
                    v-for="popularPostItem in popularPostLoaded" 
                    :key="popularPostItem.postId" 
                    :post-item="popularPostItem"
                    :current-page="currentPage"
                    :selected-mode="selectedMode"
                    v-once/>   
            </div>
            <div class="noPost" v-if="selectedMode == 'popularPosts' && popularPostsLength==0">
                <p class="noPost__text">Il n'existe pas encore de publication !</p>
            </div>
            <!------------------------------------POSTS REPORTED------------------------------------------------------------------>
            <div class="postsContainer" v-if="selectedMode == 'reportedPosts'&& reportedPostsLength!=0">
                <PostItem 
                v-for="reportedPostsItem in reportedPostLoaded" 
                :key="reportedPostsItem.postId" 
                :post-item="reportedPostsItem" 
                :current-page="currentPage"
                :selected-mode="selectedMode"/>   
            </div>
            <div class="noPost" v-if="selectedMode == 'reportedPosts' && reportedPostsLength==0">
                <p class="noPost__text">Aucune publication n'a été signalée !</p>
            </div>
            <!----Affiche plus de publications---->

        </main>
        <button class="loadButton" @click.stop="loadMore()" v-if="selectedMode == 'recentPosts' && postDisplay < postLength">Afficher plus...</button>
        <button class="loadButton" @click.stop="loadMore()" v-if="selectedMode == 'popularPosts' && popularPostDisplay < popularPostsLength">Afficher plus...</button>
        <button class="loadButton" @click.stop="loadMore()" v-if="selectedMode == 'reportedPosts'&& reportedPostDisplay < reportedPostsLength">Afficher plus...</button>
    </div>
    <MainFooter/>
</template>

<script>

//Composants
import SettingsMenu from '@/components//Nav/SettingsMenu.vue'
import UserProfile from '@/components//Nav/UserProfile.vue'
import UpdateMenu from '@/components//Nav/UpdateMenu.vue'
import AddPost from '@/components//Posts/AddPost.vue'
import PostItem from '@/components//Posts/PostItem.vue'
import MainFooter from '@/components/Base/TheFooter.vue'

//store et mixins
import { mapState, mapMutations } from 'vuex';
import { homePostsMixin } from '@/mixins/homePostsMixin'


export default {
    //ajout de mediaqueries
    inject: ["mq"],
    name: 'HomeView',
    mixins : [homePostsMixin],
    components : {
        SettingsMenu,
        UpdateMenu,
        UserProfile,
        AddPost,
        PostItem,
        MainFooter
    },
    data(){
        return{
            currentPage: "homePage",
            selectedMode: 'recentPosts',
            postDisplay: 2,
            popularPostDisplay: 2,
            reportedPostDisplay: 2,
            PostItemIsReady: false
        }
    },
    beforeMount: 
        function(){
            //redirection utilisateur vers page d'authentification si erreur
            if (this.user.userId == -1) {
            this.$router.push('/');
            return ;
            }
            //Chargement des publications
            this.getAllRecentPosts()  
            this.getAllPopularPosts()
            this.getAllReportedPosts()
            //Fermeture d'updateMenu si précedemment ouvert sur page profil 
            if(this.updateMenu){
                this.UPDATE_MENU_TOGGLE()
            }   
        }, 
    computed: {
        postByDateLoaded() {
            return this.posts.slice(0, this.postDisplay);
        },
        popularPostLoaded() {
            return this.popularPosts.slice(0, this.popularPostDisplay);
        },
        reportedPostLoaded() {
            return this.reportedPosts.slice(0, this.reportedPostDisplay);
        },
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
        //toggle entre les différents onglets
        showRecentPosts(){
            this.selectedMode='recentPosts';
            this.posts;
           // this.getAllRecentPosts()
        },    
        showPopularPosts(){
            this.selectedMode = 'popularPosts';
            this.popularPosts;
        },
        showReportedPosts(){
            this.selectedMode='reportedPosts';
            this.reportedPosts;
        },
        loadMore() {
            if(this.selectedMode == 'recentPosts'){
                if (this.postDisplay > this.postLength) return;
                this.postDisplay = this.postDisplay + 3;
            } else if(this.selectedMode == 'popularPosts'){
                if (this.popularPostDisplay > this.popularPostsLength) return;
                this.popularPostDisplay = this.popularPostDisplay + 3;
            } else {
                if (this.reportedPostDisplay > this.reportedPostsLength) return;
                this.reportedPostDisplay = this.reportedPostDisplay + 3;
            }
        },
    }
}
</script>

<style scoped lang="scss">
.container{
    height: 100%;
}
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
    margin: 100px auto 300px;
    &__text{
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
