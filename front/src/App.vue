<template>
  <MainHeader/>
  <router-view :key="$route.path"/>
</template>

<script>
import MainHeader from '@/components/Base/TheHeader.vue'

export default ({
  components: {
    MainHeader,
  }
})
</script>

<style lang="scss">

/*************FONTS************ */
@font-face {
    font-family: Roboto;
    src: url(@/assets/fonts/Roboto-Regular.ttf);
}

@font-face {
    font-family: RobotoThin;
    src: url(@/assets/fonts/Roboto-Thin.ttf);
}

@font-face {
    font-family: RobotoBold;
    src: url(./assets/fonts/Roboto-Bold.ttf);
}
@font-face {
    font-family: Lato;
    src: url(./assets/fonts/Lato-Regular.ttf);
}
@font-face {
    font-family: LatoBold;
    src: url(./assets/fonts/Lato-Bold.ttf);
}



/******************************* */
#app {
  max-width: 100%;
  height: 100%;
  font-family: Lato, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #4E5166;
}

</style>
