export default {
    namespaced: true, 
    state:{
        updateMenuIsActive:false,
        searchBarIsActive:false,
        deleteUserBlockIsActive: false
    },
    getters:{
  
    },
    mutations:{
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