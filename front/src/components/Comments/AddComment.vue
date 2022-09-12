                                                   
<!--COMPOSANT AFFICHAGE/AJOUT DES COMMENTAIRES-->

<template>
    <div class="posts__review__comments__added">   
        <!--Affichage des commentaire de la publication-->
        <div class="recentComments" v-if="postComments" >
            <CommentItem 
                v-for="comItem in postComments " 
                :key=comItem.comId 
                :comItem ="comItem"
                :selectedMode="mode"/>
        </div> 
    </div> 
    <div class="posts__review__comments" :class="{'posts__review__comments--square': mq.current=='phone'}">
        <!-- Ajout d'un commentaire -->
        <form class="form__comments" >
            <!--Upload nouvelle image-->
            <label for="uploadCommentImage" class="form__comments__btn form__comments__btn__upload"><font-awesome-icon icon="image" /></label>
            <input id="uploadCommentImage" type="file" accept="image/jpeg, image/png, image/jpg" @change="addCommentImage" >
            <!--contenu du commentaire-->
            <div class="form__comments__content">
                <textarea 
                    class="form__comments__input"
                    rows ="2" 
                    v-model="comment"
                    name ="newComment"
                    placeholder = "Ajoutez un commentaire...">
                </textarea> 
                <div class="form__comments__image" v-if="commentImageUrl">
                <p class="form__comments__image__name"> {{ commentImageUrl.name}} </p>
                <font-awesome-icon class="form__comments__image__icon" icon="xmark" @click="deleteUpload" />
                </div>
            </div>
            <!--Validation-->
            <button 
                class="form__comments__btn form__comments__btn__submit" 
                type="button" 
                @click.prevent="addComment(postItem.postId)">
                <font-awesome-icon icon="paper-plane" />
            </button> 
        </form>
    </div> 
</template>

<script>
//Composant
import CommentItem from '@/components//Comments/CommentItem.vue'

//store et  mixins
import { mapState, mapGetters, mapActions } from 'vuex';
import { homePostsMixin } from '@/mixins/homePostsMixin'
import { profilePostsMixin } from '@/mixins/profilePostsMixin'

export default ({
    //ajout de mediaqueries
    inject: ["mq"],
    name: 'AddComment',
    mixins: [
        homePostsMixin, 
        profilePostsMixin
    ],
    components: {
        CommentItem
    },
    //props from PostItem
    props: {
        postItem: Object,
        mode: String
        },
    data(){
        return {
            comment: "",
            commentImageUrl: ""
        }
    },
    mounted: 
        function(){
            //Loading all recent comments to display
            this.getComments(this.postItem.postId)  
                .then(()=> {
                    console.log("getComments dispatch done !");
                })
                .catch((err) => {
                    console.log(err);
                })
        },
    computed: {
        ...mapState({
            user: 'user'
        }),
        ...mapState('comments',{
            postComments: 'postComments'
        }),
        ...mapGetters({
            fullname: 'fullname',
        })
    },
    methods: {
        ...mapActions('comments',['createComment', 'getComments']),
        //ajout d'une image au commentaire
        addCommentImage(e){
            this.commentImageUrl = e.target.files[0];
            let types = [ "image/jpg", "image/jpeg", "image/png" ];
            // Check if image.type is valid
            if (types.includes(this.commentImageUrl.type)) {
                    console.log("click ok!");
            }else{
                window.alert("Ce type de fichier n'est pas autorisé")
                this.commentImageUrl = ""
            }
        },
        //supression de l'image uploadée
        deleteUpload(){
            this.commentImageUrl = ''
        },
        //Ajout d'un commentaire
        addComment(postId) {
            const mode = this.mode;
            //création de l'objet FormData
            const fdComment = new FormData();
            if (this.comment != "") {
                fdComment.append('commentContent', this.comment);
            }
            if (this.commentImageUrl != "") {
                fdComment.append('image', this.commentImageUrl, this.commentImageUrl.name);
            }

            //Si FormData != null => création du commentaire
            if (this.comment || this.commentImageUrl) {
            this.createComment({postId,fdComment, mode})
                .then(() => {
                    console.log("createComment dispatch done !");
                    this.comment = "";
                    this.commentImageUrl= ""
                    //si res ok, affichage mis à jour des commentaires du post
                        this.getComments(postId)
                            .then(() => {
                                console.log("getComments dispatch done !");
                                }),
                        (err => {
                        console.log(err)
                        })
                })
            }
        }
    }  
})
</script>

<style scoped lang="scss">
.recentComments{
    display: flex;
    flex-direction: column;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
}
.posts__review__comments {
    background-color: #4E5166;
    padding: 10px 0;
    border-radius: 0 0 20px 20px;
    margin: 0;
    &--square{
        border-radius: 0;
    }
}
.form__comments {
    display: flex;
    flex-direction: row;
    &__container{
        width: 100%;
    }
    &__content {
        display: flex;
        flex-direction: column;
        width:70%;
        margin: 0;
    }
    &__input {
        width:100%;
        height: 30px;
        background-color: white;
        border: 2px solid #999999;
        resize: none;
        border-radius: 10px;
        padding: 5px 15px;
        background-color: white;
        display: inline-block;
        white-space: normal;
        color: #4E5166;
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
        width:100%;
        height: 30px;
        background-color: white;
        border: 2px solid #999999;
        border-radius: 10px;
        resize: none;
        padding: 5px 15px;
        background-color: white;
        color: #4E5166;
        display: flex;
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
            border: 2px solid #999999;
            &__name{
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: left;
        }
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

#uploadCommentImage {
    opacity: 0;
    position: absolute;
    z-index: -1;
}

    
</style>