<template>
    <div class="newPost">
        <form class="form">
            <textarea 
                class="form__input"
                rows ="5" 
                v-model="post"
                name ="newPost"
                placeholder = "Que souhaitez vous partager ?">
                
            </textarea>
            <div class="form__addedImage" v-if="imageUrl">
                <p class="form__addedImage__image" >{{imageUrl.name}}</p>
                <font-awesome-icon class="form__addedImage__icon" icon="xmark" @click="deleteUpload" />
            </div>
            <div class="form__valid">
                <label for="uploadImage" class="form__btn form__btn__upload"><font-awesome-icon icon="image" /></label>
                <input id="uploadImage" type="file" accept="image/jpeg, image/png, image/jpg" @change="uploadImage">
                <button
                    class="form__btn form__btn__submit"
                    type="submit"
                    @click.prevent="addNewPost">
                <font-awesome-icon icon="paper-plane" />
                </button> 
            </div>
        </form>
    </div>
</template>


<script>
import { mapActions } from "vuex";
import { homePostsMixin } from '@/mixins/homePostsMixin'
import { profilePostsMixin } from '@/mixins/profilePostsMixin'

export default ({
    name: 'AddPost',
    mixins: [
        homePostsMixin, 
        profilePostsMixin
    ],
    props: {
        currentPage: String,
        selectedMode: String,
    },
    data(){
        return {
            post: "",
            imageUrl:""
        }
    },
    methods: {
        ...mapActions('posts',['createPost', 'getPostsByDate','getPostsByUserId']),
        uploadImage(e){
            this.imageUrl = e.target.files[0];
            let types = [ "image/jpg", "image/jpeg", "image/png" ];
            // Check if image.type is valid
            if (types.includes(this.imageUrl.type)) {
                    console.log("click ok!");
            }else{
                window.alert("Ce type de fichier n'est pas autorisé")
                this.imageUrl = ""
            }
        },
        deleteUpload(){
            this.imageUrl = ''
        },
        addNewPost(){
            //Add content to post
            const fd = new FormData();
            if (this.post != "") {
                fd.append('content', this.post);
            }
            if (this.imageUrl != "") {
                fd.append('image', this.imageUrl, this.imageUrl.name);
            }
            if (this.post || this.imageUrl) {
                //create new post and add it to the posts list
                this.createPost(fd)
                    .then(() => {
                        console.log("createPost dispatch done !");
                        this.post= "";
                        this.imageUrl="";
                       //Reload posts components on homePage
                        if(this.currentPage == "homePage"){
                            this.getAllRecentPosts();
                            this.getAllPopularPosts();
                            this.getAllReportedPosts();
                        //Reload posts components on profilePage
                        }else{
                            const userId = this.$route.params.userId;
                            this.getPostsByUserId(userId);
                            this.getPopularPostsByUserId(userId);
                        }
                    }), (err => {
                        console.log(err)
                    })
            }
        }      
    }
})
</script>

<style scoped lang="scss">
    /******NEW POST CONTAINER******* */
    .newPost {
        margin: 30px auto;
        max-width: 500px;
        align-items: center;
        border-radius: 20px;
        box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    }
    /******NEW POST CONTENT********* */
    .form {
        &__input {
            width:100%;
            height: 91%;
            background-color: white;
            border: 2px solid #999999;
            resize: none;
            border-radius: 20px 20px 0 0;
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
            &__image {
                text-align: left;
                margin: 0;
            }
            &__icon{
                width: 10px;
                padding: 0 4px;
            }
        }
        /***NEW POST BUTTONS***** */
        &__valid{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
        }
        &__btn {
        padding: 0px;
        width: 50%;
        border-radius: 100px;
        height: 40px;
        background-color: #ee7575;
        color: #ffffff;
            &__submit {
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
    #uploadImage {
        opacity: 0;
        position: absolute;
        z-index: -1;
    }
</style>