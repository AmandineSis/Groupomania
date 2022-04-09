<template>
  <TheHeader/>
  <router-view/>
</template>

<script>
import TheHeader from '@/components/Base/TheHeader.vue'

export default ({
  components: {
    TheHeader
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
    src: url(@/assets/fonts/Roboto-Bold.ttf);
}
/******************************* */
</style>
