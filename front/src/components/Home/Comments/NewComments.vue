<template>
    <img class="form__comments__profile" :src="comItem.profilePicUrl" alt="">
    <div class="form__comments__content">
        <p class="form__comments__input form__comments__input__sent" v-if="comItem.commentContent" contenteditable="isEditable">{{ comItem.commentContent }}</p>
        <img class="form__comments__image" v-if="comItem.imageUrl" :src="comItem.imageUrl" alt="post photo">
    </div>
    <div class="form__comments__settings">    
        <button class="form__comments__settings__delete" v-if="comItem.userId == user.userId " @click="deleteComment(comItem.comId, comItem.postId)">
            <font-awesome-icon icon="xmark" />
        </button>
        <button class="form__comments__settings__update" icon="pen-clip" v-if="comItem.userId == user.userId " @click="updateComment(comItem.comId, comItem.postId)">
            <font-awesome-icon icon="pen-clip" />
        </button>
    </div>   
</template>

<script>
import { mapGetters, mapState } from 'vuex';
export default ({
    name: 'NewComments',
    props: {
        comItem: Object
    },
    data(){
        return {
            //mode: '',
            comment: "",
            commentImageUrl: "",
            isEditable: false
        }
    },
    computed: {
        ...mapState({
            user: 'user',
            postComments: 'postComments',
        }),
        ...mapGetters({
            fullname: 'fullname',
        })
    },
    methods: {
       
        deleteComment(comId,postId) {
      
            console.log(comId);

            console.log(postId);
            this.$store //=> on l'envoie au store pour gérer l'envoi des données vers le backend
                .dispatch('deleteComment', {comId,postId})
                .then((res) => {
                    console.log("deleteComment dispatch done !");
                    console.log(res);
                    //si res ok, affichage mis à jour des commentaires du poste
                    this.$store
                        .dispatch('getCommentsByPostId', postId)
                        .then(() => {
                                console.log("getAllComments dispatch done !");
                            });
                }), (err => {
                    console.log(err)
                })
        },
        updateComment(comId,postId) {
           
            console.log('click ok!')
           console.log(comId);
           postId;

           /*console.log(comId);
            console.log(postId);
            this.$store //=> on l'envoie au store pour gérer l'envoi des données vers le backend
                .dispatch('updateComment', {comId,postId})
                .then((res) => {
                    console.log("deleteComment dispatch done !");
                    console.log(res);
                    //si res ok, affichage mis à jour des commentaires du poste
                    this.$store
                        .dispatch('getCommentsByPostId', postId)
                        .then(() => {
                                console.log("getAllComments dispatch done !");
                            });
                }), (err => {
                    console.log(err)
                })*/
        }
    }  
})
</script>

<style scoped lang="scss">

.posts__review__comments {
    background-color: white;
    padding: 10px 0;
    border-radius: 0 0 20px 20px;
}
.form__comments {
    display: flex;
    flex-direction: row;
    &__content {
        display: flex;
        flex-direction: column;
        width:100%;
    }
    &__input {
        width:70%;
        height: 30px;
        background-color: white;
        border: 2px solid #999999;
        resize: none;
        border-radius: 20px;
        padding: 5px 15px;
        background-color: white;
        display: inline-block;
        white-space: normal;
        color: grey;
        &__sent{
            width: 95%;
            height: auto;
            text-align: left;
        }
    }
    &__profile {
        width: 40px;
        height: 40px;
        border-radius: 50px;
        border: 0.5px solid #999999;
    }
    &__image {
        width:70%;
       
    }
    &__btn {
        padding: 0px;
        
        border-radius: 100px;
        height: 30px;
        background-color: #FFFFFF;
        border: solid 1.5px #ee7575;
        color: #ee7575;
        
        &__upload {
            width: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
           
        }
        &__submit{
            width: 70px;
        }
        &:hover {
            background-color: #ee7575;
            color: #ffffff;
        }
        &:active {
            color: #ee7575;
            background-color: #ffffff;
        }
    }
}
.recentComments{
display: flex;
margin: 5px;
}
#uploadCommentImage {
       opacity: 0;
       position: absolute;
       z-index: -1;
    }

    
</style>