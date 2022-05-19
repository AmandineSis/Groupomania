<template>
    <nav class="topMenu" v-once>
        <SettingsMenu class="topMenu__settings" @show-settings="openSettings" v-once />
        <router-link class="topMenu__home" :to="`/home/`" ><font-awesome-icon icon="house"/></router-link>
    </nav> 

    <UserProfile :profileView="true" :posts="posts"/>
    <button class="button" v-if="user.userId == 1 && userIdProfile !== 1" @click="showDeleteBlock" >Supprimer cet utilisateur</button>
    <DeleteBlock v-if="deleteBlock"/>
    <UpdateMenu v-if="settings"/>
    <NewPost :mode="profilePage" v-once/>  
    <div class="toggle">
        <button class="toggle__btn toggle__btn--isSelected" :class="{'toggle__btn--isActive' : mode=='recentPosts'}" @click="getUserRecentPosts"> Récents </button>
        <button class="toggle__btn toggle__btn--isSelected" :class="{'toggle__btn--isActive' : mode=='popularPosts'}" @click="getUserPopularPosts"> Populaires </button>
    </div>
    <main v-if="mode == 'recentPosts'">  
        <div class="posts__container" v-for="postItem in posts" :key="postItem.postId">
            <RecentPosts :postItem="postItem" />   
        </div>
    </main> 
    <main v-if="mode == 'popularPosts'">
        <div class="posts__container" v-for="popularPostItem in popularPosts" :key="popularPostItem.postId">
            <RecentPosts :postItem="popularPostItem"/>   
        </div>
    </main>

</template>

<script>
import {mapState} from 'vuex';
import SettingsMenu from '@/components/Home/Nav/SettingsMenu.vue'
import UserProfile from '@/components/Home/Nav/UserProfile.vue'
import UpdateMenu from '@/components/Home/Nav/UpdateMenu.vue'
import DeleteBlock from '@/components/Home/Nav/Update/DeleteBlock.vue'
import NewPost from '@/components/Home/Posts/NewPost.vue'
import RecentPosts from '@/components/Home/Posts/RecentPosts.vue'

export default {
    name: 'HomeView',
    components : {
        SettingsMenu,
        UpdateMenu,
        DeleteBlock,
        UserProfile,
        NewPost,
        RecentPosts
    },
    data(){
        return{
            mode: 'recentPosts',
            search: false,
            settings: false,
            userIdProfile: '',
            deleteBlock: false
        }
    },
    computed: {
        ...mapState({
            posts: 'postsByUserId',
            popularPosts: 'postsByUserIdByLike',
            user: 'user'
        })
    },
    mounted:
        function(){
            this.userIdProfile = parseInt(this.$route.params.userId);
            this.$store
                .dispatch('getPostsByUserId', this.userIdProfile)
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
        },
        showDeleteBlock(){
            this.deleteBlock = !this.deleteBlock;
        }
        
  }
}
</script>

<style scoped lang="scss">

/************************** TOPNAV ******************* */
p {
  color: black;
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
        &__home{
            color: white;
            margin-right: 15px;
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
/************************new post*************************** */
/************************new post*************************** */


.posts__container{
    max-width: 500px;
        height: auto;
        margin:  50px auto;
}
</style>
