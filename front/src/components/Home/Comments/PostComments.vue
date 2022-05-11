<template>
    <div class="posts__review__comments">
        <form class="form__comments" >
            <label for="uploadCommentImage" class="form__comments__btn form__comments__btn__upload"><font-awesome-icon icon="image" /></label>
            <input id="uploadCommentImage" type="file" @change="addCommentImage" >
            <textarea 
                class="form__comments__input"
                rows ="2" 
                v-model="comment"
                name ="newComment"
                placeholder = "Ajoutez un commentaire...">
            </textarea> 
            <button class="form__comments__btn form__comments__btn__submit" type="button" @click="addComment(postItem.postId)"><font-awesome-icon icon="paper-plane" /></button> 
        </form>
        <p  v-if="commentImageUrl"> {{ commentImageUrl.name}} </p>
    </div> 
    <div>   
        <div class="recentComments" v-for="comItem in postComments" :key=comItem.comId>
            <AddedComments :comItem ="comItem"/>
        </div> 
        
    </div>    
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import AddedComments from '@/components/Home/Comments/AddedComments.vue'
export default ({
    name: 'PostComments',
    components: {

        AddedComments
    },
    props: {
        postItem: Object
    },
    data(){
        return {
            //mode: '',
            comment: "",
            commentImageUrl: "",
            
        }
    },
    computed: {
        ...mapState({
            user: 'user',
            postComments: 'postComments'
        }),
        ...mapGetters({
            fullname: 'fullname',
        })
    },
    methods: {
        addCommentImage(e){
            this.commentImageUrl = e.target.files[0];
            console.log("click ok");
           
        },
        addComment(postId) {
            //création de l'objet FormData
            const fdComment = new FormData();
            if (this.comment != "") {
                fdComment.append('commentContent', this.comment);
            }
            if (this.commentImageUrl) {
                fdComment.append('image', this.commentImageUrl, this.commentImageUrl.name);
            }
            //Si FormData != null 
            if (this.comment || this.commentImageUrl) {
            this.$store //=> on l'envoie au store pour gérer l'envoi des données vers le backend
                .dispatch('createComment', {postId,fdComment})
                .then((res => {
                    console.log("createComment dispatch done !");
                    console.log(res.data)
                    //si res ok, affichage mis à jour des commentaires du post
                    this.$store
                        .dispatch('getCommentsByPostId', postId)
                        .then(() => {
                                console.log("getCommentsByPostId dispatch done !");
                                this.comment= "";
                                this.commentImageUrl="";
                            });
                }), (err => {
                    console.log(err)
                }))
            }
        },
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
           comId;
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