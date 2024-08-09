// midBtn 为设置tabBer中间的凸起，false为不凸起
import Vue from 'vue'
const taber={
	state:{
		list:uni.getStorageSync('tabbarList') || []
	},
	mutations:{
		SET_LIST: (state, list) => {
			Vue.set(state,'list',list)
			uni.setStorageSync('tabbarList',list)
		}
	},
	actions:{
		setList: ({commit, state}, list) => {
		  // console.log(state.number, number)
		  return commit('SET_LIST', list)
		}
	}
}
export default taber