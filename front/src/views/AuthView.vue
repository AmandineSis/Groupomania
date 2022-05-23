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
            <p class="form__input__error" v-if="mode == 'signup' && error.firstNameError">Veuillez saisir au moins 3 caratères</p>
            <BaseInput
                v-if=" mode == 'signup'"
                class="form__input"
                v-model="event.lastName"
                v-on:change="isLastNameValid"
                label="Nom"
                type="text"
            />
            <p class="form__input__error" v-if="mode == 'signup' && error.lastNameError">Veuillez saisir au moins 3 caratères</p>
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
import BaseInput from '@/components/Base/BaseInput.vue'
import { mapState, mapActions } from 'vuex'
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
        //Validation des champs de connexion
        loginValidation(){
            if ( this.event.email !== "" && this.event.password !== "") {
                return true;
            }else{
                return false
                }
            },
        //Validation des champs d'inscription
        signupValidation(){
            if ( this.firstNameValid && this.lastNameValid && this.emailValid && this.passwordValid) {
                return true;
            }else{
                return false
                }
            },
        ...mapState({
            status:'status',
            user: 'user'
            })
    },
    methods: {
        ...mapActions('auth',['login','createAccount']),
        ...mapActions(['getUserLoggedIn']),
        //Vérification des données utilisateur
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

        //Toggle entre login et signup
        switchToSignup() {
            this.mode = 'signup';
        },
        switchToLogin() {
            this.mode = 'login';
        },

        //Connexion de l'utilisateur
        logUser(){
    
            this.login({
                    email: this.event.email,
                    password: this.event.password})
                .then((res => {
                    console.log(res.userId)
                    const userId = res.userId;
                    console.log('login dispatch done');
                    this.getUserLoggedIn({userId})
                        .then((res=> {
                            console.log(res)
                            console.log('getUserLoggedIn dispatch done');
                            this.$router.push('Home')    
                            }), (err => {
                                console.log(err)
                                this.error.loginError = true;
                            }))
                }), (err => {
                    console.log(err)
                    console.log(err)
                    this.error.loginError = true;
                    }))       
        },
        //Inscription de l'utilisateur
        createUserAccount() {
            const self = this;
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


