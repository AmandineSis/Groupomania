<template>
    <div class="userUpdate" >
        <form class="userUpdate__form">
            <BaseInput
                class="userUpdate__form__input"
                :value="userLoggedIn.firstName"
                @input="event.firstName = $event.target.value"
                @change="isFirstNameValid"
                type="text"
            />
            <p class="userUpdate__form__input__error" v-if="error.firstNameError">Veuillez saisir au moins 3 caratères alphabétiques</p>
            <BaseInput
                class="userUpdate__form__input"
                :value="userLoggedIn.lastName"
                @input="event.lastName = $event.target.value"
                @change="isLastNameValid"
                type="text"
            />
            <p class="userUpdate__form__input__error" v-if="error.lastNameError">Veuillez saisir au moins 3 caratères alphabétiques</p>
            <BaseInput
                class="userUpdate__form__input"
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
import BaseInput from '@/components/Base/BaseInput.vue';
import { mapActions, mapState } from 'vuex'

export default {
    
    name: 'UserUpdate',
    components: {
        BaseInput
    },
     data(){
        return{
            mode: 'login',
            event: {
                firstName: '',
                lastName: '',
                email: ''
            },
            error: {
                firstNameError:false,
                lastNameError:false,
                emailError: false,
                emailExists: false
            },

            nameReg: /^([a-zA-ZÀ-ÿ]{3,20}(['|s|-]{1}[a-zA-ZÀ-ÿ]{0,20})*)$/,
            emailReg: /^[a-z0-9]+([_|.|-]{1}[a-zA0-9]+)*@[a-z0-9]+([_|.|-]{1}[a-z0-9]+)*[.]{1}[a-z]{2,6}$/,

            firstNameValid: true,
            lastNameValid: true,
            emailValid: true
        }
    },
    computed: {
        userDataValidation(){
            if ( this.firstNameValid && this.lastNameValid && this.emailValid) {
                return true;
            }else{
                return false
            }
        },
        ...mapState({
            status: 'status',
            user: 'user',
            userLoggedIn: 'userLoggedIn',
            postComments: 'postComments'
        }),
    },
    methods: {
        ...mapActions(['updateUser','getUserLoggedIn']),
        isFirstNameValid() {
            this.nameReg.test(this.event.firstName) 
            ? (this.firstNameValid= true, this.error.firstNameError = false) 
            : (this.firstNameValid= false, this.error.firstNameError = true);
        },
        isLastNameValid() {
            this.nameReg.test(this.event.lastName) 
            ? (this.lastNameValid= true, this.error.lastNameError = false) 
            : (this.lastNameValid= false, this.error.lastNameError = true);
        },
        isEmailValid() {
            let LowerCaseEmail= this.event.email.toLowerCase();
            this.emailReg.test(LowerCaseEmail) 
            ? (this.emailValid= true, this.error.emailError = false) 
            : (this.emailValid= false, this.error.emailError = true);
        },
        
        updateUserInfos() {
            const userId = this.user.userId
            const firstNameUpdate = (this.event.firstName ? this.event.firstName : this.userLoggedIn.firstName)
            const lastNameUpdate = (this.event.lastName ? this.event.lastName : this.userLoggedIn.lastName)
            const emailUpdate = (this.event.email ? this.event.email : this.userLoggedIn.email)
            if(!this.userDataValidation){
                return this.status= 'error_update'
            }else{
                this.updateUser({userId,
                        firstName: firstNameUpdate,
                        lastName: lastNameUpdate,
                        email: emailUpdate})
                    .then((res => {
                        console.log(res);
                        console.log('updateUser dispatch done');
                        window.alert('Modifications effectuées !');
                        this.getUserLoggedIn({ userId })
                            .then(() => {
                                console.log("getUserLoggedIn dispatch done !")
                            });
                        }), (err => {
                            console.log(err)
                        }))
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