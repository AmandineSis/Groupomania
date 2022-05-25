<template>
<!---------------Affichage des publications signalées pour le moderateur uniquement---------------------------->
    <div class="posts"  :class="{'posts__reported' : postItem.report>=1 && user.moderator == 1 && selectedMode != 'reportedPosts'} ">
        <header class="posts__header"  >
            <router-link class="posts__header__user" :to="`/profile/${postItem.userId}`">
                <img class="posts__header__user__picture" :src="postItem.profilePicUrl" alt="profile picture">
                <h2 class="posts__header__user__id">{{postItem.firstName}} {{postItem.lastName}}</h2>
            </router-link>
            
            <div class="posts__header__settings">
                <p class="posts__header__settings__date" > <span>Publié le {{ new Date(postItem.created).toLocaleString() }}</span></p>
                <button class="posts__header__settings__nav" @click.stop="openPostSettings(postId)" >
                    <font-awesome-icon icon="ellipsis"  />
                </button>
            </div>
        </header>  
        <div class="posts__container">
            <!--Modification/suprression de la publication -->
            <div class="posts__content__update" v-if="showPostSettings && user.userId== postItem.userId" >
                <PostSettings :postItem="postItem" @hide-post-settings="closeSettings"/>
            </div>
            <!--Signalement de la publication -->
            <div class="posts__content__settings" v-if="showPostSettings && user.moderator == 0 && user.userId!= postItem.userId" >
                <button class="posts__content__settings__button" @click="postReport(postItem.postId)" >
                    <span v-if="isReported==1 ">Déjà signalé</span>
                    <span v-else>Signaler</span>
                </button>
            </div>
            <!--suprression de la publication/suppression du signalement -->
            <div class="posts__content__settings" v-if="showPostSettings && user.moderator == 1" >
                <button class="posts__content__settings__button" v-if=" user.moderator == 1 || user.userId== postItem.userId" @click="postDelete(postItem.postId)" >
                supprimer
                </button>
            </div>
            <!--contenu de lapublication -->
            <div class="post__container" v-if="!showPostSettings || showPostSettings && user.moderator == 0 && user.userId!= postItem.userId || showPostSettings && user.moderator == 1">
                <div class="posts__content" >
                    <p class="posts__content__text" v-if="postItem.content" >{{postItem.content}}</p>
                    <img class="posts__content__image" v-if="postItem.imageUrl != undefined " :src="postItem.imageUrl" alt="post photo">
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
                <div class="comment__container" v-if="showComment">
                    <PostComments :postItem="postItem"/> 
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
import { mapState, mapGetters, mapActions  } from 'vuex';
import PostSettings from '@/components/Home/Posts/PostSettings.vue'
import PostComments from '@/components/Home/Comments/PostComments.vue'

export default ({
    name: 'RecentPosts',
    components: {
        PostSettings,
        PostComments
    },
    props: {
        'postItem': Object,
        'selectedMode': String
    },
    data(){
        return {
            showPostSettings: false,
            showComment: false,
            
            likes: '',
            isLiked: '',
            //postId:'',
            //comments: []
        }
    },
    
    computed: {
        ...mapState({
            user: 'user',
           // userInfos: 'userInfos',
           // posts: 'posts',
            //postComments: 'postComments'
        }),
        ...mapGetters({
            fullname: 'fullname',
        })
    },
    methods: {
        ...mapActions('posts',['likePost','getPostsByDate','getCommentsByPostId','deletePost','reportPost']),
        //Toggle post settings
        openPostSettings(){
            this.showPostSettings=!this.showPostSettings
        },
        closeSettings(){
            this.showPostSettings = false;
        },
        
        addLikePost(postId){
            //toggle like value between 0 and 1
            this.isLiked = !this.isLiked;
            
            if( this.isLiked == true){
                this.likes= 1;
            }else{
                this.likes = 0;
            }
            const postLike = {
                postId,
                like: this.likes
            };
            //envoie requête LikePost et reload des publications
            this.likePost(postLike)
                .then(() => {
                    console.log("likePost dispatch done !")
                    //recentPosts refreshed
                    this.getPostsByDate()
                            .then(() => {
                                console.log("getPostsByDate dispatch done !")
                            });
                })
        },
        displayComment(postId){ 
            //toggle visibility of comment section         
            this.showComment= !this.showComment;
            
            if(this.showComment==true){
                this.getCommentsByPostId(postId)
                    .then(() => {
                        console.log("getCommentsByPostId dispatch done !");
                    });
            }else{
                return;
            }
            
        },
        postReport(postId) {
            //toggle like value between 0 and 1
            this.isReported = !this.isReported;
            if( this.isReported == true ){
                this.report= 1;
            }else{
                this.report = 0;
            }
            const postReported = {
                postId,
                report: this.report
            };
            //envoie requête vers store - requête LikePost
            this.reportPost(postReported)
                .then((res) => {
                    console.log(res)
                    console.log("reportPost dispatch done !")
                    if (this.report==1){
                    window.confirm('Vous avez signalé cette publication !')
                    }else{
                        window.confirm('Vous ne signalez plus cette publication !')
                    }
                })
        },
        unreportPost(postId){
            const unreportPost = {
                postId,
                report: 0
            };
            //envoie requête vers store - requête LikePost
            this.$store
                .dispatch('removeReport', unreportPost)
                .then((res) => {
                    console.log(res)
                    console.log("removeReport dispatch done !")
                    if(this.mode=='homePage'){
                        this.$store
                            .dispatch('getPostsByDate')
                            .then(() => {
                                console.log("getPostsByDate dispatch done !");
                                this.showUpdateBlock = false;
                            });
                        } else {
                            const userId = this.$route.params.userId;
                            this.$store
                            .dispatch('getPostsByUserId', userId)
                            .then(() => {
                                console.log("getPostsByDate dispatch done !");
                                this.showUpdateBlock = false;
                            });
                        }
                    window.confirm('Signalement enlevé !')

                    
                })
        }    
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
            
            background-color: grey;
            
            font-size: 0.7rem;
            text-align: left;
            
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            &__date{
                margin: 0 80px;
            }
            &__nav{
                color: #ffffff;
                background-color: grey ;
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
            background-color: white;
            border: 1px 1px 1px 0 solid grey;
            padding: 10px;
            text-align: left;
            margin: 0;
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