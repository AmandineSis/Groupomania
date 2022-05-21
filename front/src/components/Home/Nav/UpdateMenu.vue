<template>
 
        <div class="updateMenu" >
            <div class="updateMenu__selection">
                <button class="updateMenu__selection__btn" @click="switchToIdentification">Modifier mes identifiants</button>
                <button class="updateMenu__selection__btn" @click="switchToPassword">Modifier mot de passe</button>
                <button class="updateMenu__selection__btn" @click="switchToProfilePicture">Modifier photo de profil</button>
                <button class="updateMenu__selection__btn updateMenu__selection__btn__delete " v-if="user.userId != 1" @click="switchToDeleteAccount">Supprimer mon compte</button>

            </div>
            <UserUpdate v-if="mode == 'identification'"/>
            <PasswordUpdate v-if="mode == 'password'"/>
            <PictureUpdate v-if="mode == 'profilePicture'"/>
            <DeleteAccount v-if="mode == 'deleteAccount'"/>
        </div>

</template>

<script>
import UserUpdate from '@/components/Home/Nav/Update/UserUpdate.vue';
import PasswordUpdate from '@/components/Home/Nav/Update/PasswordUpdate.vue';
import PictureUpdate from '@/components/Home/Nav/Update/PictureUpdate.vue';
import DeleteAccount from '@/components/Home/Nav/Update/DeleteAccount.vue';
import { mapState } from 'vuex';
export default {

    name: 'UpdateMenu',
    components: {
        UserUpdate,
        PasswordUpdate,
        PictureUpdate,
        DeleteAccount
    },
    data() {
        return {
            mode: 'identification'
        }
    },
    computed: {
        ...mapState({
            user: 'user'
        })
    },
    methods: {  
        switchToPassword() {
            this.mode = 'password';
        },
        switchToProfilePicture() {
            this.mode = 'profilePicture';
        },
        switchToDeleteAccount() {
            this.mode = 'deleteAccount';
        },
        switchToIdentification() {
            this.mode = 'identification';
        },
    }
}
</script>

<style scoped lang="scss">

.popupContainer{
    width: 100%;
    height: 210px;
    position: fixed;
    top: 120px;
    left: 0;
    z-index: 100;
    background: #ee7575;
}

.updateMenu {
    max-width: 550px;
    height: 150px;
    margin: 30px auto;
    
    z-index: 1000;
    display: flex;
    flex-direction: row;
    background-color: white;
    border: 2px solid #999999;
    align-items: center;
    border-radius: 20px;
    box-shadow: rgba(0, 0, 0, 0.6) 0px 5px 15px;
    &__selection {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 50%;
        margin: 2px;
        &__btn {
            font-size: 1em;
            color: white;
            width: 80%;
            height: 25px;
            margin: 3px auto;
            border-radius: 5px;
            background-color: #ee7575;
            transition: .4s background-color;
            cursor: pointer;
    
            transform: scale(1);
            transition-property: transform;
            transition-duration: 400ms;
    
            &:hover {
                transform: scale(1.1);
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

</style>