<template>
    <div class="userSettings" >
        <div class="userSettings__selection">
            <button class="userSettings__selection__btn" @click="switchToIdentification">Modifier mes identifiants</button>
            <button class="userSettings__selection__btn" @click="switchToPassword">Modifier mot de passe</button>
            <button class="userSettings__selection__btn" @click="switchToProfilePicture">Modifier photo de profil</button>
            <button class="userSettings__selection__btn userSettings__selection__btn__delete " @click="switchToDeleteAccount">Supprimer mon compte</button>

        </div>
        <UserUpdate v-if="mode == 'identification'"/>
        <PasswordUpdate v-if="mode == 'password'"/>
        <PictureUpdate v-if="mode == 'profilePicture'"/>
        <div class="userSettings__input" v-if="mode == 'deleteAccount'">
                delete account
        </div>
    </div>
</template>

<script>
import UserUpdate from '@/components/Home/Settings/UserUpdate.vue';
import PasswordUpdate from '@/components/Home/Settings/PasswordUpdate.vue';
import PictureUpdate from '@/components/Home/Settings/PictureUpdate.vue';
export default {

    name: 'UserSettings',
    components: {
        UserUpdate,
        PasswordUpdate,
        PictureUpdate
    },
    data() {
        return {
            mode: 'identification'
        }
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
.userSettings {
    display: flex;
    flex-direction: row;
    border: 2px solid #999999;
        background-color: white;
        margin: 30px auto;
        width: 500px;
        height: 130px;
        align-items: center;
        border-radius: 20px;
    &__selection {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 50%;
        margin: 2px;
        &__btn {
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

</style>