/***************************************************************************/
/*                        Global toggle data                               */
/***************************************************************************/

export default {
    namespaced: true, 
    state:{
        //Header Nav
        updateMenuIsActive:false,
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
        SEARCH_BAR_TOGGLE(state){
            state.searchBarIsActive = !state.searchBarIsActive
        },
        
    },
    actions:{ 
    }
}