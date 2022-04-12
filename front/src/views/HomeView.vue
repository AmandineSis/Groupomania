<template>
  <div class="topBar">
    <nav class="topBar__nav">
        <ul class="topBar__nav__list">
            <li class="topBar__nav__list__item"><router-link to="/"><font-awesome-icon icon="sign-out-alt" /></router-link></li>
            <li class="topBar__nav__list__item"><font-awesome-icon icon="gear" @click="showSettings"/></li>
            <li class="topBar__nav__list__item"><font-awesome-icon icon="magnifying-glass" @click="showSearchBar" />
                <form v-if="search" method="POST">   
                    <p>
                        <input class="animated fadeInLeft search__entryField" type="search" name="user" placeholder="Rechercher..."/>
                    </p>
                </form>
            </li>
        </ul>
    </nav>
    <div class="userProfile" >
        <!-- <router-link class="link" :to="{ name: 'Profile', params: { userId: status.user.userId } }"> -->
            <p class="userProfile__fullname" >{{ fullname }}</p> 
            <img class="userProfile__picture" :src="user.profilePicUrl" alt="photo de profil">
        <!-- </router-link> -->
    </div>
  </div> 
  <div class="settingsBlock" v-if="settings">Settings</div>

  <NewPost/>   
  <div class="BlockPosts" v-for="postItem in posts" :key="postItem">
        <p class="BlockPosts__content">{{postItem.content}}</p>
        <img class="BlockPosts__image" :src="postItem.imageUrl" alt="photo de profil">


    </div>
     
</template>

<script>
import { mapState } from 'vuex';
import NewPost from '@/components/Home/NewPost.vue'


export default {
    name: 'HomeView',
    components : {
        NewPost
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
            this.$store
                .dispatch('getUser')
                .then(() => {
                    console.log("getUSer dispatch done !")
            });
            this.$store
                .dispatch('getPostsByDate')
                .then(() => {
                    console.log("getPostsByDate dispatch done !")
            });
            
        },
    
    computed: {
        fullname(){
            return this.$store.state.userInfos.firstName + ' ' + this.$store.state.userInfos.lastName;
        },
        ...mapState({
            status: 'status',
            user: 'userInfos',
            posts: 'posts'
    })
  },
  methods: {
    logout() {
      this.$store.commit('logout');
      this.$router.push('/');
    },
    showSearchBar(){
                this.search=!this.search;
                },
            showSettings(){
                this.settings=!this.settings;
            }
  }
}
</script>

<style scoped lang="scss">

/********************** TOPNAV ****************** */
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
        &__nav {
            width: 50%;
            margin-left: 15px;
            &__list {
                display: flex;
                flex-direction: row;
                justify-content: left;
                align-items: top;
                &__item {
                    display: flex;
                    flex-direction: row;
                    justify-content: left;
                    margin: 0 10px;
                    height: 18px;
                }
            }
        }
    }
    .svg-inline--fa {
        color: white;
        font-size: 1.2rem;
    }
    .search__entryField {
        margin: 0 10px;
        padding-left: 7px;
        border: 2px #F2F2F2 solid;
        border-radius: 20px;
        animation: slide-right 1s ;
    }

    @keyframes slide-right {
    from{transform: translateX(0)}
    to{transform: translateX(1)} 
    }
   
/*************************************************** */    

/***************** userProfile ********************* */
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
/**********************Post block ******************************** */
.BlockPosts {
        border: 2px solid #999999;
        background-color: white;
        margin: 30px auto;
        width: 500px;
        //height: 100px;
        align-items: center;
        border-radius: 20px 20px 0 0;
      /* position: absolute;
        z-index: 3;*/
        &__content{
            margin: 20px 10px;
        }
        &__image{
            width: 100%;
            margin: 0 auto;
        }
    }


/*************************************************** */
</style>
