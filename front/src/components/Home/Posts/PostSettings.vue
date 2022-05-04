<template>
             <!----------------------------------Post settings-------------------------------------------------->
             <div class="posts__header__settings">    
                    <button class="posts__header__settings__delete" @click="deletePost(postItem.postId)">
                        <font-awesome-icon icon="xmark" />
                    </button>
                    <button class="posts__header__settings__update" icon="pen-clip" >
                        <font-awesome-icon icon="pen-clip" />
                    </button>
            </div>
            <!----------------------------------Post settings-------------------------------------------------->
            
</template>

<script>
import { mapGetters, mapState } from 'vuex';


export default ({
    name: 'RecentPosts',
    props: {'postItem': Object},
    data(){
        return {
            showComment: false,
            postId:'',
            isLiked: ''
        //    selectedComment: ''
        }
    },
    
    computed: {
        ...mapState({
            user: 'user',
            posts: 'posts',
            postComments: 'postComments'
        }),
        ...mapGetters({
            fullname: 'fullname',
        })
    },
    methods: {
        /**************Like post function OK ***************** */
        likePost(postId){
            //toggle like value between 0 and 1
            this.isLiked = !this.isLiked;
            
            if( this.isLiked == true){
                this.posts.likes= 1;
            }else{
                this.posts.likes = 0;
            }
            const postLike = {
                postId,
                like: this.posts.likes
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
                                    console.log("getAllComments dispatch done !");
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
        &__header{
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
            &__date{
                background-color: grey;
                height: 35px;
                font-size: 0.7rem;
                text-align: left;
                padding: 5px 80px;
                border-radius: 20px 20px 0 0 ;
                margin: 0;
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
;                        }
                        &__full{
                            color: #ee7575;
                        }
                    }
            }
        }








      /*  &__review {
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
                    //height: 100px;
                    align-items: center;
                    border-radius: 0 0 20px 20px;
            }    
        }*/
    }

</style>