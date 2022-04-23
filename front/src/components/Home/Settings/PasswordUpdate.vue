<template>
    <div class="userUpdate" >
        PasswordUpdate...
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    
    name: 'PasswordUpdate',
     data(){
        return{
            event: {
                password: '',
            },
            error: {
                passwordError: false
            },
            pswdReg: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,}$/,
            passwordValid: false
        }
    },
    computed: {
        passwordValidation(){
            if (this.passwordValid) {
                return true;
            }else{
                return false
                }
            },
            ...mapState(['status'])
    },
    methods: {  
        isPasswordValid() {
            this.pswdReg.test(this.event.password) 
            ? (this.passwordValid= true, this.error.passwordError = false) 
            : (this.passwordValid= false, this.error.passwordError = true);
        }
        
    }
}
</script>

<style scoped lang="scss">

</style>