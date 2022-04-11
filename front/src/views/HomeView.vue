<template>
    <nav class="topBar" >
        <ul>
            <li><router-link to="/"><font-awesome-icon icon="sign-out-alt" /></router-link></li>
            <li><font-awesome-icon icon="gear" @click="showSettings"/></li>
            <li><font-awesome-icon icon="magnifying-glass" @click="showSearchBar" />
                <form v-if="search" method="POST">   
                    <p>
                        <input class="search_entryField" type="search" name="user" placeholder="Rechercher..."/>
                    </p>
                </form>
            </li>
        </ul>
    </nav>
    <div v-if="settings">Settings</div>
    <div class="home__card">
      <p>{{ user.firstName }}</p>
      <p>{{ user.lastName }}</p>
      <p>{{ user.email }}</p>
      <img :src="user.profilePicUrl" alt="user profile">
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'HomeView',
  data(){
        return{
            search: false,
            settings: false,
        
        }
  },
  mounted: function(){
    console.log(this.$store.state.user)
    //Si userId = -1, retour à la page de connexion
    if(this.$store.state.user.userId == -1){
      this.$router.push('/');
      return;
    }
    this.$store.dispatch('getUser');
    console.log(this.$store.state.userInfos.firstName)   
  },
  computed: {
    ...mapState({
      user: 'userInfos',
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

    nav {
       
        width: 50%;
     
        margin-left: 15px;
    }
    ul {
        display: flex;
        flex-direction: row;
        justify-content: left;
        align-items: top;
    
        }
    li {
        display: flex;
        flex-direction: row;
        justify-content: left;
        margin: 0 10px;
        height: 18px;
        
    }
   
    input {
        margin: 0 10px;
        padding-left: 7px;
        border: 2px #F2F2F2 solid;
        border-radius: 20px;
       // animation: slide-right 0.5s ;

    }
    .svg-inline--fa {
        color: white;
        font-size: 1.2rem;
    }
    @keyframes slide-right {
    from{transform: translateX(0px)}
    to{transform: translateX(70px)} 
    }
</style>
