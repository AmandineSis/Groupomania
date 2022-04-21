<template>
        <nav class="topBar__nav">
            <ul class="topBar__nav__list">
                <li class="topBar__nav__list__item"><router-link to="/"><font-awesome-icon icon="sign-out-alt"  @click="logoutUser"/></router-link></li>
                <li class="topBar__nav__list__item"><font-awesome-icon icon="gear" @click="showSettings"/></li>
                <li class="topBar__nav__list__item"><font-awesome-icon icon="magnifying-glass" @click="showSearchBar" />
                    <form v-if="search" method="POST">   
                        <p>
                            <input class="search__entryField" type="search" name="user" placeholder="Rechercher..."/>
                        </p>
                    </form>
                </li>
            </ul>
        </nav>
</template>

<script>

export default {
    name: 'TopBar',
    
    data(){
        return{
            search: false,
            settings: false,
        
        }
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
    .search__entryField {
        width: 140px;
        margin: 0 10px;
        padding-left: 7px;
        border: 2px #F2F2F2 solid;
        border-radius: 20px;
        //animation: slide-right 1000ms cubic-bezier(.32,0,.07,1) ;
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
