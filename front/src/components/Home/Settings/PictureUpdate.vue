<template>
    <div class="pictureUpdate" >
        <form class="pictureUpdate__form">
            <label for="uploadImage" class="form__btn form__btn__upload"></label>
            <input id="uploadImage" type="file" accept="image/jpeg, image/png, image/jpg" @change="updloadProfilePicture">
    
            <div class="pictureUpdate__form__valid">
                <button class="pictureUpdate__form__valid__button" type= "button" @click="updatePicture" > Valider
                    <!-- <span v-if="status == 'loading'">Modification en cours...</span>
                    <span v-else>Modifié</span> -->
                </button>
            </div>
        </form>
    
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'PictureUpdate',
    data(){
        return{
            profilePic:""      
            }
    },
    computed: {
        ...mapState({
                user: 'user'
        })
    },
    methods: {
        updloadProfilePicture(e){
            this.profilePic = e.target.files[0];
            console.log("click ok!");
        },
        updatePicture(e){
           // console.log("test");
            e.preventDefault();
            const userId = this.user.userId
            const fdProfile = new FormData();
            if (this.profilePic) {
                fdProfile.append('image', this.profilePic, this.profilePic.name);
            }
            this.$store
                    .dispatch('updateUserPicture', {userId,fdProfile})
                    .then((res => {
                        console.log(res);
                        console.log('updateUser dispatch done');

                        window.alert('Modifications effectuées !');
                        
                        this.$store
                            .dispatch('getUser', userId )
                            .then(() => {
                                console.log("getUSer dispatch done !")
                        });
                    }), (err => {
                        console.log(err)
                }))
            }
        }      
    
}
</script>

<style scoped lang="scss">
.pictureUpdate {
    display: flex;
    flex-direction: column;
    width: 50%;
    &__form{
        display: flex;
        flex-direction: column;
        width: 100%;
        &__input {
            /*display: flex;
            flex-direction: column;
            align-items: center;*/
            width: 90%;
            height: 25px;
            border-radius: 5px;
            margin: 3px auto;
            }
        &__upload{
            width: 90px;
            height: 90px;
            border-radius: 50px;
            border: 2px solid #999999;
        }
        &__valid{
            width: 100%;
            &__button {
                font-size: 1em;
                color: white;
                width: 90%;
                height: 25px;
                margin: 3px auto;
                border-radius: 5px;
                background-color: #ee7575;
                transition: .4s background-color;
                &:hover {
                    background-color: #a71e05;
                    color: #ffffff;
                }
            }
        }
    }   
}
.form__btn{
    width: 100%;
}
#uploadImage {
    width: 100%;
    &::file-selector-button{
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 1em;
                color: white;
                width: 90%;
                height: 25px;
                margin: 3px auto;
                border-radius: 5px;
                background-color: #ee7575;
                transition: .4s background-color;
                &:hover {
                    background-color: #a71e05;
                    color: #ffffff;
                }
    }
       // opacity: 0;
        //position: absolute;
       // z-index: -1;
    }
</style>