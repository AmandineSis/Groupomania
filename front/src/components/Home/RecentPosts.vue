<template>
    <div class="BlockPosts" v-for="postItem in posts" :key="postItem.postId">
        <div class="BlockPosts__user">
            <img class="BlockPosts__user__picture" src="@/assets/images/profilePicDefault.jpg" alt="">
            <div class="BlockPosts__user__name">
                <h2>{{postItem.userId}}</h2>
                <p>{{postItem.created}}</p>
            </div>
        </div>
        <div class="BlockPosts__content">
            <p>{{postItem.content}}</p>
        </div>
        <img class="BlockPosts__image" :src="postItem.imageUrl" alt="post photo">
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
    }
})
</script>

<style scoped lang="scss">
.BlockPosts {
        border: 2px solid #999999;
        background-color: white;
        margin: 30px auto;
        width: 500px;
       // height: 100px;
        align-items: center;
        border-radius: 20px 20px 0 0;
      /* position: absolute;
        z-index: 3;*/
        &__user{
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            &__picture{
                width: 90px;
                height: 90px;
                margin: 5px;
                border-radius: 50px;
                border: 2px solid #999999;
            }
            &__name{
                margin: 20px 0;
                text-align: left;;
            }
        }
        &__content{
            margin: 20px 10px;
        }
        &__image{
            width: 100%;
            margin: 0 auto;
        }
    }


    
</style>