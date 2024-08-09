import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
import store from './store'
Vue.prototype.$store = store
import uView from 'uview-ui'
// import './style/common.scss'
// import * as echarts from 'echarts' // echarts
// Vue.prototype.$echarts = echarts // echarts
// import chartColor from './common/chartColor.js'
// Vue.prototype.$chartColor = chartColor
Vue.use(uView);
// Vue.prototype.$wx = wx
App.mpType = 'app'
// Vconsole
// import Vconsole from 'vconsole'
// Vue.use(new Vconsole())

// ----------------------全局引入z-paging的mixin示例(使用页面滚动时需要引入)-------------------------
//如果需要全局引入z-paging的mixin，请使用下方注释掉的代码，当大多数页面都使用z-paging并使用页面滚动时，可进行全局mixin注册，此mixin仅对使用页面滚动时的z-paging有效

import ZPagingMixin from '@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin'
Vue.mixin(ZPagingMixin)
// ----------------------全局配置z-paging默认的属性值方案：第①步：引入z-paging-config-----------------------
//注意：这里的全局配置不是全局引入组件，全局配置是指统一配置z-paging默认的属性值，z-paging遵循easycom组件规范，无需注册即可使用。
//关于easycom组件规范，可查阅https://uniapp.dcloud.io/component/README?id=easycom组件规范
import zConfig from '@/uni_modules/z-paging/components/z-paging/js/z-paging-config'

// 防止连续点击
// import notMoreTap from '@/common/notMoreTap.js'
// Vue.prototype.$notMoreTap = notMoreTap .notMoreTap

//特殊字符串
// import filterSpecChar from '@/common/filterSpecChar.js'
// Vue.prototype.$filterSpecChar = filterSpecChar.filterSpecChar

// import vconsole from 'vconsole' // 引入vconsole
// Vue.prototype.$vconsole = new vconsole() // 使用vconsole



const app = new Vue({
    ...App
})
app.$mount()
