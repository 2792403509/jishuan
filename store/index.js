import Vue from 'vue'
import Vuex from 'vuex'
import tabBer from './module/taber'
import getters from './getters'
import appstore from './module/appstore'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
	tabBer,
	appstore
  },
  getters
})
