<template>
        <div class="userProfile" >
            <!-- <router-link class="link" :to="{ name: 'Profile', params: { userId: status.user.userId } }"> -->
                <p class="userProfile__fullname" >{{ fullName }}</p> 
                <img class="userProfile__picture" :src="user.profilePicUrl" alt="photo de profil">
            <!-- </router-link> -->
        </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
    name: 'UserProfile',
    beforeCreate:
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
    }
}
</script>

<style scoped lang="scss">

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

</style>
