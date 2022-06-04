<template>
<!---------------Reported posts style visible to moderator only---------------------------->
    <div class="posts"  :class="{'posts__reported' : postItem.report>=1 && user.moderator == 1 && selectedMode != 'reportedPosts'} ">

        <header class="posts__header"  >
            <!-----------------Link to user profilePage---------------->
            <router-link class="posts__header__user" :to="`/profile/${postItem.userId}`">
                <img class="posts__header__user__picture" :src="postItem.profilePicUrl" alt="profile picture">
                <h2 class="posts__header__user__id">{{postItem.firstName}} {{postItem.lastName}}</h2>
            </router-link>
            <!------------------------Settings------------------------->
            <div class="posts__header__settings">
                <p class="posts__header__settings__date" >
                    <span>Publié le {{ new Date(postItem.created).toLocaleString() }}</span>
                </p>
                <button class="posts__header__settings__nav" @click.stop="openPostSettings(postId)" >
                    <font-awesome-icon icon="ellipsis"  />
                </button>
            </div>
        </header>  

        <div class="posts__container" >
            <!--Update/Delete post  -->
            <div class="posts__content__update" v-if="showPostSettings && user.userId== postItem.userId || showPostSettings && user.moderator == 1" >
                <PostSettings 
                    :postItem="postItem" 
                    :thisPage="currentPage" 
                    @hide-post-settings="closeSettings"/>
            </div>
            <!----- Report post ----->
            <div class="posts__content__settings" v-if="showPostSettings && user.moderator == 0 && user.userId != postItem.userId" >
                <button class="posts__content__settings__button" @click="postReport(postItem.postId)" >
                    <span>Signaler</span>
                </button>
            </div>
            <!------ Post content ---->
            <div class="post__container" v-if="!showPostSettings || showPostSettings && user.moderator == 0 && user.userId!= postItem.userId || !showPostSettings && user.moderator == 1">
                <div class="posts__content" >
                    <p class="posts__content__text" v-if="postItem.content" >{{postItem.content}}</p>
                    <img 
                        class="posts__content__image" 
                        :src="postItem.imageUrl" 
                        alt="post photo"
                        v-if="postItem.imageUrl != undefined ">
                </div>

                <footer class="posts__footer">
                    <div class="posts__footer__top">
                        <span class="posts__footer__top__icon">
                            <font-awesome-icon :icon="['far', 'heart']" v-if="postItem.likes == 0"/>
                            <font-awesome-icon icon="heart" class="posts__footer__top__icon__full" v-else/>
                            {{ postItem.likes }} 
                        </span>
                        <span class="posts__footer__top__icon">
                            <font-awesome-icon :icon="['far', 'comment']" v-if="postItem.comments == '' "/>
                            <font-awesome-icon icon="comment" class="posts__footer__top__icon__full" v-else/>
                            {{postItem.comments}}
                        </span>
                    </div>

                    <div class="posts__footer__bottom">
                        <button class="posts__footer__bottom__icon" @click="addLikePost(postItem.postId)">
                            <font-awesome-icon class="posts__footer__bottom__icon__like" :icon="['far', 'heart']" />
                            like
                        </button>
                        <button class="posts__footer__bottom__icon" @click="displayComment(postItem.postId)">
                            <font-awesome-icon class="posts__footer__bottom__icon__comment" :icon="['far', 'comment']" />
                            comment
                        </button>
                    </div>            
                </footer>
                <div class="comment__container" v-if="showComment" >
                    <AddComment :postItem="postItem" /> 
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>

//Components import
import PostSettings from '@/components/Home/Posts/PostSettings.vue'
import AddComment from '@/components/Home/Comments/AddComment.vue'

//store and mixins import
import { mapState, mapGetters, mapActions  } from 'vuex';
import { homePostsMixin } from '@/mixins/homePostsMixin'
import { profilePostsMixin } from '@/mixins/profilePostsMixin'

export default ({
    name: 'PostItem',
     mixins: [
        homePostsMixin, 
        profilePostsMixin
    ],
    components: {
        PostSettings,
        AddComment
    },
    props: {
        postItem: Object,
        currentPage: String,
        selectedMode: String,
        commentsVisible: Boolean
    },
    data(){
        return {
            showPostSettings: false,
            showComment: false
        }
    },
    computed: {
        ...mapState({
            user: 'user',
        }),
        ...mapState('comments',{
            CommentItem: 'postComments'
        }),
        ...mapGetters({
            fullname: 'fullname',
        })
    },
    methods: {
        ...mapActions('posts',['likePost','deletePost','reportPost','removeReport']),
        ...mapActions('comments',['getComments']),
        //Toggle post settings
        openPostSettings(){
            this.showPostSettings=!this.showPostSettings
        },
        closeSettings(){
            this.showPostSettings = false;
        },
        addLikePost(postId){
            const postLike = {
                postId,
                like: 1
            };
            //Add/Remove like from post
            this.likePost(postLike)
                .then(() => {
                    console.log("likePost dispatch done !")
                    //PostItem refreshed
                    if(this.currentPage == "homePage"){
                        this.getAllRecentPosts();
                        this.getAllPopularPosts();
                        this.getAllReportedPosts();
                    //Reload posts components on profilePage
                    }else if(this.currentPage == "profilePage"){
                        const userId = this.$route.params.userId;
                        this.getPostsByUserId(userId);
                        this.getPopularPostsByUserId(userId);
                    }
                })
        },
        displayComment(postId){ 
            //toggle visibility of comment section         
            this.showComment= !this.showComment;
            if(this.showComment){
                this.getComments(postId)  
                .then(()=> {
                    console.log("getComments dispatch done !");
                })
                .catch((err) => {
                    console.log(err);
                })
            } else {
                return;
            }
        },
         /*********************************************************
         * *****************A modifier****************************
         *******************************************************/
        postReport(postId) {
            const postReported = {
                postId,
                report: 1
            };
            //envoie requête vers store - requête LikePost
            this.reportPost(postReported)
                .then(() => {
                    console.log("reportPost dispatch done !")
                    window.confirm('Vous avez signalé cette publication !')
                })
        },
            
    }
    
})
</script>

<style scoped lang="scss">
.posts {
    margin:  50px auto;
    border-radius: 20px 20px 0 0;
    &__reported{
        border: 3px solid #ee7575;
    }
    &__header{
        &__user{
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                margin: 0;
                text-align: left;
                height: 25px;
            &__picture{
                width: 70px;
                height: 70px;
                margin: 5px;
                border-radius: 50px;
                border: 0.5px solid #999999;
                object-fit: cover;
            }
            &__id {
                text-align: left; 
                margin: 0;
            }
        }
        &__settings{
            height: 35px;
            margin: 0;
            padding-top: 5px;
            border-radius: 20px 20px 0 0 ;
            background-color: #4E5166;
            font-size: 0.7rem;
            text-align: left;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            &__date{
                margin: 0 80px;
                color: #ffffff;
            }
            &__nav{
                color: #ffffff;
                background-color: #4E5166 ;
                font-size: 25px;
                height: 25px;
                margin-right: 15px;
                transform: scale(1);
                transition: transform 200ms;
                &:hover {
                    transform: scale(1.2);
                    cursor: pointer;
                }
            }
        }
    }
    &__container{
        position: relative;
    }
    &__content{
        height: auto;
        
        &__update{
            height: auto;
        }
        &__settings{
            position:absolute;
            left: 400px;
            top: 0;
            z-index: 99;
            width: 100px;
            margin: 0;
            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;;

            display: flex;
            flex-direction: column ;
            justify-content: center;
            &__button {
                padding: 10px 0;
                width: 100%;
            }
        }
        &__text{
            background-color:white;
            border: 0 1px 1px 1px solid grey;
            padding: 10px;
            text-align: left;
            margin: 0;
            word-wrap:break-word
        }
        &__image{
            width: 100%;
            margin: 0 auto;
        }
    }    
    &__footer{
        &__top{
            display: flex;
            flex-direction: row;
            background-color: white;
            padding: 5px 0;
            &__icon{
                margin: 0 5px;
                color: grey;
                font-size: 1.2rem;
                &__full{
                    color: #ee7575;
                }
            }
        }
        &__bottom  {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            background-color: white;
            padding:  0;
            border-top: 1px solid grey;
            &__icon{
                padding: 5px;
                color: grey;
                font-size: 1.2rem;
                width: 50%;
                height: 30px;
                &__like, &__comment {
                    padding-right: 5px;
                }
                &:hover {
                    background-color: #ee7575;
                    color: white;
                    cursor: pointer;
                    }
                    &__full{
                        color: #ee7575;
                    }
            }
        }
    }
}

.comment__container{
    border-radius: 0 0 20px 20px;
}
/***********POST SETTINGS ANIMATION********* */  
.bounce-enter-active {
    animation: bounce-in .8s;
}
.bounce-leave-active {
    animation: bounce-in .8s reverse;
}
@keyframes bounce-in {
    0% {
        transform: scale(0);
    }
    70% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}



</style>