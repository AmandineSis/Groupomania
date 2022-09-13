<template>
    <header class="mainHeader" :class="{'mainHeader--small': mq.current=='phone'}" v-once>
        <img class="mainHeader__logo--small" alt="logo groupomania" src="@/assets/images/logo_text.png" v-if="mq.current == 'phone'">
        <img class="mainHeader__logo" alt="logo groupomania" src="@/assets/images/logo.png" v-else>
        
    </header>
</template>

<script>
export default {
     //ajout de mediaqueries
    inject: ["mq"],
    name: 'MainHeader'
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .mainHeader {
        width: 100%;
        height: 120px;
        background-color: #4E5166;
        position: relative;
        z-index: -10;
       &--small{
        height: 60px;
       }
        &__logo {
        width: 275px;
        height: 275px;
        display: flex;
        margin-top: -100px;
        position: absolute;
        margin-left: 20px;
        position: absolute;
        z-index: -1;
         &--small{
            height: 25px;
            margin-top : 20px;

        }
        }
    
    }


</style>