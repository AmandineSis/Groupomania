<template>
    <div class="userUpdate" >
        <form class="userUpdate__form">
            <BaseInput
                class="userUpdate__form__input"
                v-model="event.firstName"
                v-on:change="isFirstNameValid"
                :label="userInfos.firstName"
                type="text"
            />
            <p v-if="error.firstNameError">Veuillez saisir au moins 3 caratères</p>
            <BaseInput
                class="userUpdate__form__input"
                v-model="event.lastName"
                v-on:change="isLastNameValid"
                :label="userInfos.lastName"
                type="text"
            />
            <p v-if="error.lastNameError">Veuillez saisir au moins 3 caratères</p>
            <BaseInput
                class="userUpdate__form__input"
                v-model="event.email"
                v-on:change="isEmailValid"
                :label="userInfos.email"
                type="email"
            />
            <p v-if="error.emailError">Veuillez saisir un email valide</p>
            <p v-if="error.emailExists">Cet email existe déjà</p>
        </form>


        <div class="userUpdate__form__valid">
            <button class="userUpdate__form__valid__button" type= "button" @click="updateUser" > Valider
                <!-- <span v-if="status == 'loading'">Modification en cours...</span>
                <span v-else>Modifié</span> -->
            </button>
    
        </div>
    </div>
</template>

<script>
import BaseInput from '@/components/Base/BaseInput.vue';
import { mapState } from 'vuex'

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

            firstNameValid: false,
            lastNameValid: false,
            emailValid: false
        }
    },
    computed: {
        
        updateValidation(){
            if ( this.firstNameValid && this.lastNameValid && this.emailValid) {
                return true;
            }else{
                return false
                }
            },
            ...mapState({
                status: 'status',
                user: 'user',
                userInfos: 'userInfos',
                postComments: 'postComments'
        })
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
        updateUser() {
            //const self = this;
            const userId = this.user.userId
            this.$store
                .dispatch('updateUser',
                    {userId,
                    firstName: this.event.firstName,
                    lastName: this.event.lastName,
                    email: this.event.email})
                .then((res => {
                    console.log(res);
                    console.log('updateUser dispatch done');

                    window.alert('Modifications effectuées !');
                    this.$store
                    .dispatch('getUser', userId )
                    .then(() => {
                        console.log("getUSer dispatch done !")
                });
                }), (err => {
                    console.log(err)
                }))
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
            margin: 3px auto;}
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