<template>
    <main class="auth">
        <h1 class="auth__main-title">Bienvenue</h1>
        <h2 class="auth__title" v-if="mode == 'login'">Connexion</h2>
        <h2 class="auth__title" v-else>Inscription</h2>
            <p  class="auth__subtitle" v-if="mode == 'login'">Pas encore de compte ? <span class="auth__action" @click="switchToSignup">Créer un compte</span></p>
            <p  class="auth__subtitle" v-else>Tu as déjà un compte ? <span class="auth__action" @click="switchToLogin">Se connecter</span></p>
        
        
        <form class="form" >
            <BaseInput
                v-if=" mode == 'signup'"
                class="form__input"
                v-model="event.firstName"
                v-on:change="isFirstNameValid"
                label="Prénom"
                type="text"
            />
            <p class="form__input__error" v-if="mode == 'signup' && error.firstNameError">Veuillez saisir au moins 3 caratères alphabétiques</p>
            <BaseInput
                v-if=" mode == 'signup'"
                class="form__input"
                v-model="event.lastName"
                v-on:change="isLastNameValid"
                label="Nom"
                type="text"
            />
            <p class="form__input__error" v-if="mode == 'signup' && error.lastNameError">Veuillez saisir au moins 3 caratères alphabétiques</p>
            <BaseInput
                class="form__input"
                v-model="event.email"
                v-on:change="isEmailValid"
                label="Email"
                type="email"
            />
            <p class="form__input__error" v-if="mode == 'signup' && error.emailError">Veuillez saisir un email valide</p>
            <p class="form__input__error" v-if="mode == 'signup' && error.emailExists">Cet email existe déjà</p>
            <BaseInput
                class="form__input"
                v-model="event.password"
                v-on:change="isPasswordValid"
                label="Mot de passe"
                type="password"
            />
            <p class="form__input__error" v-if="mode == 'signup' && error.passwordError">Veuillez saisir au moins 8 caratères, une majuscule, une minuscule, un chiffre et un caractère spécial</p>
            <p class="form__input__error" v-if="mode == 'login' && status == 'error_login'">identifiants de connexion incorrects</p>
        
            <div class="form__valid">
                <button class="form__valid__button" type= "button" :class="{'form__valid__button--disabled' : !loginValidation}" @click="logUser" v-if=" mode == 'login'">
                    <span v-if="status == 'loading'">Connexion en cours...</span>
                    <span v-else>Connexion</span>
                </button>
                <button  class="form__valid__button" type="button" :class="{'form__valid__button--disabled' : !signupValidation}" @click="createUserAccount" v-else>
                    <span v-if="status == 'loading'">Connexion en cours...</span>
                    <span v-else>Créer mon compte</span>
                </button>
            </div>

        </form> 
    </main>
</template>

<script>
//composant
import BaseInput from '@/components/Base/BaseInput.vue'

//store et mixins
import { mapActions } from 'vuex'
import { userValidationMixin } from '../mixins/userValidationMixin'
import { passwordValidationMixin } from '@/mixins/passwordValidationMixin'

export default ({
    name: 'SignupForm',
    mixins: [userValidationMixin, passwordValidationMixin],
    components: {
        BaseInput
    },
    computed: {
        //Login fields validation
        loginValidation(){
            if ( this.event.email !== "" && this.event.password !== "") {
                return true;
            }else{
                return false
                }
            },
        //Signup fields validation
        signupValidation(){
            if ( this.firstNameValid && this.lastNameValid && this.emailValid && this.passwordValid) {
                return true;
            }else{
                return false
                }
            }
    },
    methods: {
        ...mapActions('auth',['login','createAccount']),
        ...mapActions(['getUserLoggedIn']),

        //Toggle between login and signup
        switchToSignup() {
            this.mode = 'signup';
        },
        switchToLogin() {
            this.mode = 'login';
        },
        //User login
        logUser(){
            if(!this.loginValidation){
                return this.$store.commit('SET_STATUS', 'error_login')
            }else{
                this.login({
                        email: this.event.email,
                        password: this.event.password})
                    .then((res => {
                        console.log('login dispatch done');
                        const userId = res.data.userId;
                        this.getUserLoggedIn({userId})
                            .then((() => {
                                console.log('getUserLoggedIn dispatch done');
                                this.$router.push('Home')    
                                }), (err => {
                                    console.log(err)
                                    this.error.loginError = true;
                                }))
                    }), (err => {
                        console.log(err)
                        this.error.loginError = true;
                        }))    
            }   
        },
        //User signup
        createUserAccount() {
            const self = this;
            if(!this.signupValidation){
                return  this.status = 'error_signup'
            }else{
                this.createAccount({
                        firstName: this.event.firstName,
                        lastName: this.event.lastName,
                        email: this.event.email,
                        password: this.event.password})
                    .then((() => {
                        console.log('createAccount dispatch done');
                        self.logUser();
                    }), (err => {
                        console.log(err)
                    }))
            }
        }    
    }
})
</script>


<style scoped lang="scss">

.auth {
    max-width: 540px;
    margin: 32px auto;
    padding:32px;
    background:white;
    border-radius: 16px;
    border: 2px solid #EEEEEE;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
    &__main-title {
    font-size: 50px;
    font-weight: 900;
    margin: 20px;
    } 
    &__title {
    font-weight: 800;
    }
    &__subtitle {
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
        height: 40px;
        &__error{
            width: 100%;
            font-family: "Roboto";
            color: #a71e05;
            font-size: 0.8rem;
            text-align: left;
        }
    }
    &__valid {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        margin: 30px auto;
        &__button {
            width: 100%;
            padding: 16px;
            font-size: 15px;
            font-weight: 800;
            background: #EE7575;
            color:white;
            border-radius: 8px;
            border: none;
            transition: .4s background-color;
            &:hover {
                background-color: white;
                color: #EE7575;
                border: 2px solid #EE7575;
            }
            &--disabled{
                background-color: grey;
                &:hover{
                    cursor:not-allowed;
                    background-color:#cecece;
                    border: 2px solid grey;
                    color: white;
                }
            }
        }
    }
}
</style>


