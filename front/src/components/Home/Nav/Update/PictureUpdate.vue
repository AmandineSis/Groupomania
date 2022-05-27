<template>
    <div class="pictureUpdate" >
        <form class="pictureUpdate__form">
            <input id="uploadImage" type="file" accept="image/jpeg, image/png, image/jpg" @change="updloadProfilePicture">
            <label for="uploadImage" class="form__btn form__btn__upload">Parcourir...</label>
            <p class="pictureUpdate__form__name">{{this.profilePic.name}}</p>
            <div class="pictureUpdate__form__valid">
                <button class="pictureUpdate__form__valid__button" type= "button" @click.prevent="updatePicture" > Valider
                </button>
            </div>
        </form>
    
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { homePostsMixin } from '@/mixins/homePostsMixin'
import { profilePostsMixin } from '@/mixins/profilePostsMixin'
export default {
    name: 'PictureUpdate',
    mixins: [homePostsMixin,profilePostsMixin],
    props: {
        selectedPage: String,
        selectedTab: String,
    },
    data(){
        return{
            profilePic:""      
            }
    },

    computed: {
        ...mapState({
            userLoggedIn: 'userLoggedIn',
        })
    },
    methods: {
        ...mapActions(['updateUserPicture', 'getUserLoggedIn']),
        updloadProfilePicture(e){
            this.profilePic = e.target.files[0];
            console.log("click ok!");
        },
        updatePicture(){
            const userId = this.user.userId
            const fdProfile = new FormData();
            if (this.profilePic) {
                fdProfile.append('image', this.profilePic, this.profilePic.name);
            }
            this.updateUserPicture({userId,fdProfile})
                .then((() => {
                    console.log(this.selectedPage);
                    console.log('updateUser dispatch done');
                    window.alert('Modifications effectuées !');
                        this.getUserLoggedIn({ userId })
                            .then(() => {
                                console.log("getUserLoggedIn dispatch done !");
                                if(this.selectedPage == "homePage" && this.selectedTab == "recentPosts"){
                                this.getAllRecentPosts();
                                }else if(this.selectedPage == "homePage" && this.selectedTab == "popularPosts"){
                                this.getAllPopularPosts();
                                } else {
                                this.getAllReportedPosts();
                                }
                        }), (err => {
                            console.log(err)
                        })})) 
        }}
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
        &__name {
            width: 90%;
            height: 25px;
            margin: 3px auto;
            border: 1px solid #ee7575;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space:nowrap;
            border-radius: 5px;
            padding: 4px;
        }
        &__input {
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
    display: block;
        font-size: 1em;
                color: white;
                width: 90%;
                height: 25px;
                margin: 3px auto;
                border-radius: 5px;
                background-color: #ee7575;
                transition: .4s background-color;
                text-align: center;
                padding: 4px;
                &:hover {
                    background-color: #a71e05;
                    color: #ffffff;
                }    
}

#uploadImage {
    opacity: 0;
    position: absolute;
    z-index: -1;
}
</style>