<template>
    <div class="blockPosts" v-for="postItem in posts" :key="postItem.postId">
        <div class="blockPosts__user">
            <div class="blockPosts__user__name">
                <img class="blockPosts__user__name__picture" src="@/assets/images/profilePicDefault.jpg" alt="">
                <h2 class="blockPosts__user__name__id">{{postItem.userId}}</h2>
            </div>
            <p class="blockPosts__date">{{ $filters.timeAgo(Date.now(postItem.created)) }}</p>

        </div>
        <p v-if="postItem.content" class="blockPosts__content">{{postItem.content}}</p>
        <img v-if="postItem.imageUrl" class="blockPosts__image" :src="postItem.imageUrl" alt="post photo">
        <div class="blockPosts__review">
            <div class="blockPosts__review__left">
                <span class="blockPosts__review__left__icon">
                    <font-awesome-icon :icon="['far', 'heart']" v-if="like == 0"/>
                    <font-awesome-icon icon="heart" v-else/>
                    {{ like }}
                     <!-- {{ postItem.likes }} -->
                </span>
                
                <span class="blockPosts__review__left__icon">
                    <font-awesome-icon :icon="['far', 'comment']" v-if="comment == 0"/>
                    <font-awesome-icon icon="comment" v-else/>
                    {{ comment }}
                    <!-- {{postItem.comments}} -->
                </span>

            </div>
            <div class="blockPosts__review__right">
                <span class="blockPosts__review__right__icon" @click="increaseLikeCount"><font-awesome-icon :icon="['far', 'heart']" />like</span>
                <span class="blockPosts__review__right__icon" @click="increaseCommentCount"><font-awesome-icon :icon="['far', 'comment']" />comment</span>
            </div>
            
    </div>
    </div>
    
</template>


<script>
import { mapGetters, mapState } from 'vuex';
export default ({
    name: 'RecentPosts',
    mounted:
        function(){
            //const self = this;
            this.$store
                .dispatch('getPostsByDate')
                .then(() => {
                    
                    console.log("getPostsByDate dispatch done !")
                  
            });
            
        },
    computed: {
        ...mapState({
            posts: 'posts',
            like: 'like',
            comment: 'comment'
        }),
        ...mapGetters(['fullname'])
    },
    methods: {
        increaseLikeCount(){
            this.$store.commit('INCREMENT_LIKE_COUNT')
        },
        increaseCommentCount(){
            this.$store.commit('INCREMENT_COM_COUNT')
        }
    }
})
</script>

<style scoped lang="scss">
.blockPosts {
       // border: 2px solid #CCCCCC;
        margin: 50px auto;
        width: 500px;
        border-radius: 20px 20px 0 0;
       // height: 100px;
       // align-items: center;
      /* position: absolute;
        z-index: 3;*/
        &__user{
            margin: 0;  
            background-color: #efefef;      
            &__name{
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                margin: 0;
                text-align: left;
                height: 25px;;
                &__picture{
                width: 70px;
                height: 70px;
                margin: 5px;
                border-radius: 50px;
                border: 0.5px solid #999999;
                }
                &__id {
                text-align: left; 
                margin: 0;
                }
            }
        }
        &__date{
            background-color: grey;
            height: 35px;
            font-size: 0.7rem;
            text-align: left;
            padding: 5px 80px;
            border-radius: 20px 20px 0 0 ;
        }
        &__content{
            background-color: white;
            border: 1px solid grey;
            padding: 10px;
            text-align: left;
            
        }
        &__image{
            width: 100%;
            margin: 0 auto;
        }
        &__review {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            
            }
        }
    

.svg-inline--fa {
        color: grey;
        font-size: 1.2rem;
    }
    
</style>