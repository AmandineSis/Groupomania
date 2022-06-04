<template>
    <div class="posts__review__comments__added">   
        <!-----------Display all comments added-------------->
        <div class="recentComments" v-if="postComments" >
            <CommentItem 
                v-for="comItem in postComments " 
                :key=comItem.comId 
                :comItem ="comItem"/>
        </div> 
    </div> 
    <div class="posts__review__comments">
        <!------------- Comments form  -------------->
        <form class="form__comments" >
            <!-----Comment image upload----->
            <label for="uploadCommentImage" class="form__comments__btn form__comments__btn__upload"><font-awesome-icon icon="image" /></label>
            <input id="uploadCommentImage" type="file" accept="image/jpeg, image/png, image/jpg" @change="addCommentImage" >
            <!--------Comment content------->
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
            <!--------Add comment------->
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
//Components import
import CommentItem from '@/components/Home/Comments/CommentItem.vue'

//store and mixins import
import { mapState, mapGetters, mapActions } from 'vuex';
import { homePostsMixin } from '@/mixins/homePostsMixin'
import { profilePostsMixin } from '@/mixins/profilePostsMixin'

export default ({
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
        },
    data(){
        return {
            comment: "",
            commentImageUrl: null
        }
    },
    mounted: 
        function(){
			console.log(this.postItem.postId)
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
        deleteUpload(){
            this.commentImageUrl = null
        },
        addComment(postId) {
            console.log(this.commentImageUrl)
            console.log(this.comment)
            //création de l'objet FormData
            const fdComment = new FormData();
            if (this.comment != "") {
                fdComment.append('commentContent', this.comment);
            }
            if (this.commentImageUrl != null) {
                fdComment.append('image', this.commentImageUrl, this.commentImageUrl.name);
            }
            //Si FormData != null 
            if (this.comment || this.commentImageUrl) {
            this.createComment({postId,fdComment})
                .then(res => {
                    console.log("createComment dispatch done !");
                    console.log(res.data)
                    this.comment = "";
                    this.commentImageUrl= ""
                    //si res ok, affichage mis à jour des commentaires du post
                    
                            this.getComments(postId)
                            .then(() => {
                                console.log("getComments dispatch done !");
                              //  this.$emit('hidePostSettings')
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
margin: 5px;
}
.posts__review__comments {
    background-color: #4E5166;
    padding: 10px 0;
    border-radius: 0 0 20px 20px;
    margin: 0;
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
        width:100%;
        height: 30px;
        background-color: white;
        border: 2px solid #999999;
        border-radius: 10px;
        resize: none;
        padding: 5px 15px;
        background-color: white;
        color: grey;
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