<template>
    <div class="updatePost">
        <form class="updatePost__form"  >
            <textarea 
                class="updatePost__form__input"
                rows ="5" 
                name ="newPost"
                :value="postItem.content"
                @input="event.content = $event.target.value"
            ></textarea>

            <div class="updatePost__form__addedImage test" v-if="postItem.imageUrl && !event.image.name && displayUpload" >
                <p class="updatePost__form__addedImage__image" >{{postItem.imageUrl}}</p>
                <font-awesome-icon class="updatePost__form__addedImage__icon" icon="xmark" @click="deleteUploadedFile" />
            </div>
            <div class="updatePost__form__addedImage" v-if="event.image" >
                <p class="updatePost__form__addedImage__image" >{{event.image.name}}</p>
                <font-awesome-icon class="updatePost__form__addedImage__icon" icon="xmark" @click="deleteUpdatedFile" />
            </div>

            <div class="updatePost__form__valid">
                <label for="uploadUpdatedImage" class="updatePost__form__btn updatePost__form__btn__upload"><font-awesome-icon icon="image" /></label>
                <input id="uploadUpdatedImage" type="file" @change="updateImage">
                <button
                    class="updatePost__form__btn updatePost__form__btn__submit"
                    type="submit"
                    @click.prevent="updatePostContent(postItem.postId, postItem.content, postItem.imageUrl)">
                Modifier
                </button> 
                 <button class="updatePost__form__btn updatePost__form__btn__delete" v-if=" user.moderator == 1 || user.userId== postItem.userId" @click="postDelete(postItem.postId)" >
                supprimer
            </button>
            </div>
        </form>
    </div>

</template>

<script>
import { mapState, mapActions } from 'vuex';


export default ({
    name: 'PostSettings',
    props: {
        'postItem': Object,
        'currentPage': String,
        'selectedMode': String
    },
    data(){
        return {
            event: {
                content:'',
                image:''
            },
           /* postUpdated:'',
            imageUpdated:'',*/
            displayUpload: true,
            isReported: '',
            report:''
        }
    },
    computed: {
        ...mapState({
            user: 'user',
            posts: 'posts',
            postComments: 'postComments',
            reportedPosts: 'reportedPostsByUserId'
        })
    },
    methods: {
        ...mapActions('posts',['deletePost','updatePost', 'getPostsByDate','getPostsByUserId']),
        closeSettings(){
            this.$emit('hidePostSettings')
        },
        openUpdate(){
            this.showUpdateBlock = !this.showUpdateBlock;
        },
        updateImage(e){
            this.event.image = e.target.files[0];
         //   this.displayImageName = !this.displayImageName;
          
        },
        deleteUploadedFile(){
            this.displayUpload = false;
        },
        deleteUpdatedFile(){
            this.event.image = ''
        },
        postDelete(postId) {
            this.deletePost(postId)
                .then(() => {
                    console.log("deletePost dispatch done !");
                    //si res ok, affichage mis à jour des commentaires du poste
                    this.getPostsByDate()
                        .then(() => {
                            console.log("getPostsByDate dispatch done !");
                            });
                }), (err => {
                    console.log(err)
                })
        },
        updatePostContent(postId,content, image) {
            let imageUpdate
            let contentUpdate = (this.event.content ? this.event.content : content)
            console.log(postId);
            console.log(image);
            console.log(this.currentPage);
            if(!this.displayUpload){
                imageUpdate= null
            }else{
                imageUpdate = (this.event.image ? this.event.image : image)
            }
            console.log(contentUpdate)
            console.log(imageUpdate)
            const fdUpdatedPost = new FormData();
            if (contentUpdate != "") {
                fdUpdatedPost.append('content', contentUpdate);
            }
            /*else{
                fdUpdatePost.append('updatedContent', this.postUpdated);
            }*/
            if (imageUpdate != null) {
                fdUpdatedPost.append('image', imageUpdate, imageUpdate.name);
            }
            if (contentUpdate || imageUpdate) {
                this.updatePost({postId, fdUpdatedPost})
                    .then(() => {
                        if(this.currentPage=='homePage'){
                            console.log(this.currentPage)
                        this.getPostsByDate()
                            .then(() => {
                                console.log("getPostsByDate dispatch done !");
                                this.showUpdateBlock = false;
                            });
                        } else {
                            console.log(this.currentPage)
                            const userId = this.$route.params.userId;
                            this.getPostsByUserId(userId)
                            .then(() => {
                                console.log("getPostsByDate dispatch done !");
                                this.showUpdateBlock = false;
                                this.$emit('hidePostSettings')
                            });
                        }
                    }), (err => {
                        console.log(err)
                    })
            }
        },
        reportPost(postId) {
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
            this.$store
                .dispatch('reportPost', postReported)
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
    .updatePost{
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;;
        width:100%;
        height: auto;
        margin: 0;
        border-radius: 20px;
        display: flex;
        flex-direction: column ;
        justify-content: center;
  
        &__form {
            width:100%;
            height: auto;
            &__input {
                    width:100%;
                    height: auto;
                    background-color: white;
                    border: 2px solid #999999;
                    resize: none;
                   // border-radius: 20px 20px 0 0;
                    padding: 5px 15px;
                    background-color: white;
                    display: inline-block;
                    white-space: normal;
                    color: grey;    
            }
            &__addedImage{
                    
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    width: 100%;
                    border: 2px solid #999999;
                    background-color: #ee7575;
                &__image {
                    color: inherit;
                    
                    text-align: left;
                    margin: 2px;
                }
                &__icon{
                    width: 10px;
                    padding: 0 4px;
                }
        }
        &__valid{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            
            width: 100%;
           
            &__image {
                text-align: left;
                border: 2px solid #999999;
                background-color: #ffffff;
            }
        }
        &__btn {
        padding: 0px;
        width: 50%;
       // border-radius: 100px;
        height: 40px;
        background-color: #ee7575;
        
        color: #ffffff;
        &__delete {
            border-radius: 0 0 20px 0;
            border-left: solid 1.5px #ffffff;
        }
        &__upload {
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 0 0 0 20px;
            border-right: solid 1.5px #ffffff;
        }
        &:hover {
            background-color:  #ffffff;
            color:#ee7575;
            border: solid 1.5px #ee7575;
        }
        &:active {
            color: #ffffff;;
            background-color:#ee7575;
             border: solid 1.5px #ee7575;
        }
        
    }
    }
    }
    #uploadUpdatedImage {
       opacity: 0;
       position: absolute;
       z-index: -1;
    }
</style>