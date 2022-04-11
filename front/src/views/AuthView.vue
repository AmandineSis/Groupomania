<template>
  <div class="card">
      <h1 class="card__title" v-if="mode == 'login'">Connexion</h1>
      <h1 class="card__title" v-else>Inscription</h1>
    <p  class="card__subtitle" v-if="mode == 'login'">Pas encore de compte ? <span class="card__action" @click="switchToSignup">Créer un compte</span></p>
    <p  class="card__subtitle" v-else>Tu as déjà un compte ? <span class="card__action" @click="switchToLogin">Se connecter</span></p>
    <form class="form" >
        <div class="inputContainer">
        <BaseInput
            v-if=" mode == 'signup'"
            class="form__input"
            v-model="event.firstName"
            v-on:change="isFirstNameValid"
            label="firstName"
            type="text"
        />
        <p v-if="mode == 'signup' && error.firstNameError">Veuillez saisir au moins 3 caratères</p>
         <BaseInput
            v-if=" mode == 'signup'"
            class="form__input"
            v-model="event.lastName"
            v-on:change="isLastNameValid"
            label="lastName"
            type="text"
        />
         <p v-if="mode == 'signup' && error.lastNameError">Veuillez saisir au moins 3 caratères</p>
         <BaseInput
            class="form__input"
            v-model="event.email"
            v-on:change="isEmailValid"
            label="email"
            type="email"
        />
         <p v-if="mode == 'signup' && error.emailError">Veuillez saisir un email valide</p>
         <p v-if="mode == 'signup' && error.emailExists">Cet email existe déjà</p>
         <BaseInput
            class="form__input"
            v-model="event.password"
            v-on:change="isPasswordValid"
            label="password"
            type="password"
        />
         <p v-if="mode == 'signup' && error.passwordError">Veuillez saisir au moins 8 caratères, une majuscule, une minuscule, un chiffre et un caractère spécial</p>
        <p v-if="status == 'error_login'">identifiants de connexion incorrects</p>
        </div>
        <div class="form__valid">
            <button class="button" type= "button" :class="{'button--disabled' : !loginValidation}" @click="login" v-if=" mode == 'login'">Se connecter</button>
            <button  class="button" type="button" :class="{'button--disabled' : !signupValidation}" @click="createAccount" v-else>S'inscrire</button>
            
        </div>
    </form> 
  </div>
</template>

<script>
import BaseInput from '@/components/Base/BaseInput.vue'
import { mapState } from 'vuex'


export default ({
    name: 'SignupForm',
    components: {
        BaseInput
    },
    data(){
        return{
            mode: 'login',
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
        loginValidation(){
            if ( this.event.email !== "" && this.event.password !== "") {
                return true;
            }else{
                return false
                }
            },
        signupValidation(){
            if ( this.firstNameValid && this.lastNameValid && this.emailValid && this.passwordValid) {
                return true;
            }else{
                return false
                }
            },
            ...mapState(['status'])
    },
    methods: {  
        switchToSignup() {
            this.mode = 'signup';
        },
        switchToLogin() {
            this.mode = 'login';
        },
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
        login(){
            const self = this;
            this.$store
                .dispatch('login', {
                email: this.event.email,
                password: this.event.password})
                .then((res => {
                    self.$router.push('Home')
                    console.log(res)
                }), (err => {
                    console.log(err)
                    this.error.loginError = true;
                }))
        },
        createAccount() {
            const self = this;
            this.$store
                .dispatch('createAccount', {
                firstName: this.event.firstName,
                lastName: this.event.lastName,
                email: this.event.email,
                password: this.event.password})
                .then((res => {
                    self.login();
                    console.log(res)
                }), (err => {
                    console.log(err)
                }))
        }    
    }
})
</script>


<style scoped lang="scss">
.card {
  max-width: 100%;
  width: 540px;
  background:white;
  border-radius: 16px;
  padding:32px;
}

.card {
  max-width: 100%;
  width: 540px;
  background:white;
  border-radius: 16px;
  margin: 32px auto;
  padding:32px;
  &__title {
  text-align:center;
  font-weight: 800;
  }
  &__subtitle {
  text-align: center;
  color:#666;
  font-weight: 500;
  margin-top: 10px;
  }
  &__action {
    color:#2196F3;
    text-decoration: underline;
    &:hover {
        cursor:pointer;
    }
  }
}

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
    background: #EE7575;
    color:white;
    border-radius: 8px;
    font-weight: 800;
    font-size: 15px;
    border: none;
    width: 100%;
    padding: 16px;
    transition: .4s background-color;
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
            &:hover{
                cursor:not-allowed;
                background:#cecece;
            }
        }
}

</style>


