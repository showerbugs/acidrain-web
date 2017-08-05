import _ from 'lodash';
import Vue from 'vue'
import App from './App'
import Vuetify from 'vuetify'
import router from './router'

Vue.use(Vuetify)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
});
