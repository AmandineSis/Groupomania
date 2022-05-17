<template>
    <div class="userSettings" >
        <p>Entrer le mot de passe administrateur pour supprimer ce compte</p>
        <DeleteAccount/>
    </div>
</template>

<script>
import DeleteAccount from '@/components/Home/Settings/DeleteAccount.vue';
import { mapState } from 'vuex';
export default {

    name: 'DeleteBlock',
    components: {
        
        DeleteAccount
    },
    data() {
        return {
            
        }
    },
    computed: {
        ...mapState({
            user: 'user'
        })
    },
    methods: {  
        
    }
}
</script>

<style scoped lang="scss">
.userSettings {
    display: flex;
    flex-direction: column;
    border: 2px solid #999999;
        background-color: white;
        margin: 30px auto;
        width: 500px;
        //height: 130px;
        align-items: center;
        border-radius: 20px;
        padding: 10px;
   
}

</style>