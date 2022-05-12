<template>
    <div class="posts"  :class="{'posts__reported' : postItem.report>=1 && user.userId == 1}">

        <header class="posts__header"  >
                <router-link class="posts__header__name" :to="`/profile/${postItem.userId}`">
                    <img class="posts__header__name__picture" :src="postItem.profilePicUrl" alt="profile picture">
                    <h2 class="posts__header__name__id">{{postItem.firstName}} {{postItem.lastName}}</h2>
                </router-link>
                
                <div class="posts__header__settings">
                    <p class="posts__header__settings__date" >{{postItem.created}}</p>
                    <span class="posts__header__settings__nav" @click="openSettings" @blur="closeSettings">
                        <font-awesome-icon icon="ellipsis" v-if="userInfos.moderator == 1||user.userId== postItem.userId" />
                    </span>
                </div>
                    <!----------------------------------Post settings-------------------------------------------------->
                <div class="posts__header__settings__popup">    
                    <PostSettings :postItem="postItem" v-if="showSettings" />
                </div>
        </header>


        <div class="posts__content">
            <p class="posts__content__text" v-if="postItem.content" >{{postItem.content}}</p>
            <img class="posts__content__image" v-if="postItem.imageUrl != ' '" :src="postItem.imageUrl" alt="post photo">
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
                <button class="posts__footer__bottom__icon" @click="likePost(postItem.postId)">
                    <font-awesome-icon class="posts__footer__bottom__icon__like" :icon="['far', 'heart']" />
                    like
                </button>
                <button class="posts__footer__bottom__icon" @click="displayComment(postItem.postId)">
                    <font-awesome-icon class="posts__footer__bottom__icon__comment" :icon="['far', 'comment']" />
                    comment
                </button>
            </div>            
        </footer>
        <div v-if="showComment">
            <PostComments :postItem="postItem"/> 
        </div>
    </div>
    
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import PostSettings from '@/components/Home/Posts/PostSettings.vue'
import PostComments from '@/components/Home/Comments/PostComments.vue'

export default ({
    name: 'RecentPosts',
    components: {
        PostSettings,
        PostComments
    },
    props: {'postItem': Object
    },
    data(){
        return {
            showSettings: false,
            showComment: false,
            postId:'',
            likes: '',
            isLiked: '',
            comments: []
        //    selectedComment: ''
        }
    },
    
    computed: {
        ...mapState({
            user: 'user',
            userInfos: 'userInfos',
            posts: 'posts',
            postComments: 'postComments'
        }),
        ...mapGetters({
            fullname: 'fullname',
        })
    },
    methods: {
        openSettings(){
            this.showSettings = !this.showSettings
        },
        closeSettings(){
            this.showSettings = false;
        },
        /**************Like post function OK ***************** */
        likePost(postId){
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
        /******************************************************** */
        //toggle visibility of comment section
        displayComment(postId){          
            this.showComment= !this.showComment;
            
            if(this.showComment==true){
                this.$store 
                    .dispatch('getCommentsByPostId', postId)
                            .then(() => {
                                    console.log("getCommentsByPostId dispatch done !");
                                });
            }else{
                return;
            }
            
        },
         deletePost(postId) {
            console.log(postId);
            this.$store //=> on l'envoie au store pour gérer l'envoi des données vers le backend
                .dispatch('deletePost', postId)
                .then((res) => {
                    console.log("deletePost dispatch done !");
                    console.log(res);
                    //si res ok, affichage mis à jour des commentaires du poste
                    this.$store
                        .dispatch('getPostsByDate')
                        .then(() => {
                                console.log("getPostsByDate dispatch done !");
                            });
                }), (err => {
                    console.log(err)
                })
            }  
    }
    
})
</script>

<style scoped lang="scss">
    .posts {
        margin: 50px auto;
        width: 500px;
        border-radius: 20px 20px 0 0;
        &__reported{
        border: 3px solid #ee7575;

        }
        &__header{
            //background-color: white; 
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
            &__settings{
                background-color: grey;
                height: 35px;
                font-size: 0.7rem;
                text-align: left;
                padding-top: 5px;
                border-radius: 20px 20px 0 0 ;
                margin: 0;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                &__date{
                    margin: 0 80px;
                }
                &__nav{
                color: #ffffff;
                font-size: 25px;
                margin-right: 15px;
                }
                &__popup{
                    position: absolute;
                }
            }
            
        }
        &__content{
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
               // justify-content: start;
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

</style>