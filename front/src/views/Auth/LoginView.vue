<template>
  
    <form class="form">
        <div class="inputContainer">
            <BaseInput
                class="form__input"
                v-model="event.email"
                label="email"
                 type="email"
            />
            <BaseInput
                class="form__input"
                v-model="event.password"
                label="password"
                type="password"
            />
            <p v-if="status == 'error_login'">identifiants de connexion incorrects</p>
        </div>
        <div class="form__valid">
            <button type="reset">Annuler</button>
            <button class="button" type= "button" @click="login">Se connecter</button>
        </div>
        <p v-if="status == 'loading'">Connexion en cours...</p>
        
    </form> 
</template>

<script>
import BaseInput from '@/components/Base/BaseInput.vue'
import { mapState } from 'vuex'

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
            }
        }
    },
    computed: {
        ...mapState(['status'])
    }
    ,methods: {
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


