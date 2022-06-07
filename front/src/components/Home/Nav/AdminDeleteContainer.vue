<!------------------------------------------------------------------------------------>
<!--                 COMPOSANT CONTENEUR SUPPRESSION DE COMPTE UTILISATEUR          -->
<!------------------------------------------------------------------------------------>
<template>
    <div class="userUpdate"  >
        <p>Entrer le mot de passe administrateur pour supprimer ce compte</p>
        <DeleteAccount/>
    </div>
</template>

<script>
//composant
import DeleteAccount from '@/components/Home/Nav/Update/DeleteAccount.vue';

////store et mixins
import { mapState } from 'vuex';

export default {
    name: 'AdminDeleteContainer',
    components: {
        DeleteAccount
    },
    computed: {
        ...mapState({
            user: 'user'
        })
    },
}
</script>

<style scoped lang="scss">

.userUpdate {
    display: flex;
    flex-direction: column;
    border: 2px solid #999999;
    background-color: white;
    margin: 30px auto;
    max-width: 500px;
    height: 130px;
    align-items: center;
    border-radius: 20px;
    padding: 10px;
}

</style>