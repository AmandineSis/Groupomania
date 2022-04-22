<template>
    <div class="topBar" v-once>
        <TopBar @show-settings="openSettings"/>
        <UserProfile/>
    </div> 
    <UserSettings v-if="settings"/>


    
        <NewPost v-once/>  
    
       
    <div class="recentPosts">
        <RecentPosts/>   
    </div>

</template>

<script>
import TopBar from '@/components/Home/TopBar.vue'
import UserSettings from '@/components/Home/Settings/UserSettings.vue'
import UserProfile from '@/components/Home/UserProfile.vue'
import NewPost from '@/components/Home/NewPost.vue'
import RecentPosts from '@/components/Home/RecentPosts.vue'

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
/************************new post*************************** */
/************************new post*************************** */
.recentPosts{
        height: 130px;
    }


</style>
