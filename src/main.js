import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import { auth } from './firebase'

//import 'material-design-icons-iconfont/dist/material-design-icons.css'
import vuetify from './plugins/vuetify';

import '@mdi/font/css/materialdesignicons.css'

/*
import VueBarcodeScanner from 'vue-barcode-scanner'
let options = {
  sensitivity: 100, // default is 100
  requiredAttr: false, // default is false
  controlSequenceKeys: ['NumLock', 'Clear'], // default is null
  callbackAfterTimeout: false // default is false
} 
Vue.use(VueBarcodeScanner, options)
*/

import constants from "@/shared/constants.js"
Vue.prototype.$constants = constants

import helpers from "@/shared/helpers.js"
Vue.prototype.$helpers = helpers

import filters from "@/shared/filters.js"
Vue.prototype.$filters = filters

import { nanoid } from 'nanoid'
Vue.prototype.$nanoid = () => nanoid()

Vue.config.productionTip = false

import axios from 'axios'

//axios.defaults.baseURL = ''

Vue.$api = axios

console.object = function (message,obj) {
  
  console.log(message,JSON.stringify(obj));
};

////console.clear()

Vue.use(Vuetify)


//import vueXlsxTable from './components/vue-xlsx-table.vue'
//Vue.use(vueXlsxTable, {rABS: false})


Vue.config.productionTip = false

let app 
auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})

/*
new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')
*/