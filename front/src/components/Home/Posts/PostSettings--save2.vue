<template>
    <!----------------------------------Post settings-------------------------------------------------->
    <div class="settings">    
            <button class="settings__button" v-if=" user.userId== postItem.userId" @click="openUpdate" @blur="closeSettings" >
                modifier
            </button><button class="settings__button" v-if=" user.moderator == 1 || user.userId== postItem.userId" @click="postDelete(postItem.postId)" >
                supprimer
            </button>
            
            <button class="settings__button" v-if="user.moderator == 0 && user.userId!= postItem.userId" @click="reportPost(postItem.postId)" >
                <span v-if="isReported==1 ">Déjà signalé</span>
                <span v-else>Signaler</span>
            </button>
            <button class="settings__button" v-if="user.moderator == 1 && postItem.report>=1" @click="unreportPost(postItem.postId)" >
                Enlever signalement
            </button>
    </div>
  
</template>

<script>
import { mapState } from 'vuex';


export default ({
    name: 'PostSettings',
    props: {'postItem': Object},
    data(){
        return {
            postUpdated:'',
            imageUpdated:'',
            displayImageName: true,
            showUpdateBlock: false,
            mode: 'homePage',
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
        }),
        ...mapState('toggle',{
            showPostSettings: 'showPostSettings'
        }),
        
    },
    methods: {
        closeSettings(){
            this.$emit('hidePostSettings')
        },
        openUpdate(){
            this.showUpdateBlock = !this.showUpdateBlock;
        },
        updateImage(e){
            this.imageUpdated = e.target.files[0];
            console.log(this.imageUpdated);
            this.displayImageName = !this.displayImageName;
          
        },
        deleteUploadedFile(){
            this.displayImageName = !this.displayImageName;
        },
        deleteUpdatedFile(){
            this.imageUpdated = ''
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
        updatePost(postId,content) {
     
            console.log(postId);
            console.log(this.postUpdated);
            console.log(content);
            console.log(this.imageUpdated.name);
            
            
            const fdUpdatedPost = new FormData();
            if (this.postUpdated != "") {
                fdUpdatedPost.append('content', this.postUpdated);
            }
            /*else{
                fdUpdatePost.append('updatedContent', this.postUpdated);
            }*/
            if (this.imageUpdated != "") {
                fdUpdatedPost.append('image', this.imageUpdated, this.imageUpdated.name);
            }
            if (this.postUpdated || this.imageUpdated) {
                this.$store
                    .dispatch('updatePost', {postId, fdUpdatedPost})
                    .then((res => {
                        console.log(res);
                       
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
                                this.$emit('hidePostSettings')
                            });
                        }
                    }), (err => {
                        console.log(err)
                    }))
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
    .settings{
        position: relative;
        left: 400px;
        top: 0;
        z-index: 99;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;;
        width: 100px;
        //height: 80px;
        margin: 0;
        //background-color: pink;
        display: flex;
        flex-direction: column ;
        justify-content: center;
        &__button {
            padding: 10px 0;
            width: 100%;
        }
    }
    

    .updatePost{
        position: relative;
        
        top: 0;
        z-index: 99;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;;
        width:500px;
        height: 150px;
        margin: 0;
    
        display: flex;
        flex-direction: column ;
        justify-content: center;
  
        &__form {
            width:500px;
            height: 150px;
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
                    background-color: #ffffff;
                &__image {
                    text-align: left;
                    margin: 0;
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
    }
    #uploadUpdatedImage {
       opacity: 0;
       position: absolute;
       z-index: -1;
    }
</style>