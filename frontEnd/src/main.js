import Vue from 'vue'
import VueRouter from 'vue-router'
import { BootstrapVue } from 'bootstrap-vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.use(VueAxios, axios)
Vue.use(BootstrapVue)
Vue.use(VueRouter)
import {router} from './config/router'
Vue.prototype.$server='http://kinshish.ru/'
Vue.config.productionTip = false
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
