
module.exports={
	devServer: {
		// 域名地址，使用需要配host；根域名必须与bsm一致，不然访问有问题
		// development server port 8000
		port: 90,
		// If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
		proxy: {
		  '/jjpt-app-cloud/': {
			// target: 'http://zuul.boot.js.sgcc.com.cn:6001',
			// target: 'http://26.47.125.252:18008/',
			// target: 'http://192.168.31.252:18008/',
			// target: 'http://10.134.174.14:18008/',//仇
			// target: 'http://26.47.121.41:18008/',  //谷老板
			// target: 'http://26.47.126.81:18008/',  //张
			// target: 'http://26.47.126.82:18008/',//管
			// target: 'http://127.0.0.1:18008/',//徐
			// target: 'http://26.47.124.225:18008/',  //刘家聪
			// target: 'http://26.47.126.74:18009/',
			pathRewrite:{
				'^/prefix':''
			},
			ws: false,
			changeOrigin: true
		  },
		  '/jjpt-app-external/': {
			// target: 'http://zuul.boot.js.sgcc.com.cn:6001',
			// target: 'http://26.47.125.252:18008/',
			// target: 'http://192.168.31.252:18008/',
 			// target: 'http://10.134.174.14:18008/',//仇
		    // target: 'http://26.47.126.82:18008/',//管
			// target: 'http://26.47.125.244:18008/',//徐
			// target: 'http://26.47.126.81:18007/',  //张
			// target: 'http://26.47.121.41:18007/',  //谷老板
			// target: 'http://26.47.126.75:18007/',  //刘
			// target: 'http://192.168.0.214:18008/',//徐
			// target: 'http://26.47.125.236:18008', //姚
			// target: 'http://26.47.121.41:18008', //74
			pathRewrite:{
				'^/prefix':''
			},
			ws: false,
			changeOrigin: true
		  }
		}
	}
}
