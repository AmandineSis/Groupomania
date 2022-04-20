<template>
    <div class="posts" v-for="(postItem) in posts" :key="postItem.postId">
        
        <div class="posts__user"  >
            <div class="posts__user__name">
                <img class="posts__user__name__picture" src="@/assets/images/profilePicDefault.jpg" alt="">
                <h2 class="posts__user__name__id">{{postItem.firstName}} {{postItem.lastName}}</h2>
            </div>
            <p class="posts__date">{{postItem.created}}</p>

        </div>

        <p class="posts__content" v-if="postItem.content" >{{postItem.content}}</p>
        
        <img class="posts__image" v-if="postItem.imageUrl" :src="postItem.imageUrl" alt="post photo">
        
        <div class="posts__review">
            <div class="posts__review__block">
                    <div class="posts__review__block__left">
                        <span class="posts__review__block__left__icon">
                            <font-awesome-icon :icon="['far', 'heart']" v-if="like == 0"/>
                            <font-awesome-icon icon="heart" class="posts__review__block__left__icon__full" v-else/>
                            {{ like }}
                             <!-- {{ postItem.likes }} -->
                        </span>
                        <span class="posts__review__block__left__icon">
                            <font-awesome-icon :icon="['far', 'comment']" v-if="comment == 0"/>
                            <font-awesome-icon icon="comment" class="posts__review__block__left__icon__full" v-else/>
                            {{ comment }}
                            <!-- {{postItem.comments}} -->
                        </span>

                    </div>
                    <div class="posts__review__block__right">
                        <span class="posts__review__block__right__icon" @click="likePost"><font-awesome-icon :icon="['far', 'heart']" />like</span>
                        <span class="posts__review__block__right__icon" @click="addComment"><font-awesome-icon :icon="['far', 'comment']" />comment</span>
                    </div>            
            </div>
            <!-- -------------------------COMMENT COMPONENT---------------------------------------------------- -->

            <div class="posts__review__comments" v-if="showComment">
                <form class="form__comments">
                    <textarea 
                        class="form__comments__input"
                        rows ="1" 
                        v-model="event.comment"
                        name ="newComment"
                        placeholder = "Ajoutez un commentaire...">
                    </textarea> 
                </form>       
                <div class="recentComments">
                    comments...
                </div> 
            </div>    

            <!-- -------------------------/COMMENT COMPONENT---------------------------------------------------- -->
        </div>
    </div>
    
</template>

<script>
import { mapGetters, mapState } from 'vuex';
export default ({
    name: 'RecentPosts',
    data(){
        return {
            showComment: false,
            event:{
                like: false,
                comment:""
            }
        }
    },
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
      /*  getPost(index) {
            return this.$store.getters.getPostById(index)
        },*/
        
        ...mapState({
            posts: 'posts',
            like: 'like',
            comment: 'comment'
        }),
        ...mapGetters({
            fullname: 'fullname',
        })
    },
    methods: {
     /*   likePost(){
            !this.event.like;
            console.log(this.event.like);
        },
        addComment(){
            
        }*/
    }
})
</script>

<style scoped lang="scss">
.posts {
        margin: 50px auto;
        width: 500px;
        border-radius: 20px 20px 0 0;
        &__user{
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
            margin: 0;
        }
        &__content{
            background-color: white;
            border: 1px solid grey;
            padding: 10px;
            text-align: left;
            margin: 0;
        }
        &__image{
            width: 100%;
            margin: 0 auto;
        }
        &__review {
            display: flex;
            flex-direction: column;
            padding: 5px 0;
            &__block {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                margin: 0;
                &__left {
                    margin: 0;
                    &__icon{
                    margin: 0 5px;
                    color: grey;
                    font-size: 1.2rem;
                        &__full{
                            color: #ee7575;
                        }
                    }
                }
                &__right {
                    margin: 0;
                    &__icon {
                        margin: 0 5px;
                    }
                }
            }
            &__comments {
                    padding: 10px 0;
                    background-color: #D9D9D9;
                    margin: 0px auto;
                    width: 500px;
                    height: 100px;
                    align-items: center;
                    border-radius: 0 0 20px 20px;
            }    
        }
    }

.form__comments {

     /*   margin: 30px auto;
        width: 500px;
        height: 100px;
        align-items: center;
        border-radius: 20px;*/
        &__input {
            width:90%;
            height:  30px;
            background-color: white;
            border: 2px solid #999999;
            resize: none;
            border-radius: 20px;
            padding: 5px 15px;
            background-color: white;
            display: inline-block;
            white-space: normal;
            color: grey;
        }
}


    
</style>