<template>
    <div class="updatePost">
        <form class="updatePost__form"  >
            <!-------------------------------Post content------------------------------------->
            <textarea 
                class="updatePost__form__input"
                rows ="5" 
                name ="newPost"
                :value="postItem.content"
                @change="event.content = $event.target.value"
            ></textarea>
            <!------------------------Display/Delete post image------------------------->
            <div class="updatePost__form__addedImage" v-if="postItem.imageUrl && !event.image.name && postUploadExists" >
                <p class="updatePost__form__addedImage__image" >{{postItem.imageUrl}}</p>
                <font-awesome-icon 
                    class="updatePost__form__addedImage__icon" 
                    icon="xmark" 
                    @click="hideUploadedFile" />
            </div>
            <div class="updatePost__form__addedImage" v-if="event.image" >
                <p class="updatePost__form__addedImage__image" >{{event.image.name}}</p>
                <font-awesome-icon 
                    class="updatePost__form__addedImage__icon" 
                    icon="xmark" 
                    @click="deleteUpdatedFile" />
            </div>
            <div class="updatePost__form__valid">
                <!----------------------------Delete post ---------------------------------------->
                <button 
                    class="updatePost__form__btn updatePost__form__btn__delete" 
                    v-if=" user.moderator == 1 || user.userId== postItem.userId" 
                    @click="postDelete(postItem.postId)">
                    Supprimer
                </button>
                <!-------------------------Remove post report ---------------------------------------->
                <button 
                    class="updatePost__form__btn updatePost__form__btn__deleteReport" 
                    v-if=" user.moderator == 1 && postItem.report>0" 
                    @click="unreportPost(postItem.postId)">
                    Supprimer le signalement
                </button>
                <!----------------------------Upload post image ---------------------------------------->
                <label 
                    for="uploadUpdatedImage" 
                    class="updatePost__form__btn updatePost__form__btn__upload">
                        <font-awesome-icon icon="image" />
                </label>
                <input 
                    id="uploadUpdatedImage" 
                    type="file" 
                    accept="image/jpeg, image/png, image/jpg" 
                    @change="updateImage">
                <!----------------------------Valid post update ---------------------------------------->
                <button 
                    class="updatePost__form__btn updatePost__form__btn__submit" 
                    type="submit" 
                    @click.prevent="updatePostContent(postItem.postId, postItem.content, postItem.imageUrl)">
                    Modifier
                </button> 
            </div>
        </form>
    </div>

</template>

<script>

//store and mixins import
import { mapState, mapActions } from 'vuex';
import { homePostsMixin } from '@/mixins/homePostsMixin'
import { profilePostsMixin } from '@/mixins/profilePostsMixin'

export default ({
    name: 'PostSettings',
    mixins: [
        homePostsMixin, 
        profilePostsMixin
    ],
    props: {
        postItem: Object,
        thisPage: String
    },
    data(){
        return {
            imageToSend: '',
            event: {
                content:'',
                image:''
            },
            postUploadExists: true,
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
        ...mapActions('posts',['deletePost','updatePost', 'removeReport']),
        updateImage(e){
            this.event.image = e.target.files[0];   
            let types = [ "image/jpg", "image/jpeg", "image/png" ];
            // Check if image.type is valid
            if (types.includes(this.event.image.type)) {
                    console.log("click ok!");
            }else{
                window.alert("Ce type de fichier n'est pas autorisé")
                this.event.image = ""
            }       
        },
        hideUploadedFile(){
            this.postUploadExists = false;
        },
        deleteUpdatedFile(){
            this.event.image = '';
        },
        postDelete(postId) {
            if (window.confirm('Êtes-vous sûrs de vouloir supprimer ce post ?')){
                this.deletePost(postId)
                    .then(() => {
                        console.log("deletePost dispatch done !");
                        //Reload posts components on homePage
                        if(this.thisPage == "homePage"){
                            this.getAllRecentPosts();
                            this.getAllPopularPosts();
                            this.getAllReportedPosts();
                        //Reload posts components on profilePage
                        }else if(this.thisPage == "profilePage"){
                            const userId = this.$route.params.userId;
                            this.getPostsByUserId(userId);
                            this.getPopularPostsByUserId(userId);
                        }
                    }), (err => {
                        console.log(err)
                    })
            }else{
                console.log('default')
                this.$emit('hidePostSettings')
            }
            
        },
isImageUpdated(image){
            if(this.postUploadExists && !this.event.image){
                return image
            }else if (!this.postUploadExists && !this.event.image){
                return undefined
            }else {
                return this.event.image
            }
        },

        updatePostContent(postId,content, image) {
            console.log(content)
            console.log(this.event.content)
            let imageUpdate = this.isImageUpdated(image);
            let contentUpdate = (this.event.content) ? this.event.content : content;
            console.log('contentupdate------> '+ contentUpdate)
            const fdUpdatedPost = new FormData();
            if (contentUpdate != "") {
                fdUpdatedPost.append('content', contentUpdate);
            }
            
            console.log('imageUpdate---> '+imageUpdate)// nothing
            console.log('image---> '+image) //http://localhost:3000/images
            console.log('event.image---> '+this.event.image)// nothing

            //image || undefined || this.event.image
            if (imageUpdate == this.event.image) {
                fdUpdatedPost.append('image', imageUpdate, imageUpdate.name);
            } else if (imageUpdate == image && imageUpdate !== null){
                fdUpdatedPost.append('image', imageUpdate)
            } 

            fdUpdatedPost.get('image');
            if (contentUpdate || imageUpdate ) {
                this.updatePost({postId, fdUpdatedPost})
                    .then(() => {
                        console.log("updatePost dispatch done !");
                        if(this.thisPage=='homePage'){
                            this.getAllRecentPosts();
                            this.getAllPopularPosts();
                            this.getAllReportedPosts();
                        }else{
                            const userId = this.$route.params.userId;
                            this.getPostsByUserId(userId);
                            this.getPopularPostsByUserId(userId);
                        }
                        this.$emit('hidePostSettings')
                        }   
                    ), (err => {
                        console.log(err)
                    })
        }
            },

        /*********************************************************
         * *****************A modifier****************************
         *******************************************************/
        unreportPost(postId){
            
            //envoie requête vers store - requête LikePost
            this.removeReport(postId)
                .then((res) => {
                    console.log(res)
                    console.log("removeReport dispatch done !")
                    if(this.thisPage=='homePage'){
                        this.getAllRecentPosts();
                        this.getAllPopularPosts();
                        this.getAllReportedPosts();
                    }
                    this.$emit('hidePostSettings')
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
        position: relative;
        z-index: 99;
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
                    background-color: white;
                &__image {
                    color: inherit;
                    overflow: hidden;
                    text-overflow: ellipsis;
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
            border-radius: 0 0 0 20px ;
            border: solid 2px #ee7575;
            color: #ee7575;
            background-color: #ffffff;
        }
        &__upload {
            display: flex;
            justify-content: center;
            align-items: center;
            border-right: solid 1.5px #ffffff;
            border-left: solid 1.5px #ffffff;
            
        }
        &__submit {
            border-radius: 0 0 20px 0;
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