<!------------------------------------------------------------------------------------>
<!--                 COMPOSANT MODIFICATION DES DONNEES UTILISATEUR                 -->
<!------------------------------------------------------------------------------------>

<template>
    <div class="userUpdate" :class="{'userUpdate--sizeUp' : media == 'phone'}">
        <form class="userUpdate__form">
            <BaseInput
                class="userUpdate__form__input"
                :class="{'userUpdate__form__input--sizeUp' : media == 'phone'}"
                :value="userLoggedIn.firstName"
                @input="event.firstName = $event.target.value"
                @change="isFirstNameValid"
                type="text"
            /> 
            <p class="userUpdate__form__input__error" v-if="error.firstNameError">Veuillez saisir au moins 3 caratères alphabétiques</p>
            <BaseInput
                class="userUpdate__form__input"
                :class="{'userUpdate__form__input--sizeUp' : media == 'phone'}"
                :value="userLoggedIn.lastName"
                @input="event.lastName = $event.target.value"
                @change="isLastNameValid"
                type="text"
            />
            <p class="userUpdate__form__input__error" v-if="error.lastNameError">Veuillez saisir au moins 3 caratères alphabétiques</p>
            <BaseInput
                class="userUpdate__form__input"
                :class="{'userUpdate__form__input--sizeUp' : media == 'phone'}"
                :value="userLoggedIn.email"
                @input="event.email = $event.target.value"
                @change="isEmailValid"
                type="email"
            />
            <p class="userUpdate__form__input__error" v-if="error.emailError">Veuillez saisir un email valide</p>
            <p class="userUpdate__form__input__error" v-if="error.emailExists">Cet email existe déjà</p>
        </form>
        <div class="userUpdate__form__valid">
            <button class="userUpdate__form__valid__button" :class="{'userUpdate__form__valid__button--disabled' : !userDataValidation}" type="button" @click="updateUserInfos" >Valider</button>
        </div>
    </div>
</template>

<script>

//Composant
import BaseInput from '@/components/Base/BaseInput.vue';

//store et mixins
import { mapActions, mapState, mapMutations } from 'vuex'
import { userValidationMixin } from '@/mixins/userValidationMixin'
import { homePostsMixin } from '@/mixins/homePostsMixin'
import { profilePostsMixin } from '@/mixins/profilePostsMixin'


export default {
    name: 'UserUpdate',
    mixins: [
        userValidationMixin, 
        homePostsMixin, 
        profilePostsMixin
    ],
    components: {
        BaseInput
    },
    //props provenant d'UpdateMenu
    props: {
        media: String,
        selectedPage: String,
        selectedTab: String,
    },
    computed: {
        userDataValidation(){
            if ( this.userLoggedIn.firstName || this.firstNameValid && this.userLoggedIn.lastName || this.lastNameValid && this.userLoggedIn.email || this.emailValid) {
                return true;
            }else{
                return false
            }
        },
        ...mapState({
            userLoggedIn: 'userLoggedIn',
            postComments: 'postComments',
        }),
    },
    methods: {
        ...mapMutations(['SET_STATUS']),
        ...mapActions(['updateUser','getUserLoggedIn']),
        
        //Mise à jour des données utilisateurs
        updateUserInfos() {
            const userId = this.user.userId
            const firstNameUpdate = (this.event.firstName ? this.event.firstName : this.userLoggedIn.firstName)
            const lastNameUpdate = (this.event.lastName ? this.event.lastName : this.userLoggedIn.lastName)
            const emailUpdate = (this.event.email ? this.event.email : this.userLoggedIn.email)
            //si données invalides => erreur
            if(!this.userDataValidation){
                return this.SET_STATUS('error_update_user')
            }else{
                this.updateUser({userId,
                        firstName: firstNameUpdate,
                        lastName: lastNameUpdate,
                        email: emailUpdate})
                    .then((() => {
                        console.log('updateUser dispatch done');
                        window.alert('Modifications effectuées !');
                        this.getUserLoggedIn(userId)
                            .then(() => {
                                console.log("getUserLoggedIn dispatch done !");
                                //mise à jour des publications
                                if(this.selectedPage == "homePage"){
                                    this.getAllRecentPosts();
                                    this.getAllPopularPosts();
                                    this.getAllReportedPosts();
                                }else if(this.selectedPage == "profilePage"){
                                    const userId = this.$route.params.userId;
                                    this.getPostsByUserId(userId);
                                    this.getPopularPostsByUserId(userId);
                                }
                        }), (err => {
                            console.log(err)
                        })}))
            }
        }    
    }
}
</script>

<style scoped lang="scss">
.userUpdate {
    display: flex;
    flex-direction: column;
    width: 50%;
    &--sizeUp{
        width: 100%;
        height: auto;
        margin-top: 20px;
    }
    &__form{
        display: flex;
        flex-direction: column;
        width: 100%;
        &__input {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 90%;
            height: 25px;
            border-radius: 5px;
            margin: 3px auto;
            &--sizeUp{
                height: 30px;
            }
            &__error{
                font-size: 13px;
                color: #ee7575;
            }
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
                &--disabled{
                    background-color: grey;
                }
                &:hover {
                    background-color: #a71e05;
                    color: #ffffff;
                }
                &__delete{
                    color: #ee7575;
                    background-color: #ffffff;
                    border: 1px solid #ee7575;
                }
            }
        }
        
    }
}

</style>