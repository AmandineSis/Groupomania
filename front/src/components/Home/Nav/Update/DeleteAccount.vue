<template>
    <div class="deleteUser" >
        <p class="deleteUser__text" v-if="updateMenuIsActive">
            Entrez votre mot de passe pour supprimer ce compte :
        </p>
        <form class="deleteUser__form">
            <BaseInput
                class="deleteUser__form__input"
                v-model="event.password"
                label="mot de passe"
                type="password"
            />
            <p v-if="error.passwordError">Mot de passe invalide</p>
        </form>


        <div class="deleteUser__form__valid">
            <button class="deleteUser__form__valid__button" :class="{'deleteUser__form__valid__button--disabled' : !event.password}" type= "button" @click="deleteAccount" > Valider
                <!-- <span v-if="status == 'loading'">Modification en cours...</span>
                <span v-else>Modifié</span> -->
            </button>
    
        </div>
    </div>
</template>

<script>
import BaseInput from '@/components/Base/BaseInput.vue';
import {  mapState, mapMutations, mapActions } from 'vuex'
export default {
    name: 'DeleteAccount',
    components: {
        BaseInput
    },
    data(){
        return{
            event: {
                password: ''
            },
            error: {
                passwordError: false
            },
        }
    },
    computed: {
        ...mapState({
            status: 'status',
            user: 'user'
        }),
        ...mapState('toggle',{
            updateMenuIsActive: 'updateMenuIsActive'
        })
    },
    methods: {  
        ...mapMutations(['LOG_OUT']),
        ...mapActions(['deleteUser']),
        deleteAccount(){
            const password = this.event.password;
            const userId = this.user.userId;
            if (password != ""){
                if (window.confirm(`Attention ! Toutes les données de cet utilisateur seront perdues, êtes-vous sûr de vouloir supprimer ?`)){
                    this.deleteUser({userId, password})
                    .then((res => {
                        console.log(res);
                        console.log('deleteUser dispatch done');
                        this.LOG_OUT();
                        this.$router.push('/');
                    }), (err => {
                        console.log(err);
                        window.alert('Mot de passe invalide !');
                        this.event.password ="";
                        this.passwordField= false;
                    }))
                }else{
                    this.event.password = "";
                    }
            }else{
                window.alert('Veuillez entrer un mot de passe !');
            }
            
        }           
    }
}
</script>

<style scoped lang="scss">
.deleteUser {
    display: flex;
    flex-direction: column;
    width: 50%;
    &__text{
        width: 90%;
        text-align: left;
    }
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
                 &--disabled{
                    background-color: grey;
                }
                
            }
        }
    }   
}    

</style>