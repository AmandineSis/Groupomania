<template>
    <footer class="mainFooter" v-once>
        <ul class="mainFooter__list">
            <li class="mainFooter__list--items"><a href="#top">Mentions légales</a></li>
            <li class="mainFooter__list--items"><a :href="`mailto:${adminEmail}`">Contact</a></li>
        </ul>
    </footer>
</template>

<script>
export default {
    name: 'MainFooter',
    data(){
        return{
            adminEmail: 'admin@groupomania.com'
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .mainFooter {
        width: 100%;
        height: 50px;
        background-color: #4E5166;
        &__list{
            display: flex;
            flex-direction: row;
            
            &--items{
                color: white;
                margin-top: 20px;
            }
        }
    }


</style>