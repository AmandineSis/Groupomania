
<!-- MODFICATION/SUPPRESSION DES COMMENTAIRES-->

<template>
    <div class="updateCom"  >
        <form class="updateCom__form"  >
            <textarea 
                class="updateCom__form__input"
                rows ="5" 
                name ="newPost"
                :value="event.comContent = comItem.commentContent"
                @change="event.comContent = $event.target.value"
            ></textarea>
            <!--Affichage/modification de l'image-->
            <div class="updateCom__form__addedImage" v-if="comItem.imageUrl && !event.comImage.name && comUploadExists" >
                <p class="updateCom__form__addedImage__name" >{{comItem.imageUrl}}</p>
                <font-awesome-icon 
                    class="updateCom__form__addedImage__icon" 
                    icon="xmark" 
                    @click="hideUploadedFile" />
            </div>
            <div class="updateCom__form__addedImage" v-if="event.comImage" >
                <p class="updateCom__form__addedImage__name" >{{event.comImage.name}}</p>
                <font-awesome-icon 
                    class="updateCom__form__addedImage__icon" 
                    icon="xmark" 
                    @click="deleteUpdatedFile" />
            </div>
            <div class="updateCom__form__valid">
                <!--Suppression du commentaire-->
                <button 
                    class="updateCom__form__btn updateCom__form__btn__delete" 
                    @click.prevent="deletePostComment(comItem.postId, comItem.comId)" >
                    supprimer
                </button>
                <!--Ajout d'une nouvelle image-->
                <label for="uploadUpdatedImage" class="updateCom__form__btn updateCom__form__btn__upload"><font-awesome-icon icon="image" /></label>
                <input id="uploadUpdatedImage" type="file" @change="updateComImage">
                <!--Validation du commentaire-->
                <button
                    class="updateCom__form__btn updateCom__form__btn__submit"
                    type="submit"
                    @click.prevent="updatePostComment(comItem.postId, comItem.comId, event.comContent, comItem.imageUrl)">
                    modifier
                </button> 
            </div>
        </form>
    </div>
</template>

<script>

//store et mixins 
import { mapState, mapActions } from 'vuex';

export default ({
    name: 'ComSettings',
    props: {
        comItem: Object,
        mode: String
        },
    data(){
        return {
            event:{
                comContent: '',
                comImage: ''
            },
            comUploadExists: true,
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
        ...mapActions('comments',['updateComment','deleteComment', 'getComments']),
        updateComImage(e){
            this.event.comImage = e.target.files[0];
            let types = [ "image/jpg", "image/jpeg", "image/png" ];
            // Check if image.type is valid
            if (types.includes(this.event.comImage.type)) {
                    console.log("fichier autorisé!");
            }else{
                window.alert("Ce type de fichier n'est pas autorisé")
                this.event.comImage = ""
            } 
        },
        hideUploadedFile(){
            this.comUploadExists = false
        },
        deleteUpdatedFile(){
            this.event.comImage = ''
        },
        deletePostComment(postId, comId) {
            let mode = this.mode
            if (window.confirm('Êtes-vous sûrs de vouloir supprimer ce post ?')){
                this.deleteComment({comId,postId, mode})
                    .then(() => {
                        console.log("deleteComment dispatch done !");
                        this.getComments(postId)
                        .then(() => {
                            console.log("getComments dispatch done !");
                            });
				}), (err => {
					console.log(err)
				})
            }else{
                console.log('default')
                this.$emit('hide-com-settings')
            }
		},
        isComImageUpdated(image){
            if(this.comUploadExists && !this.event.comImage){
                return image
            }else if (!this.comUploadExists && !this.event.comImage){
                return undefined
            }else{
                return this.event.comImage
            }
        },
        updatePostComment(postId,comId,content,image) {
            let comImageUpdate = this.isComImageUpdated(image);

            const fdUpdatedCom = new FormData();
            if (content != "") {
                fdUpdatedCom.append('commentContent', content);
            }

            if (comImageUpdate == this.event.comImage) {
                fdUpdatedCom.append('image', comImageUpdate, comImageUpdate.name);
            } else if (comImageUpdate == image && comImageUpdate !== null){
                fdUpdatedCom.append('image', comImageUpdate)
            }

            if (content || comImageUpdate) {
                this.updateComment({postId,comId, fdUpdatedCom})
                    .then(() => {
                        console.log("updateComment dispatch done !");
                            this.getComments(postId)
                            .then(() => {
                                console.log("getComments dispatch done !");
                                this.$emit('hideComSettings')
                                }),
                        (err => {
                        console.log(err)
                        })
                    })}
        }}
})
</script>

<style scoped lang="scss">
    .updateCom{
        max-width: 375px;
        height: auto;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        margin: 0;
        border-radius: 10px;
        display: flex;
        flex-direction: column ;
        justify-content: center;
        &__form {
            width:100%;
            height: auto;
            &__input {
                width:100%;
                background-color: white;
                border: 2px solid #999999;
                resize: none;
                border-radius: 10px 10px 0 0;
                padding: 5px 15px;
                background-color: white;
                display: inline-block;
                white-space: normal;
                color: #4E5166;
            }
            &__addedImage{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                width: 100%;
                border: 2px solid #999999;
                background-color: #ffffff;
                
                &__name {
                    text-align: left;
                    margin: 0;
                    overflow:hidden;
                    text-overflow: ellipsis;
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
                &__image {
                    text-align: left;
                    border: 2px solid #999999;
                    background-color: #ffffff;
                }
            }
            &__btn {
                padding: 0px;
                width: 50%;
                height: 40px;
                background-color: #ee7575;
                color: #ffffff;
                &__delete{
                    border-radius: 0 0 0 10px;
                    border-right: solid 1.5px #ffffff;
                }
                &__upload {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                &__submit {
                    border-radius: 0 0 10px 0;
                    border-left: solid 1.5px #ffffff;
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