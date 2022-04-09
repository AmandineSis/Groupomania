<template>
    <form class="form">
        <div class="inputContainer">
            <BaseInput
                class="form__input"
                v-model="event.email"
                label="email"
                 type="email"
            />
            <p v-if="error.emailError">Email incorrect</p>
            <BaseInput
                class="form__input"
                v-model="event.password"
                label="password"
                type="password"
            />
            <p v-if="error.loginError">identifiants de connexion incorrects</p>
        </div>
        <div class="form__valid">
            <button type="reset">Annuler</button>
            <button type= "submit" @click="login">Se connecter</button>
        </div>
    </form> 
</template>

<script>
import BaseInput from '@/components/Base/BaseInput.vue'
import axios from 'axios';

export default ({
    name: 'LoginForm',
    components: {
        BaseInput,
   
    },
    data(){
        return{
            event: {
                email: '',
                password: ''
            },
            error: {
                loginError: false
                }
        }
    },
    methods: {
        login(){
            axios.post("http://localhost:8080/api/user/login", {
                    email: this.event.email,
                    password: this.event.password
                })
                .then(response => {
                    let userId = response.data.userId;
                    let token = response.data.token;
                    /*document.cookie = `userId=${userId}; SameSite=Lax; Secure; max-age=86400;`;
                    document.cookie = `userToken=${token}; SameSite=Lax; Secure; max-age=86400;`;*/
                    this.$store.commit('updateUser', userId);
                    this.$store.commit('updateToken', token);
                   
                    console.log(response.data.userId);
                    console.log(response.data.token);
                    //Redirection de l'utilisateur vers la page d'accueil
                    this.$router.push('/home');
                    history.replaceState({ ...history.state, ...true }, '');
                    console.log(response);
                })
                //Gestion des erreurs
                .catch(function (err){
                    console.log("erreur : " + err)});
                    this.error.loginError = true;
                    
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
}



.inputContainer {
    width: 100%;
    height: 275px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 20px 0 10px;
}



button {
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
}
.form__valid {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin: 30px auto;
}

p {
    width: 100%;
    font-family: "Roboto";
    color: #a71e05;
    font-size: 0.8rem;
    text-align: left;
    
}
</style>


