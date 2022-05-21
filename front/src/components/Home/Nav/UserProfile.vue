<template>
        <div class="userProfile" v-if="!profileView" >
            <router-link class="userProfile__link" :to="`/profile/${userLoggedIn.userId}`">
                <p class="userProfile__fullname">{{ fullNameUserLoggedIn }}</p> 
                <img class="userProfile__picture" :src="userInfos.profilePicUrl" alt="photo de profil">
            </router-link>
        </div>
        
        <div class="userProfile" :class="{'userProfile--inBlock' : profileView}" v-else >
            <!-- <router-link class="link" :to="{ name: 'Profile', params: { userId: status.user.userId } }"> -->
                <p class="userProfile__fullname" :class="{'userProfile__fullname--black' : profileView}">{{ fullNameUser }}</p> 
                <img class="userProfile__picture" :class="{'userProfile__picture--sizeUp' : profileView}" :src="userInfos.profilePicUrl" alt="photo de profil">
            <!-- </router-link> -->
        </div>

</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
    name: 'UserProfile',
    props: {
        profileView: Boolean,
        posts: Object
    },
    data(){
        return{
        
        }
    },
    beforeMount:
        function(){
            if(!this.profileView){
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
            }else{
                const userId = this.$route.params.userId;
                this.$store
                    .dispatch('getUser', userId )
                    .then(() => {
                        console.log("getUSer dispatch done !")
                });
            }
        },
    
    computed: {
        ...mapState({
            status: 'status',
            userLoggedIn: 'userLoggedIn',
            userInfos: 'userInfos',
            
        }),
        ...mapGetters(['fullNameUserLoggedIn','fullNameUser'])
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
        margin: 20px 0;
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
        &--sizeUp{
            width: 145px;
            height: 145px;
            border-radius: 90px;
        }
    }
}
    
  /*  .link {
        display: flex;
        flex-direction: row;
        align-items: center;
    }*/

</style>
