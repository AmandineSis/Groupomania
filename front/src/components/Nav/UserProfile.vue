
<!--COMPOSANT AFFICHAGE NOM ET PHOTO DE L'UTILISATEUR-->

<template>
    <!-- UserProfile sur page d'accueil -->
    <div class="userProfile" v-if="!profileView && mq.current !== 'phone'" >
        <router-link class="userProfile__link" :to="`/profile/${userLoggedIn.userId}`">
            <p class="userProfile__fullname">{{ fullNameUserLoggedIn }}</p> 
            <img class="userProfile__picture" :src="userLoggedIn.profilePicUrl" alt="photo de profil">
        </router-link>
    </div>
    <router-link :to="`/profile/${userLoggedIn.userId}`" class="userProfile" :class="{'userProfile--inBlock' : mq.current=='phone'}" v-if="mq.current=='phone'" >  
            <p class="userProfile__fullname" :class="{'userProfile__fullname--black' : mq.current=='phone'}" >{{ fullNameUserLoggedIn }}</p> 
            <img class="userProfile__picture" :class="{'userProfile__picture--sizeUp' : mq.current=='phone'}" :src="userLoggedIn.profilePicUrl" alt="photo de profil" >
    </router-link>

    <!-- UserProfile sur page profil -->
    <div class="userProfile" :class="{'userProfile--inBlock' : profileView}" v-else >  
            <p class="userProfile__fullname" :class="{'userProfile__fullname--black' : profileView}" v-if="profileView && $route.params.userId == userLoggedIn.userId">{{ fullNameUserLoggedIn }}</p> 
            <p class="userProfile__fullname" :class="{'userProfile__fullname--black' : profileView}" v-if="profileView && $route.params.userId != userLoggedIn.userId">{{ fullNameUser }}</p> 
            
            <img class="userProfile__picture" :class="{'userProfile__picture--sizeUp' : profileView}" :src="userLoggedIn.profilePicUrl" alt="photo de profil" v-if="profileView && $route.params.userId == userLoggedIn.userId">
            <img class="userProfile__picture" :class="{'userProfile__picture--sizeUp' : profileView}" :src="userInfos.profilePicUrl" alt="photo de profil" v-if="profileView && $route.params.userId != userLoggedIn.userId">
    </div>
</template>

<script>
////store et mixins
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
    //ajout de mediaqueries
    inject: ["mq"],
    name: 'UserProfile',
    //Props from profileView.vue
    props: {
        profileView: Boolean,
    },
    beforeMount:
        function(){
            if(!this.profileView){
                this.getUserLoggedIn()
                    .then(() => {
                        console.log("getUserLoggedIn dispatch done !")
                    });
            }else{
                const userId = this.$route.params.userId;
                this.getUser(userId)
                    .then(() => {
                        console.log("getUSer dispatch done !")
                });
            }
        },
    computed: {
        ...mapState({
            status: 'status',
            user: 'user',
            userLoggedIn: 'userLoggedIn',
            userInfos: 'userInfos',
        }),
        ...mapGetters(['fullNameUserLoggedIn','fullNameUser'])
    },
    methods: {
        ...mapActions(['getUserLoggedIn', 'getUser'])
    }
}
</script>

<style scoped lang="scss">

/********************** userProfile ************************** */

.userProfile {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: absolute;
    top: -29px;
    right: 20px;
    z-index: 1000;
    &__link{
        display: flex;
        flex-direction: row;
        align-items: center;
        transform: scale(1);
        transition: transform 200ms;
        &:hover {
            transform: scale(1.1);
            cursor: pointer;
        }
    }
    &--inBlock{
        flex-direction: column-reverse;
        margin: 20px 0 0 0;
        padding-bottom: 0;
        position: static;
        z-index: 0;
        top: 0;
        right: 0;
        
    }
    &__fullname {
        margin: 0 10px;
        font-family: 'RobotoBold';
        color: white;
        
        &--black{
            margin: 20px 10px;
            font-size: 1.5em;
            color: black;
        }
    }
    &__picture {
        width: 90px;
        height: 90px;
        border-radius: 50px;
        border: 2px solid #999999;
        object-fit: cover;
        box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
        &--sizeUp{
            width: 145px;
            height: 145px;
            border-radius: 90px;
        }
    }
}
</style>
