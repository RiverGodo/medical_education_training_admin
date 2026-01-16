import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import store from './store';
import router from './config/index';
import './css';
import VueLocalStorage from 'vue-localstorage'
import iView from 'view-design';
import VueAMap from 'vue-amap'

Vue.use(iView);
Vue.use(VueLocalStorage)
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '64076a79c71bb09d3d8cbe87c41a7efb',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
