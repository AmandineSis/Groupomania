<template>
    <div class="posts" v-for="postItem in posts" :key="postItem.postId">
        
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
                            <font-awesome-icon :icon="['far', 'heart']" v-if="postItem.likes == 0"/>
                            <font-awesome-icon icon="heart" class="posts__review__block__left__icon__full" v-else/>
                            {{ postItem.likes }} 
                        </span>
                        <span class="posts__review__block__left__icon">
                            <font-awesome-icon :icon="['far', 'comment']" v-if="postItem.comments == '' "/>
                            <font-awesome-icon icon="comment" class="posts__review__block__left__icon__full" v-else/>
                            {{postItem.comments}}
                        </span>

                    </div>
                    <div class="posts__review__block__right">
                        <span class="posts__review__block__right__icon" @click="likePost(postItem.postId)"><font-awesome-icon :icon="['far', 'heart']" />like</span>
                        <span class="posts__review__block__right__icon" @click="displayComment(postItem.postId)"><font-awesome-icon :icon="['far', 'comment']" />comment</span>
                    </div>            
            </div>

            <div class="posts__review__comments" >
                
                <PostComments postId="postItem.postId"/>

                <div class="recentComments">
                    comments...
                </div> 
            
            </div>    

           
        </div>
    </div>
    
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import PostComments from '@/components/Home/PostComments.vue'

export default ({
    name: 'RecentPosts',
    components: {
            PostComments
    },
    data(){
        return {
            commentSection: false,
            comment:''
        }
    },
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
            posts: 'posts',
        }),
        ...mapGetters({
            fullname: 'fullname',
        })
    },
    methods: {
        likePost(postId){
            //toggle like value between 0 and 1
            this.likes = !this.likes;
            //création du corps de la requête => (userId, like)
            const postLike = {
                postId,
                like: this.likes
            };
            //envoie requête vers store - requête LikePost
            this.$store
                .dispatch('likePost', postLike)
                .then((res) => {
                    console.log(res)
                    console.log("likePost dispatch done !")
                    //recentPosts refreshed
                    this.$store
                            .dispatch('getPostsByDate')
                            .then(() => {
                                console.log("getPostsByDate dispatch done !")
                            });
                })
        },
        //toggle visibility of comment section
        displayComment(postId){
            this.commentSection = !this.commentSection;
            console.log(postId);
        }
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

</style>