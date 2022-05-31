/*****************************************************/
/*         Mixin object for password validation      */
/*****************************************************/

import { mapState } from 'vuex'

export const passwordValidationMixin = {
    data(){
        return{
            mode: 'login',
            event: {
                password: '',
                oldPassword: '',
                newPassword: '',
            },
            error: {
                passwordError: false
            },
            pswdReg: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,}$/,
            passwordValid: false,
            newPasswordValid: false,
        }
    },
    computed: {
        ...mapState({
            status: 'status',
            user: 'user',
        }),
    },
    methods: {
        //password validation
        isPasswordValid() {
            this.pswdReg.test(this.event.password) 
            ? (this.passwordValid= true, this.error.passwordError = false) 
            : (this.passwordValid= false, this.error.passwordError = true);
        },
        isNewPasswordValid() {
            this.pswdReg.test(this.event.newPassword) 
            ? (this.newPasswordValid= true, this.error.passwordError = false) 
            : (this.newPasswordValid= false, this.error.passwordError = true);
        },

    }
    
}
