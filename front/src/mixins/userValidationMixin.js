/*****************************************************/
/*         Mixin object for user data validation     */
/*****************************************************/

import { mapState } from 'vuex'

export const userValidationMixin = {
    data(){
        return{
            mode: 'login',
            event: {
                firstName: '',
                lastName: '',
                email: '',
            },
            error: {
                firstNameError:false,
                lastNameError:false,
                emailError: false,
                emailExists: false,
            },
            nameReg: /^([a-zA-ZÀ-ÿ]{3,20}(['|s|-]{1}[a-zA-ZÀ-ÿ]{0,20})*)$/,
            emailReg: /^[a-z0-9]+([_|.|-]{1}[a-zA0-9]+)*@[a-z0-9]+([_|.|-]{1}[a-z0-9]+)*[.]{1}[a-z]{2,6}$/,

            //variables utilisées sur AuthView
            firstNameValid: false,
            lastNameValid: false,
            emailValid: false,

            //variables utilisées sur UserUpdate
            firstNameUpdate:'',
            lastNameUpdate:'',
            emailUpdate:'',

            firstNameUpdateValid: true,
            lastNameUpdateValid: true,
            emailUpdateValid: true,
        }
    },
    computed: {
        ...mapState({
            user: 'user',
        }),
    },
    methods: {
        //User data validation
        isFirstNameValid() {
            this.nameReg.test(this.event.firstName) 
            ? (this.firstNameUpdateValid= true, this.error.firstNameError = false) 
            : (this.firstNameUpdateValid= false, this.error.firstNameError = true);
        },
        isLastNameValid() {
            this.nameReg.test(this.event.lastName) 
            ? (this.lastNameUpdateValid= true, this.error.lastNameError = false) 
            : (this.lastNameUpdateValid= false, this.error.lastNameError = true);
        },
        isEmailValid() {
            let LowerCaseEmail= this.event.email.toLowerCase();
            this.emailReg.test(LowerCaseEmail) 
            ? (this.emailUpdateValid= true, this.error.emailError = false) 
            : (this.emailUpdateValid= false, this.error.emailError = true);
        },
    }
}
