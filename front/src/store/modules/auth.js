export default {
state:{

    event: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    },
    error: {
        firstNameError:false,
        lastNameError:false,
        emailError: false,
        emailExists: false,
        passwordError: false
    },
    firstNameValid: false,
    lastNameValid: false,
    emailValid: false,
    passwordValid: false,
    nameReg: /^([a-zA-ZÀ-ÿ]{3,20}(['|s|-]{1}[a-zA-ZÀ-ÿ]{0,20})*)$/,
    emailReg: /^[a-z0-9]+([_|.|-]{1}[a-zA0-9]+)*@[a-z0-9]+([_|.|-]{1}[a-z0-9]+)*[.]{1}[a-z]{2,6}$/,
    pswdReg: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,}$/
},
getters:{
    loginValidation(){
        if ( this.event.email !== "" && this.event.password !== "") {
            return true;
        }else{
            return false
            }
        },
    signupValidation(){
        if ( this.firstNameValid && this.lastNameValid && this.emailValid && this.passwordValid) {
            return true;
        }else{
            return false
        }
        },
    isFirstNameValid() {
        this.nameReg.test(this.event.firstName) 
        ? (this.firstNameValid= true, this.error.firstNameError = false) 
        : (this.firstNameValid= false, this.error.firstNameError = true);
        },
    isLastNameValid() {
        this.nameReg.test(this.event.lastName) 
        ? (this.lastNameValid= true, this.error.lastNameError = false) 
        : (this.lastNameValid= false, this.error.lastNameError = true);
        },
    isEmailValid() {
        let LowerCaseEmail= this.event.email.toLowerCase();
        this.emailReg.test(LowerCaseEmail) 
        ? (this.emailValid= true, this.error.emailError = false) 
        : (this.emailValid= false, this.error.emailError = true);
        },
    isPasswordValid() {
        this.pswdReg.test(this.event.password) 
        ? (this.passwordValid= true, this.error.passwordError = false) 
        : (this.passwordValid= false, this.error.passwordError = true);
        },   
},
mutation:{
    setAuthStatus(state, authStatus){
        state.authStatus = authStatus;
    },
    logUser(state, user){
        instance.defaults.headers.common = {'Authorization': `bearer ${user.token}`}
        localStorage.setItem('user', JSON.stringify(user));
        state.user = user;
    },
    
},
actions:{
    login: ({ commit }, loginInfos ) => {
        commit('setAuthStatus', 'loading');
        return new Promise ((resolve, reject) => {
        instance
            .post('/user/login', loginInfos)
            .then(function (response) {
                commit('setAuthStatus', '')
                commit('logUser', response.data )
                resolve(response)
            })
            .catch(function (error) {
                commit('setAuthStatus', 'error_login')
                reject(error)
            });
        })
    },
    createAccount: ({ commit }, userInfos ) => {
        commit('setAuthStatus', 'loading');
        return new Promise ((resolve, reject) => {
        instance
            .post('/user/signup', userInfos)
            .then(function (response) {
                commit('setAuthStatus', 'created')
                resolve(response)
            })
            .catch(function (error) {
                commit('setAuthStatus', 'error_create')
                reject(error)
            });
        });
    },
}
}