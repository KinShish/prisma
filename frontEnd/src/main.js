import Vue from 'vue'
import VueRouter from 'vue-router'
import { BootstrapVue } from 'bootstrap-vue'
import axios from 'axios'
import VueAxios from 'vue-axios'


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.use(VueAxios, axios)
Vue.use(BootstrapVue)
Vue.use(VueRouter)
import {router} from './config/router'
Vue.prototype.$server='http://kinshish.ru/api/'
Vue.config.productionTip = false
let app = {
    initialize: function() {
        this.bindEvents();
        if(process.env.NODE_ENV==='development'){
            this.setupVue();
        }
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function() {
        if(process.env.NODE_ENV!=='development'){
            this.setupVue()
        }
    },
    setupVue: function() {
        new Vue({
            name:"app",
            el: "#app",
            router,
            data(){
                return{

                }
            }
        });
    }
};

app.initialize();
