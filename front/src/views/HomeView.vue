<template>
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
  }
}
</script>

<style scoped lang="scss">

p {
  color: black;
}

</style>
