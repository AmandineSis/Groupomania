<template>
    <div class="userUpdate" >
        <div class="userUpdate__selection">
            <button class="userUpdate__selection__btn" @click="switchToIdentification">Modifier mes identifiants</button>
            <button class="userUpdate__selection__btn" @click="switchToPassword">Modifier mot de passe</button>
            <button class="userUpdate__selection__btn" @click="switchToProfilePicture">Modifier photo de profil</button>
            <button class="userUpdate__selection__btn userUpdate__selection__btn__delete " v-if="user.userId != 1" @click="switchToDeleteAccount">Supprimer mon compte</button>

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

.userUpdate {
    width: 500px;
    height: 130px;
    margin: 30px auto;
    position: relative;
    z-index: 99;
    display: flex;
    flex-direction: row;
    background-color: white;
    border: 2px solid #999999;
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