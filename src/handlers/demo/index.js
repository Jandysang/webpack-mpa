import Vue from 'vue'
Vue.config.productionTip = false;

import App from '../../modules/demo/app.vue'

new Vue({
    el: '#app',
    components: { App },
    template:"<App />"
})