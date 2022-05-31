<template>
    <div class="passwordUpdate" >
        <form class="passwordUpdate__form">
            <div class="passwordUpdate__form__container">
                <BaseInput
                            class="passwordUpdate__form__input"
                            v-model="event.oldPassword"
                            label="Ancien mot de passe"
                            :type="oldPasswordFieldType"
                />
                <button class="passwordUpdate__button" type='password' @click.prevent="switchVisibilityOld">
                    <font-awesome-icon class="passwordUpdate__icon" v-if="showOldPassword" icon="eye"/>
                    <font-awesome-icon class="passwordUpdate__icon" v-else icon="eye-slash"/>
                </button>
            </div>
            <div class="passwordUpdate__form__container">
                <BaseInput
                            class="passwordUpdate__form__input"
                            v-model="event.newPassword"
                            v-on:change="isNewPasswordValid"
                            label="Nouveau mot de passe"
                            :type="newPasswordFieldType"
                />
                <button class="passwordUpdate__button" type='password' @click.prevent="switchVisibilityNew">
                    <font-awesome-icon class="passwordUpdate__icon" v-if="showNewPassword" icon="eye"/>
                    <font-awesome-icon class="passwordUpdate__icon" v-else icon="eye-slash"/>

                </button>
            </div>
        </form>
        <div class="passwordUpdate__form__valid">
            <button class="passwordUpdate__form__valid__button" :class="{'passwordUpdate__form__valid__button--disabled' : !newPasswordValid}" type= "button" @click="updateNewPassword" > Valider
            </button>
            <p v-if="error.passwordError">Veuillez saisir au moins 8 caratères, une majuscule, une minuscule, un chiffre et un caractère spécial</p>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import { passwordValidationMixin } from '@/mixins/passwordValidationMixin'
import BaseInput from '@/components/Base/BaseInput.vue';
export default {
    
    name: 'PasswordUpdate',
    mixins: [passwordValidationMixin],
    components: {
        BaseInput
    },
    data(){
        return{
            oldPasswordFieldType:"password",
            newPasswordFieldType:"password",
            showOldPassword:false,
            showNewPassword: false,
        }
    },
    methods: {  
        ...mapActions(['updatePassword']),

        //Toggle passwords visibility
        switchVisibilityOld(){
            this.showOldPassword= !this.showOldPassword;
            this.oldPasswordFieldType = this.oldPasswordFieldType === "password" ? "text" : "password";
        },
        switchVisibilityNew(){
            this.showNewPassword= !this.showNewPassword;
            this.newPasswordFieldType = this.newPasswordFieldType === "password" ? "text" : "password";
        },
        
        //Password update
        updateNewPassword(){
            const oldPassword = this.event.oldPassword;
            const newPassword = this.event.newPassword;
            const userId = this.user.userId
            
            this.updatePassword(
                {userId,oldPassword,newPassword})
            .then((res => {
                console.log(res);
                console.log('updatePassword dispatch done');
                window.alert('Modifications effectuées !');
                this.event.oldPassword='';
                this.event.newPassword='';
            }))
            .catch(() => {
                window.alert("Erreur: Votre ancien mot de passe est invalide !")
                    this.event.oldPassword='';
                    this.event.newPassword='';
            })
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
        width: 90%;
        &__container{
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 100%;
        }
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
    &__button{
        padding: 10px;
        background-color: white;
    }  
}    
</style>