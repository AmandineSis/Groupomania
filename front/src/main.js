import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Vue3Mq } from "vue3-mq";
/******************Style and icon import ************************* */
import './assets/styles/reset.scss';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEye, faUserSecret, faGear, faSignOutAlt, faMagnifyingGlass, faImage, faPaperPlane, faHeart, faComment, faXmark, faHouse, faEllipsis, faEyeSlash, faBars } from '@fortawesome/free-solid-svg-icons'
import { faHeart as farHeart, faComment as farComment } from '@fortawesome/free-regular-svg-icons'
/******************************************************************* */



const app = createApp(App)
//Décommenter pour rendre Vuex store invisible
//app.config.performance = false;

/* Vue3Mq 'devices' preset
    phone	0
    tablet	768
    laptop	1370
    desktop	1906
    */
    app.use(Vue3Mq, {
      preset: 'devices'
    })
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
  faEllipsis,
  faBars);

//AJOUT DES ICONES A LA LIBRAIRIE - REGULAR ICON    
library.add(
  farHeart,
  farComment);    

