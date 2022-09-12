
<!--COMPOSANT MENU UPDATE-->

<template>
    <div class="updateMenu" :class="{'updateMenu--sizeUp' : phoneView == 'phone'}">
        <div class="updateMenu__top">
            <button class="updateMenu__btn updateMenu__btn--close " :class="{'updateMenu__selection__btn--sizeUp' : phoneView}" @click="closeUpdate"><font-awesome-icon class="updateMenu__close__icon" icon="xmark"/></button>
        </div>
        <div class="updateMenu__main" :class="{'updateMenu__main--sizeUp' : phoneView == 'phone'}">

            <div class="updateMenu__selection" :class="{'updateMenu__selection--sizeUp' : phoneView == 'phone'}">
                <button class="updateMenu__btn" :class="{'updateMenu__btn--sizeUp' : phoneView == 'phone'}" @click="switchToIdentification">Modifier mes identifiants</button>
                <button class="updateMenu__btn" :class="{'updateMenu__btn--sizeUp' : phoneView == 'phone'}" @click="switchToPassword">Modifier mot de passe</button>
                <button class="updateMenu__btn" :class="{'updateMenu__btn--sizeUp' : phoneView == 'phone'}" @click="switchToProfilePicture">Modifier photo de profil</button>
                <button class="updateMenu__btn updateMenu__btn--delete " :class="{'updateMenu__selection__btn--sizeUp' : phoneView == 'phone'}" v-if="user.moderator != 1" @click="switchToDeleteAccount">Supprimer mon compte</button>
            </div>
            <UserUpdate v-if="menu == 'identification'" :media='phoneView' :selectedPage='currentPage' :selectedTab='selectedMode'/>
            <PasswordUpdate v-if="menu == 'password'" :media='phoneView'/>
            <PictureUpdate v-if="menu == 'profilePicture'" :media='phoneView' :selectedPage='currentPage' :selectedTab='selectedMode'/>
            <DeleteAccount v-if="menu == 'deleteAccount'" :media='phoneView' :updateMenu='updateMenu'/>
        </div>
    </div> 
</template>

<script>

//Composant
import UserUpdate from '@/components//Nav/Update/UserUpdate.vue';
import PasswordUpdate from '@/components//Nav/Update/PasswordUpdate.vue';
import PictureUpdate from '@/components//Nav/Update/PictureUpdate.vue';
import DeleteAccount from '@/components//Nav/Update/DeleteAccount.vue';

//store et mixins
import { mapState, mapMutations } from 'vuex';

export default {

    name: 'UpdateMenu',
    //props provenant de HomeView
    props: {
        phoneView: String,
        currentPage: String,
        selectedMode: String,
    },
    components: {
        UserUpdate,
        PasswordUpdate,
        PictureUpdate,
        DeleteAccount
    },
    data() {
        return {
            menu: 'identification',
            updateMenu: 'updateMenu'
        }
    },
    computed: {
        ...mapState({
            user: 'user'
        })
    },
    methods: {  
        ...mapMutations('toggle',['UPDATE_MENU_TOGGLE']),
        switchToPassword() {
            this.menu = 'password';
        },
        switchToProfilePicture() {
            this.menu = 'profilePicture';
        },
        switchToDeleteAccount() {
            this.menu = 'deleteAccount';
        },
        switchToIdentification() {
            this.menu = 'identification';
        },
        closeUpdate(){
            this.UPDATE_MENU_TOGGLE()
        },
        
    }
}
</script>

<style scoped lang="scss">

.updateMenu {
    max-width: 550px;
    min-height: 150px;
    margin: 30px auto;
    z-index: 1000;
    background-color: white;
    border: 2px solid #999999;
    align-items: center;
    border-radius: 20px;
    box-shadow: rgba(0, 0, 0, 0.6) 0px 5px 15px;
    &--sizeUp{
        border-radius: 0;
    }
    &__top{
        width: 100%;
        text-align: right;
    }
    &__main{
        width: 100%;
        display: flex;
        flex-direction: row;
        margin-bottom: 20px;
        &--sizeUp{
            flex-direction: column;
        }
    }
    &__selection {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 50%;
        //margin: 2px;
        &--sizeUp{
            height: auto;
            width: 100%;
        }
    }
    &__btn {
        font-size: 1em;
        color: white;
        width: 90%;
        height: 25px;
        margin: 3px auto;
        border-radius: 5px;
        background-color: #ee7575;
        transition: .4s background-color;
        cursor: pointer;
        transform: scale(1);
        transition-property: transform;
        transition-duration: 400ms;
        &--sizeUp{
            height: 30px;
        }
        &:hover {
            transform: scale(1.1);
            background-color: #a71e05;
            color: #ffffff;
        }
        &--delete{
            color: #ee7575;
            background-color: #ffffff;
            border: 1px solid #ee7575;
        }
        &--close{
            width: 25px;
            border-radius: 90px;
            margin: 4px;
        }
        &--sizeUp {
            height: 30px;
        }
    }
}

</style>