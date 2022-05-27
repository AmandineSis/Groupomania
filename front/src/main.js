import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/******************Style and icon import ************************* */
import './assets/styles/reset.scss';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEye, faUserSecret, faGear, faSignOutAlt, faMagnifyingGlass, faImage, faPaperPlane, faHeart, faComment, faXmark, faHouse, faEllipsis, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { faHeart as farHeart, faComment as farComment } from '@fortawesome/free-regular-svg-icons'
/******************************************************************* */

createApp(App)
    .use(store)
    .use(router)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')

//AJOUT DES ICONES A LA LIBRAIRIE - SOLID ICON    
library.add(
  faEye,
  faEyeSlash,
  faUserSecret,
  faGear, 
  faSignOutAlt, 
  faMagnifyingGlass, 
  faImage, 
  faPaperPlane,
  faHeart,
  faComment,
  faXmark,
  faHouse,
  faEllipsis);

//AJOUT DES ICONES A LA LIBRAIRIE - REGULAR ICON    
library.add(
  farHeart,
  farComment);    

