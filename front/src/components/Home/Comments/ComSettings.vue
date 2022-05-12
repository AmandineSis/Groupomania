<template>
    <!----------------------------------Post settings-------------------------------------------------->
    <div class="settings">    
            <button class="settings__update" v-if="user.userId != 1" @click.prevent="openUpdate"  >
                modifier
            </button>
            <button class="settings__delete" @click.prevent="deleteComment(comItem.postId, comItem.comId)" >
                supprimer
            </button>
    </div>
    <!----------------------------------Post settings-------------------------------------------------->
    <div class="updatePost" v-if="showUpdateBlock" >
        <form class="updateCom__form"  >
            <textarea 
                class="updateCom__form__input"
                rows ="5" 
                v-model="comUpdated"
                name ="newPost"
                :placeholder="comItem.commentContent"
            ></textarea>

            <div class="updateCom__form__addedImage" v-if="comItem.imageUrl.length !== 0 && !comImageUpdated && displayImageName" >
                <p class="updateCom__form__addedImage__image" >{{comItem.imageUrl}}</p>
                <font-awesome-icon class="updateCom__form__addedImage__icon" icon="xmark" @click="hideUploadedFile" />
            </div>
            <div class="updateCom__form__addedImage" v-if="comImageUpdated" >
                <p class="updateCom__form__addedImage__image" >{{comImageUpdated.name}}</p>
                <font-awesome-icon class="updateCom__form__addedImage__icon" icon="xmark" @click="deleteUpdatedFile" />
            </div>
            <div class="updateCom__form__valid">
            
                <label for="uploadUpdatedImage" class="updateCom__form__btn updateCom__form__btn__upload"><font-awesome-icon icon="image" /></label>
                <input id="uploadUpdatedImage" type="file" @change="updateComImage">
                <button
                    class="updateCom__form__btn updateCom__form__btn__submit"
                    type="submit"
                    @click.prevent="updatePost(comItem.postId, comItem.comId, comItem.commentContent)">
                <font-awesome-icon icon="paper-plane" />
                </button> 
            </div>
        </form>
    </div>
</template>

<script>
import { mapState } from 'vuex';


export default ({
    name: 'ComSettings',
    props: {'comItem': Object},
    data(){
        return {
            comUpdated:'',
            comImageUpdated:'',
            displayImageName: true,
            showUpdateBlock: false,
            mode: 'homePage',
        }
    },
    computed: {
        ...mapState({
            user: 'user',
            posts: 'posts',
            postComments: 'postComments'
        })
        
    },
    methods: {
        openUpdate(){
            this.showUpdateBlock = !this.showUpdateBlock;
        },
        updateComImage(e){
            this.comImageUpdated = e.target.files[0];
            console.log(this.comImageUpdated);
            this.displayImageName = !this.displayImageName;
        },
        hideUploadedFile(){
            console.log(typeof this.postComments[0].imageUrl)
            console.log(this.postComments[0].imageUrl. length)
            this.displayImageName = !this.displayImageName;
        },
        deleteUpdatedFile(){
            this.comImageUpdated = ''
        },
        deleteComment(postId, comId) {
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
								console.log("getCommentsByPostId dispatch done !");
							});
				}), (err => {
					console.log(err)
				})
		},
        updatePost(postId,comId,content) {
     
            console.log(postId);
            console.log(comId);
            console.log(this.comUpdated);
            console.log(content);
            console.log(this.comImageUpdated.name);
            
            
            const fdUpdatedCom = new FormData();
            if (this.comUpdated != "") {
                fdUpdatedCom.append('commentContent', this.comUpdated);
            }
            /*else{
                fdUpdatePost.append('updatedContent', this.postUpdated);
            }*/
            if (this.comImageUpdated != "") {
                fdUpdatedCom.append('image', this.comImageUpdated, this.comImageUpdated.name);
            }
            if (this.comUpdated || this.comImageUpdated) {
                this.$store
                    .dispatch('updateComment', {postId,comId, fdUpdatedCom})
                    .then((res => {
                        console.log(res);
                        this.$nextTick(() => {
                            this.$store
                            .dispatch('getCommentsByPostId', postId)
                            .then(() => {
                                console.log("getCommentsByPostId dispatch done !");
                                this.showUpdateBlock = false;
                                });
                        }), (err => {
                        console.log(err)
                    })}))
            }
        }   

    }
})
</script>

<style scoped lang="scss">
    .settings{
        position: relative;
        left: 395px;
        top: 29px;
        z-index: 99;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;;
        width: 100px;
       // height: 80px;
        margin: 0;
        //background-color: pink;
        display: flex;
        flex-direction: column ;
        justify-content: center;
        &__delete, &__update {
            padding: 10px 0;
            width: 100%;
        }
    }
    

    .updateCom{
        position: relative;
        
        top: 0;
        z-index: 99;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;;
        width:500px;
        height: 150px;
        margin: 0;
        background-color: pink;
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