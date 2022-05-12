<template>
        <nav class="topBar__nav">
            <ul class="topBar__nav__list">
                <li class="topBar__nav__list__item"><router-link to="/"><font-awesome-icon icon="sign-out-alt"  @click="logoutUser"/></router-link></li>
                <li class="topBar__nav__list__item"><font-awesome-icon icon="gear" @click="showSettings"/></li>
                <li class="topBar__nav__list__item"><font-awesome-icon icon="magnifying-glass" @click="showSearchBar" />
                    <form v-if="search" method="POST"> 
                        <div class="search">  
                            <p>
                                <BaseInput 
                                    class="search__entryField" 
                                    v-model="event.userSearch"
                                    type="search" 
                                    name="user" 
                                    label="Rechercher..."
                                    @keyup="searchUser"
                                    @blur="stopSearch"
                                    @click="stopSearch"
                                    />
                            </p>
                            <font-awesome-icon class="search__entryField__delete" icon="xmark" @click="deleteSearch" />
                        </div>
                        <div class="results">
                            <div v-for="result in searchResults" :key="result.id" class="result">
                                <router-link :to="`/profile/${result.userId}`">
                                <img class="imgSearch" :src="result.profilePicUrl" alt="profile picture"/>
                                <span class="nameSearch">{{ result.firstName }} {{ result.lastName }}</span>
                                </router-link>
                            </div>
                        </div>
                    </form>
                </li>
            </ul>
        </nav>
</template>

<script>
import BaseInput from '@/components/Base/BaseInput.vue'
import { mapState } from 'vuex';
export default {
    name: 'TopBar',
    components: {
        BaseInput
    },
    data(){
        return{
            search: false,
            settings: false,
            event:{
                userSearch:''
            }
        }
    },
    computed: {
        ...mapState({
            searchResults: 'searchResults'
        })
    },
    methods: {
        logoutUser(){
            this.$store.commit('logout');
            this.$router.push('/');
        },
        showSearchBar(){
                this.search=!this.search;
                },
        showSettings(){
                this.$emit('show-settings');
            },
        searchUser(){
            let nameSearched = this.event.userSearch;
            this.$store
                .dispatch('searchUser', {indexName: nameSearched})
                .then((res) => {
                    console.log(res);
                    console.log('searchUser dispatch done !')
                })
        },
        stopSearch(){
            console.log("search stopped");
           
            this.event.userSearch = "";
        },
        deleteSearch(){
            this.event.userSearch = ""
        }
  }
}
</script>

<style scoped lang="scss">

/************************** TOPNAV ******************* */
p {
  color: black;
}

.topBar__nav {
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
    
    .svg-inline--fa {
        color: white;
        font-size: 1.2rem;
    }
    .search{
        display: flex;
        flex-direction: row;
        align-items: center;
      
        margin-left: 7px;
        
        &__entryField {
            width: 140px;
            margin: 0 ;
            padding-left: 7px;
            border: 2px #F2F2F2 solid;
            border-radius: 20px;
            //animation: slide-right 1000ms cubic-bezier(.32,0,.07,1) ;
            &__delete{
                margin: 0 5px;
            }
    }
    }
    .results{
        position: absolute;
        width: 221px;
        height: 100px;
    }
    .result{
        display: flex;
        flex-direction: row;
        width: 221px;
  border: 1px solid #dbdbdb;
  background-color: white;
  &:hover {
    background-color: #90b3d6;
  }
    }
    .imgSearch{
        object-fit: cover;
  height: 45px;
  width: 45px;
  margin: 10px;
  border-radius: 100%;
    }

   /* @keyframes slide-right {
    from { //transform: scaleX(0); 
            transform: translateX(0);
           opacity: 0;
        }
    to { //transform: scaleX(1);
    transform: translateX(1);
         opacity: 1 ;
        }
    }
*/

</style>
