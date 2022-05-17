<template>
    <div class="passwordUpdate" >
        <form class="passwordUpdate__form">
            <BaseInput
                        class="passwordUpdate__form__input"
                        v-model="event.oldPassword"
                        label="Ancien mot de passe"
                        type="password"
            />
            <BaseInput
                        class="passwordUpdate__form__input"
                        v-model="event.newPassword"
                        v-on:change="isPasswordValid"
                        label="Nouveau mot de passe"
                        type="password"
            />
            
        </form>
         <div class="passwordUpdate__form__valid">
            <button class="passwordUpdate__form__valid__button" :class="{'passwordUpdate__form__valid__button--disabled' : !passwordValid}" type= "button" @click="updatePassword" > Valider
                <!-- <span v-if="status == 'loading'">Modification en cours...</span>
                <span v-else>Modifié</span> -->
            </button>
            <p v-if="error.passwordError">Veuillez saisir au moins 8 caratères, une majuscule, une minuscule, un chiffre et un caractère spécial</p>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import BaseInput from '@/components/Base/BaseInput.vue';
export default {
    
    name: 'PasswordUpdate',
    components: {
        BaseInput
    },
     data(){
        return{
            event: {
                oldPassword: '',
                newPassword: '',
            },
            error: {
                passwordError: false
            },
            pswdReg: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,}$/,
            passwordValid: false
        }
    },
    computed: {
        passwordValidation(){
            if (this.passwordValid) {
                return true;
            }else{
                return false
                }
            },
            ...mapState({
                status: 'status',
                user: 'user'
        })
    },
    methods: {  
        isPasswordValid() {
            this.pswdReg.test(this.event.newPassword) 
            ? (this.passwordValid= true, this.error.passwordError = false) 
            : (this.passwordValid= false, this.error.passwordError = true);
        },
        updatePassword(){
            const oldPassword = this.event.oldPassword;
            const newPassword = this.event.newPassword;
            const userId = this.user.userId
            
            if(this.isPasswordValid){
                this.$store
                .dispatch('updatePassword',
                    {userId,oldPassword,newPassword})
                .then((res => {
                    console.log(res);
                    console.log('updatePassword dispatch done');

                    window.alert('Modifications effectuées !');
                    this.event.oldPassword='';
                    this.event.newPassword='';
                }), (err => {
                    console.log(err)
                }))
            } else {
                window.alert("Erreur mdp")
            }         
            }
             
    }
}
</script>

<style scoped lang="scss">
.passwordUpdate {
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
}    
</style>