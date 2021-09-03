import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { BootstrapVue } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(Vuex)
Vue.use(VueRouter)
import {user} from './config/store'
import {router} from './config/router'

Vue.config.productionTip = false
const store = new Vuex.Store({
    modules: {
        user: user
    }
});
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
            store,
            router,
            data(){
                return{

                }
            }
        });
    }
};

app.initialize();
