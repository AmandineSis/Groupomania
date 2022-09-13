/***************************************************************************/
/*                        Global toggle data                               */
/***************************************************************************/

export default {
    namespaced: true, 
    state:{
        //Header Nav
        updateMenuIsActive:false,
        settingsMenuIsActive: false,
        searchBarIsActive:false,
        deleteUserBlockIsActive: false,
    },
    getters:{
    },
    mutations:{
        //Header Nav
        UPDATE_MENU_TOGGLE(state){
            state.updateMenuIsActive = !state.updateMenuIsActive
        },
        UPDATE_MENU_CLOSE(state){
            state.updateMenuIsActive = false
        },
        SETTINGS_MENU_TOGGLE(state){
            state.settingsMenuIsActive = !state.settingsMenuIsActive
        },
        SEARCH_BAR_TOGGLE(state){
            state.searchBarIsActive = !state.searchBarIsActive
        },
        DELETE_USER_TOGGLE(state){
            state.deleteUserBlockIsActive = !state.deleteUserBlockIsActive
        },
        DELETE_USER_CLOSE(state){
            state.deleteUserBlockIsActive = false
        },
    },
    actions:{ 
    }
}