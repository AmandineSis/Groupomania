import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import moment from 'moment'
/******************Style and icon import ************************* */
import './assets/styles/reset.scss';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret, faGear, faSignOutAlt, faMagnifyingGlass, faImage, faPaperPlane, faHeart, faComment } from '@fortawesome/free-solid-svg-icons'
import { faHeart as farHeart, faComment as farComment } from '@fortawesome/free-regular-svg-icons'
/******************************************************************* */

// createApp(App).use(router).use(store).mount('#app')
const app = createApp(App)
/**
 * @params {date} date to be converted to timeago
 * @returns returns timeAgo
 */
 app.config.globalProperties.$filters = {
    timeAgo(date) {
      return moment(date).fromNow()
    }
  }
library.add(
          faUserSecret, 
          faUserSecret, 
          faGear, 
          faSignOutAlt, 
          faMagnifyingGlass, 
          faImage, 
          faPaperPlane,
          faHeart,
          faComment);
library.add(farHeart,
            farComment);
app 
    .use(store)
    .use(router)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
