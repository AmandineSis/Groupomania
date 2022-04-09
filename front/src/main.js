import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/******************Style and icon import ************************* */
import './assets/styles/reset.scss';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret, faGear, faSignOutAlt, faMagnifyingGlass, faImage, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
/******************************************************************* */



library.add(faUserSecret, faUserSecret, faGear, faSignOutAlt, faMagnifyingGlass, faImage, faPaperPlane)

createApp(App)
    .use(store)
    .use(router)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
