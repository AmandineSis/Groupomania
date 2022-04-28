<template>
    <div class="posts__review__comments">
        <form class="form__comments" >
            <label for="uploadCommentImage" class="form__comments__btn form__comments__btn__upload"><font-awesome-icon icon="image" /></label>
            <input class="commentImage" type="file" @change="addImage(postId)" >
            <textarea 
                class="form__comments__input"
                rows ="2" 
                v-model="comment"
                name ="newComment"
                placeholder = "Ajoutez un commentaire...">
            </textarea> 
            <button class="form__comments__btn form__comments__btn__submit" type="button" @click="addComment(postId)"><font-awesome-icon icon="paper-plane" /></button> 
        </form> 
        <p>{{this.comment}}</p>
        <div class="recentComments" v-for="item in postComments" :key=item.comId>
                <img class="form__comments__profile" :src="item.profilePicUrl" alt="">
                <div class="form__comments__content">
                    <p class="form__comments__input form__comments__input__sent" v-if="item.commentContent" >{{ item.commentContent }}</p>
                    <img class="form__comments__image" v-if="item.imageUrl" :src="item.imageUrl" alt="post photo">
                </div>
        </div> 
    </div>    
</template>

<script>
import { mapGetters, mapState } from 'vuex';
export default ({
    name: 'PostComments',
    props: {
        postId: Number
    },
    data(){
        return {
            //mode: '',
            comment: "",
            imageUrl: ""
        }
    },
    computed: {
        ...mapState({
            postComments: 'postComments',
        }),
        ...mapGetters({
            fullname: 'fullname',
        })
    }, methods: {
        addComment(postId) {
            //création de l'objet FormData
            const fdComment = new FormData();
            if (this.comment != "") {
                fdComment.append('commentContent', this.comment);
            }
            if (this.imageUrl) {
                fdComment.append('image', this.imageUrl, this.imageUrl.name);
            }
            //Si FormData != null 
            if (this.comment || this.imageUrl) {
            this.$store //=> on l'envoie au store pour gérer l'envoi des données vers le backend
                .dispatch('createComment', {postId,fdComment})
                .then((res => {
                    console.log("createComment dispatch done !");
                    console.log(res.data)
                    //si res ok, affichage mis à jour des commentaires du post
                    this.$store
                        .dispatch('getCommentsByPostId', postId)
                        .then(() => {
                                console.log("getAllComments dispatch done !");
                                this.comment= "";
                                this.imageUrl="";
                            });
                }), (err => {
                    console.log(err)
                }))
            }
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
.commentImage {
       opacity: 0;
       position: absolute;
       z-index: -1;
    }

    
</style>