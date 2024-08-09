const dev = process.env.NODE_ENV === "development";
const devConfig = {
	// 思极密钥
	"sgAppKey": "8a7e046d86843c04aedb82d5b674df80",
	"sgSecret": "e607459fc8383c5cb8c88f482946d376",
	"baseSgUrl": "http://map.sgcc.com.cn",
};
const proConfig = {
	// 思极密钥
	"sgAppKey": "8a7e046d86843c04aedb82d5b674df80",
	"sgSecret": "e607459fc8383c5cb8c88f482946d376",
	"baseSgUrl": "https://map.sgcc.com.cn"
}
// 获取地址信息
function getBaseUrl() {
	if (dev) {
		return devConfig;
	} else {
		return proConfig;
	}
}
export default {
	namespaced: true,
	state: {
		baseUrl: getBaseUrl()
	},
	mutations: {

	},
	actions: {

	}
};