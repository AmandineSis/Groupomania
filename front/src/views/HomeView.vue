<template>
    <nav class="topMenu" v-once>
        <SettingsMenu class="topMenu__settings" v-once />
        <!-- <SettingsMenu class="topMenu__settings" @show-update="openUpdateMenu"  v-once /> -->
        <router-link :to="`/profile/${userLoggedIn.userId}`"><UserProfile/></router-link>
    </nav> 
    <!--Pop-up update menu-->
    <transition name="bounce">
        <UpdateMenu v-if="updateMenu" :selected='selected' :mode='mode'/>
        <!-- <UpdateMenu v-if="updateMenu" @close-update="closeUpdateMenu" @blur="closeUpdateMenu" tabindex="0"/> -->
    </transition>
    
    <AddPost :mode='"homePage"' v-once/>

    <div class="toggle">
        <button class="toggle__btn toggle__btn--isSelected" :class="{'toggle__btn--isActive' : selected=='recentPosts'}" @click="showRecentPosts"> Récents </button>
        <button class="toggle__btn toggle__btn--isSelected" :class="{'toggle__btn--isActive' : selected=='popularPosts'}" @click="showPopularPosts"> Populaires </button>
        <button class="toggle__btn toggle__btn--isSelected" :class="{'toggle__btn--isActive' : selected=='reportedPosts'}" @click="showReportedPosts" v-if="user.moderator==1"> Signalés </button>
    </div>

    <!--Loader-->
    <main class="loaderContainer" v-if="status == 'loading'">
        <div class="lds-ring" ><div></div><div></div><div></div><div></div></div>
    </main>

    <main v-else>
        <!------------------------------------POSTS BY DATE------------------------------------------------------------------>
        <div class="postsContainer" v-if="selected == 'recentPosts' && postLength!=0">  
            <div v-for="postItem in posts" :key="postItem.postId">
            <RecentPosts  :postItem="postItem" :currentPage='"homePage"' :selectedMode="mode" />  
        </div>
        </div>
        <div class="noPost" v-if="selected == 'recentPosts' && postLength==0"> 
            <p class="noPost__text">Il n'existe pas encore de publication !</p>
        </div> 
        <!------------------------------------POSTS BY LIKE------------------------------------------------------------------>
        <div class="postsContainer" v-if="selected == 'popularPosts'&& popularPostsLength!=0">
            <RecentPosts v-for="popularPostItem in popularPosts" :key="popularPostItem.postId" :postItem="popularPostItem" :selectedMode="mode"/>   
        </div>
        <div class="noPost" v-if="selected == 'popularPosts' && popularPostsLength==0">
            <p class="noPost__text">Il n'existe pas encore de publication !</p>
        </div>
        <!------------------------------------POSTS REPORTED------------------------------------------------------------------>
        <div class="postsContainer" v-if="selected == 'reportedPosts'&& reportedPostsLength!=0">
            <RecentPosts v-for="reportedPostsItem in reportedPosts" :key="reportedPostsItem.postId" :postItem="reportedPostsItem" :selectedMode="mode"/>   
        </div>
        <div class="noPost" v-if="selected == 'reportedPosts' && reportedPostsLength==0">
            <p class="noPost__text">Aucune publication n'a été signalée !</p>
        </div>
    </main>
</template>

<script>
import  {mapState, mapActions } from 'vuex';
import SettingsMenu from '@/components/Home/Nav/SettingsMenu.vue'
import UserProfile from '@/components/Home/Nav/UserProfile.vue'
import UpdateMenu from '@/components/Home/Nav/UpdateMenu.vue'
import AddPost from '@/components/Home/Posts/AddPost.vue'
import RecentPosts from '@/components/Home/Posts/RecentPosts.vue'
import { homePostsMixin } from '@/mixins/homePostsMixin'
export default {
    name: 'HomeView',
    mixins : [homePostsMixin],
    components : {
        SettingsMenu,
        UpdateMenu,
        UserProfile,
        AddPost,
        RecentPosts
    },
    data(){
        return{
            mode: "homePage",
            selected: 'recentPosts',
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
    beforeMount: 
        //Loading user data and posts to display
        function(){
            if (this.user.userId == -1) {
            this.$router.push('/');
            return ;
            }
            this.getUserLoggedIn()
                .then(() => {
                    console.log("getUserLoggedIn dispatch done !")
                    this.getAllRecentPosts()
                    
        })},  
    methods: {
        ...mapActions(['getUserLoggedIn','getUserInfos']),
        //toggle entre les différentes listes de publication
        showRecentPosts(){
            this.selected='recentPosts';
            this.getAllRecentPosts()
        },    
        showPopularPosts(){
            this.selected = 'popularPosts';
            this.getAllPopularPosts()
        },
        showReportedPosts(){
            this.selected='reportedPosts';
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
    width: 500px;
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

</style>
