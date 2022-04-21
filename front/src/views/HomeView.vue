<template>
    <div class="topBar" v-once>
        <TopBar @show-settings="openSettings"/>
        <UserProfile/>
    </div> 

    <div class="settingsBlock" v-if="settings">
        Settings
    </div>

    <div class="newPost" v-once>
        <NewPost/>  
    </div>
       
    <div class="recentPosts">
        <RecentPosts/>   
    </div>

</template>

<script>
import TopBar from '@/components/Home/TopBar.vue'
import UserProfile from '@/components/Home/UserProfile.vue'
import NewPost from '@/components/Home/NewPost.vue'
import RecentPosts from '@/components/Home/RecentPosts.vue'

export default {
    name: 'HomeView',
    components : {
        TopBar,
        UserProfile,
        NewPost,
        RecentPosts
    },
    data(){
        return{
            search: false,
            settings: false,
        }
    },
    methods: {
        openSettings(){
                this.settings=!this.settings;
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

/************************settings block*************************** */
.settingsBlock {
        border: 2px solid #999999;
        background-color: white;
        margin: 30px auto;
        width: 500px;
        height: 100px;
        align-items: center;
        border-radius: 20px;
      /* position: absolute;
        z-index: 3;*/
    }
/************************new post*************************** */
.newPost{
        height: 130px;
    }
/************************new post*************************** */
.recentPosts{
        height: 130px;
    }


</style>
