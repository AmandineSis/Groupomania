<!------------------------------------------------------------------------------------>
<!--                 COMPOSANT LOGOUT/SETTINGS/RECHERCHE                            -->
<!------------------------------------------------------------------------------------>

<template>
    <ul class="settings__list">
        <!-----------Logout--------------->
        <li class="settings__list__item">
            <router-link to="/">
                <font-awesome-icon class="settings__icon" icon="sign-out-alt"  @click="logoutUser"/>
            </router-link>
        </li>
        <!---------UpdateMenu toggle--------------->
        <li class="settings__list__item">
            <font-awesome-icon class="settings__icon" icon="gear" @click="showUpdate"/>
        </li>
        <!---------SearchUser--------------->
        <li class="settings__list__item">
            <font-awesome-icon class="settings__icon" icon="magnifying-glass" @click="showSearchBar"/>
            
            <transition name="grow">
                <!---------champ de recherche utilisateur--------------->
                <form  v-if="searchBarIsActive" method="POST"> 
                    <div class="settings__searchForm" >  
                        <BaseInput 
                            class="settings__searchForm__input" 
                            v-model="event.userSearch"
                            type="search" 
                            name="user" 
                            label="Rechercher..."
                            @keyup="getSearchResults"
                            @blur="closeSearch"
                            />
                        <font-awesome-icon class="settings__searchForm__input__delete" icon="xmark" @click="deleteSearch" />
                    </div>

                    <!---------Résultat de la recherche --------------->
                    <div class="settings__searchForm__results" v-if="searchResults && event.userSearch != ''">
                        <div class="result" v-for="result in searchResults" :key="result.userId" >
                            <router-link  class="result__link" :to="{ name: 'Profile', params: { userId: result.userId }}" :key="$route.params">
                                <img class="result__image" :src="result.profilePicUrl" alt="profile picture"/>
                                <p class="result__name">{{ result.firstName }} {{ result.lastName }}</p>
                            </router-link>
                        </div>
                    </div>
                </form>
            </transition>    
        </li>
    </ul>
</template>

<script>
//composant
import BaseInput from '@/components/Base/BaseInput.vue'

//store et mixins
import { mapState, mapActions, mapMutations  } from 'vuex';

export default {
    name: 'SettingsMenuu',
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
        }),
        ...mapState('toggle',{
            searchBarIsActive: 'searchBarIsActive'
        })
    },
    methods: {
        ...mapActions(['searchUser']),
        ...mapMutations(['LOG_OUT', 'CLEAR_SEARCH']),
        ...mapMutations('toggle',['UPDATE_MENU_TOGGLE','SEARCH_BAR_TOGGLE', 'DELETE_USER_CLOSE']),

        logoutUser(){
            this.LOG_OUT();
            this.$router.push('/');
        },
        //toggle visibilité d'updateMenu et barre de recherche
        showUpdate(){
                this.UPDATE_MENU_TOGGLE()
                this.DELETE_USER_CLOSE()
            },
        showSearchBar(){
                this.SEARCH_BAR_TOGGLE()
                },
        
        //User search
        getSearchResults(){
            let nameSearched = this.event.userSearch;
            this.searchUser({indexName: nameSearched})
                .then(() => {
                    console.log('searchUser dispatch done !')
                })
        },
        closeSearch(){
            this.CLEAR_SEARCH()
            this.event.userSearch = "";
            this.SEARCH_BAR_TOGGLE()
        },
        deleteSearch(){
            this.CLEAR_SEARCH()
            console.log('CLEAR_SEARCH dispatch done !')
            this.event.userSearch = "";
        }
    }
}
</script>

<style scoped lang="scss">

.settings{
    &__list {
        display: flex;
        flex-direction: row;
        justify-content: left;
        align-items: top;
        margin-left: 15px;
        &__item {
            display: flex;
            flex-direction: row;
            margin: 0 10px;
            height: 18px;
        }   
    }
    &__icon{
        color: white;
        font-size: 1.2rem;
        transform: scale(1);
        transition: transform 200ms;
        &:hover {
            transform: scale(1.2);
            cursor: pointer;
        }
    }
    &__searchForm{
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: 7px;
        position: absolute;
        &__input {
            width: 140px;
            margin: 0 ;
            padding-left: 7px;
            border: 2px #F2F2F2 solid;
            border-radius: 20px;
            &__delete{
                position: relative;
                left: -15px;
                color: grey;
            }
        }
        &__results{
            position: relative;
            width: 190px;
            height: 100px;
            top: 30px;
            z-index: 99;
        }
    }
}
/**********SEARCHBAR ANIMATION********* */  
.grow-enter-active {
    animation: bounce-in .8s ease;
}
.grow-leave-active {
    animation: bounce-in .8s ease reverse;
}

@keyframes bounce-in {
    0% {
        transform: scale(0);
        width: 0;
    }
    70% {
        transform: scale(1.05);
        width: 50px;
    }
    100% {
        transform: scale(1);
        width: 140px;
    }
}
/********SEARCH RESULTS****** */ 
.result{
    border: 1px solid #dbdbdb;
    background-color: white;
    &:hover {
        background-color: #dbdbdb;
    }
    &__link{
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    &__image{
        object-fit: cover;
        height: 45px;
        width: 45px;
        margin: 10px;
        border-radius: 100%;
    }
    &__name{
        margin: 0;
    }
}
</style>
