<template>
    <form class="form" >
        <div class="inputContainer">
        <BaseInput
            class="form__input"
            v-model="event.firstName"
            v-on:change="isFirstNameValid"
            label="firstName"
            type="text"
        />
        <p v-if="error.firstNameError">Veuillez saisir au moins 3 caratères</p>
         <BaseInput
            class="form__input"
            v-model="event.lastName"
            v-on:change="isLastNameValid"
            label="lastName"
            type="text"
        />
         <p v-if="error.lastNameError">Veuillez saisir au moins 3 caratères</p>
         <BaseInput
            class="form__input"
            v-model="event.email"
            v-on:change="isEmailValid"
            label="email"
            type="email"
        />
         <p v-if="error.emailError">Veuillez saisir un email valide</p>
         <p v-if="error.emailExists">Cet email existe déjà</p>
         <BaseInput
            class="form__input"
            v-model="event.password"
            v-on:change="isPasswordValid"
            label="password"
            type="password"
        />
         <p v-if="error.passwordError">Veuillez saisir au moins 8 caratères, une majuscule, une minuscule, un chiffre et un caractère spécial</p>
        </div>
        <div class="form__valid">
            <button class="button" type="reset">Annuler</button>
            <button  class="button" type="button" :class="{'button--disabled' : !signupValidation}" @click="createAccount" >S'inscrire</button>
        </div>
    </form> 
</template>

<script>
import BaseInput from '@/components/Base/BaseInput.vue'
//import axios from 'axios'

export default ({
    name: 'SignupForm',
    components: {
        BaseInput
    },
    data(){
        return{
            event: {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
            },
            error: {
                firstNameError:false,
                lastNameError:false,
                emailError: false,
                emailExists: false,
                passwordError: false
            },

            nameReg: /^([a-zA-ZÀ-ÿ]{3,20}(['|s|-]{1}[a-zA-ZÀ-ÿ]{0,20})*)$/,
            emailReg: /^[a-z0-9]+([_|.|-]{1}[a-zA0-9]+)*@[a-z0-9]+([_|.|-]{1}[a-z0-9]+)*[.]{1}[a-z]{2,6}$/,
            pswdReg: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,}$/,

            firstNameValid: false,
            lastNameValid: false,
            emailValid: false,
            passwordValid: false
        }
    },
    computed: {
        signupValidation(){
            if ( this.firstNameValid && this.lastNameValid && this.emailValid && this.passwordValid) {
                return true;
            }else{
                return false
                }
            }
    },
    methods: {  
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
        isPasswordValid() {
            this.pswdReg.test(this.event.password) 
            ? (this.passwordValid= true, this.error.passwordError = false) 
            : (this.passwordValid= false, this.error.passwordError = true);
        },   
        createAccount() {
            this.$store
                .dispatch('createAccount', {
                firstName: this.event.firstName,
                lastName: this.event.lastName,
                email: this.event.email,
                password: this.event.password})
                .then((res => {
                    console.log(res)
                }), (err => {
                    console.log(err)
                }))
        }    
    }
})
</script>


<style scoped lang="scss">
.form {
    height: 340px;
    width: 75%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 20px 0 10px;
    &__input{
        border:none;
        border-bottom: 1px solid #999999;
        width: 100%;
        height: 40px;
    }
    &__valid {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        margin: 30px auto;
    }
}

.inputContainer {
    width: 100%;
    height: 275px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 20px 0 10px;
}

p {
    width: 100%;
    font-family: "Roboto";
    color: #a71e05;
    font-size: 0.8rem;
    text-align: left;
    
}

.button {
        width: 100px;
        height: 40px;
        border-radius: 5px;
        background-color: #FFFFFF;
        border: solid 1.5px #a71e05;
        color: #a71e05;
        &:hover {
            background-color: #a71e05;
            color: #ffffff;
        }
        &:active {
            color: #a71e05;
            background-color: #ffffff;
        }
        &--disabled{
            background-color: grey;
        }
}

</style>


