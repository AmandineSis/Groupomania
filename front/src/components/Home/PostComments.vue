<template>
    <form class="form__comments" >
        <label for="uploadCommentImage" class="form__comments__btn form__comments__btn__upload"><font-awesome-icon icon="image" /></label>
        <input class="commentImage" type="file" @change="addImage(postId)" >
        <textarea 
            class="form__comments__input"
            rows ="1" 
            v-model="comment"
            name ="newComment"
            placeholder = "Ajoutez un commentaire...">
        </textarea> 
        <button class="form__comments__btn form__comments__btn__submit" type="submit" @click="addComment(postId)"><font-awesome-icon icon="paper-plane" /></button> 
    </form> 
    <div class="recentComments" v-for="postComment in postComments" :key="postComment.postId">
                    <p>{{postComment.comment}}</p>
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
            showComment: false,
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
    }   
})
</script>

<style scoped lang="scss">
.form__comments {
    display: flex;
    flex-direction: row;
    &__input {
        width:70%;
        height:  30px;
        background-color: white;
        border: 2px solid #999999;
        resize: none;
        border-radius: 20px;
        padding: 5px 15px;
        background-color: white;
        display: inline-block;
        white-space: normal;
        color: grey;
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

.commentImage {
       opacity: 0;
       position: absolute;
       z-index: -1;
    }

    
</style>