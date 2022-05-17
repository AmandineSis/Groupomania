<template>
    <header class="mainHeader" v-once>
         <img class="mainHeader__logo" alt="logo groupomania" src="@/assets/images/logo.png">
    </header>
</template>

<script>
export default {
  name: 'MainHeader'
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .mainHeader {
        width: 100%;
        height: 120px;
        background-color: #666666;
        position: relative;
        z-index: -10;
        &__logo {
        width: 275px;
        height: 275px;
        display: flex;
        margin-top: -100px;
        position: absolute;
        margin-left: 20px;
        position: absolute;
        z-index: -1;
        }
    
    }
</style>