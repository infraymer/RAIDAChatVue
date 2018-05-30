// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'

import watchs from './watches'

import toastr from 'cxlt-vue2-toastr'
import VModal from 'vue-js-modal'

var toastrConfig = {
  position: 'top left',
  timeOut: 5000,
  progressBar: true,
  successColor: '#2F96B4',
  showMethod: 'fadeInLeft',
  hideMethod: 'zoomOutLeft'
};

Vue.use(toastr, toastrConfig);
Vue.use(VModal, {dialog: true, dynamic: true});

Vue.config.productionTip = false;

/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  store: store,
  computed:{
    countServ(){
      return this.$store.state.servers.filter(serv => serv.status === true).length
    }
  },
  watch:{
    watchs
  },
})

export default app

