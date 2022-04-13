<template>
    <div class="BlockPosts" v-for="postItem in posts" :key="postItem.postId">
         <p class="BlockPosts__content">{{postItem.content}}</p>
        <img class="BlockPosts__image" :src="postItem.imageUrl" alt="photo de profil">



    </div>
</template>


<script>
import { mapGetters, mapState } from 'vuex';
export default ({
    name: 'RecentPosts',
   mounted:
        function(){
            this.$store
                .dispatch('getPostsByDate')
                .then(() => {
                    console.log("getPostsByDate dispatch done !")
            });
            
        },
    
    computed: {
        ...mapState({
            posts: 'posts'
        }),
        ...mapGetters(['fullname'])
  },
})
</script>

<style scoped lang="scss">
.BlockPosts {
        border: 2px solid #999999;
        background-color: white;
        margin: 30px auto;
        width: 500px;
        //height: 100px;
        align-items: center;
        border-radius: 20px 20px 0 0;
      /* position: absolute;
        z-index: 3;*/
        &__content{
            margin: 20px 10px;
        }
        &__image{
            width: 100%;
            margin: 0 auto;
        }
    }


    
</style>