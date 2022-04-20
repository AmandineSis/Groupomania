<template>
    <div class="topBar" v-once>
        <TopBar @show-settings="openSettings"/>
        
        <div class="userProfile" >
            <!-- <router-link class="link" :to="{ name: 'Profile', params: { userId: status.user.userId } }"> -->
                <p class="userProfile__fullname" >{{ fullName }}</p> 
                <img class="userProfile__picture" :src="user.profilePicUrl" alt="photo de profil">
            <!-- </router-link> -->
        </div>
    </div> 

    
    <div class="settingsBlock" v-if="settings">
        Settings
    </div>

    <div class="newPost">
        <NewPost/>  
    </div>
       
    <div class="recentPosts">
        <RecentPosts/>   
    </div>

</template>

<script>
import { mapGetters, mapState } from 'vuex';
import NewPost from '@/components/Home/NewPost.vue'
import RecentPosts from '@/components/Home/RecentPosts.vue'
import TopBar from '@/components/Home/TopBar.vue'



export default {
    name: 'HomeView',
    components : {
        TopBar,
        NewPost,
        RecentPosts
      
    },
    data(){
        return{
            search: false,
            settings: false,
        
        }
    },
    mounted:
        function(){
            console.log(this.$store.state.user)
            //Si userId = -1, retour à la page de connexion
            if(this.$store.state.user.userId == -1){
                this.$router.push('/');
                return;
            }
            const userId = this.$store.state.user.userId;
            console.log(userId);
            this.$store
                .dispatch('getUser', userId )
                .then(() => {
                    console.log("getUSer dispatch done !")
            });
        },
    
    computed: {
        ...mapState({
            status: 'status',
            user: 'userInfos'
        }),
        ...mapGetters(['fullName'])
    },
    methods: {
        logout() {
            this.$store.commit('logout');
            this.$router.push('/');
        },
        displaySearch(){
                console.log("click ok !")
                },
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
    
    
/********************** userProfile ************************** */

.userProfile {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 20px;
    &__fullname {
        margin: 0 10px;
        font-family: 'RobotoBold';
        color: white;
    }
    &__picture {
        width: 90px;
        height: 90px;
        border-radius: 50px;
        border: 2px solid #999999;
    }
}
    
  /*  .link {
        display: flex;
        flex-direction: row;
        align-items: center;
    }*/

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
