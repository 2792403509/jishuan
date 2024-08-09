import {
	appConfig
} from "@/common/config/appConfig.js";
import {
	encryptJson,
	decryptJson
} from "@/common/js/encrypt.js";
/**
 * beanName 必填字段
 * invokMethod 必填字段
 * params 参数
 * loading 加载中动画 默认显示，传false关闭
 **/
let ajaxTimes = 0;
console.log(appConfig);
export function callApi(beanName, invokMethod, params, loading, mask = false) {
	const requsetParams = {
		params: {
			...params,
			userId: uni.getStorageSync("userInfo") ?
				uni.getStorageSync("userInfo").userId :
				"",
		},
		userInfo: uni.getStorageSync("userInfo") ?
			uni.getStorageSync("userInfo") :
			{},
		beanName: beanName,
		invokMethod: invokMethod,
	};

	var requsetParams1 = {
		...requsetParams
	};
	if (appConfig.appEncrypt) {
		// console.log('传参')
		console.log(requsetParams1);
		requsetParams1 = encryptJson(requsetParams1);
	}
	if (invokMethod != "uploadFile") {
		console.log(
			"[" +
			beanName +
			"](" +
			invokMethod +
			")-param:" +
			JSON.stringify(requsetParams1)
		);
	}
	if (loading || loading === undefined) {
		loading = true;
	} else {
		loading = false;
	}
	if (loading) {
		ajaxTimes++;
		uni.showLoading({
			title: "加载中",
			mask: mask,
		});
	}
	var baseurl = "";
	if (process.env.NODE_ENV !== "development") {
		// 生产请求/监理环境请求
		baseurl =
			"http://127.0.0.1:" +
			uni.getStorageSync("tjtbUrlport") +
			"/jjpt-app-cloud/serv/bd/app/entrance";
	} else {
		baseurl =
			"/jjpt-app-cloud/serv/bd/app/entrance?path=" +
			beanName +
			"/" +
			invokMethod;
	}
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseurl, //由基础路径和接口地址
			method: "POST", //请求的方式必须大写
			data: requsetParams1, //参数
			header: {
				"Content-Type": "application/json;charset=UTF-8",
			},
			// 成功使用resolve
			success: (res) => {
				// console.log(ajaxTimes)
				/* 解密数据 */
				if (appConfig.appEncrypt) {
					resolve(decryptJson(res.data));
				} else {
					resolve(res.data);
				}
			},
			//失败调用reject，
			fail: (err) => {
				if (loading) {
					showError(err);
				}
				reject(err);
			},
			complete: () => {
				if (loading) {
					ajaxTimes--;
				}
				if (ajaxTimes === 0) {
					uni.hideLoading();
				}
			},
		});
	});
}

// 错误处理
const showError = (error) => {
	if (error) {
		switch (error) {
			case 401:
				uni.showToast({
					title: "没有权限",
					icon: "none",
					duration: 1000,
				});
				break;

			case 403:
				uni.showToast({
					title: "拒绝访问",
					icon: "none",
					duration: 1000,
				});
				break;

			case 404:
				uni.showToast({
					title: "很抱歉，资源未找到!",
					icon: "none",
					duration: 1000,
				});
				break;

			case 500:
				uni.showToast({
					title: "没有权限",
					icon: "none",
					duration: 1000,
				});
				break;

			case 502:
				uni.showToast({
					title: "服务器异常",
					icon: "none",
					duration: 1000,
				});
				break;

			case 504:
				uni.showToast({
					title: "网络超时",
					icon: "none",
					duration: 1000,
				});
				break;

			default:
				uni.showToast({
					title: "网络错误",
					icon: "none",
					duration: 1000,
				});
				break;
		}
	}
};