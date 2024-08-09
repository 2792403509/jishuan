<template>
	<view>
		<view style="width: 750rpx; height: 950rpx;">
			<l-signature disableScroll backgroundColor="#000"  ref="signatureRef" :penColor="penColor" :penSize="penSize"
				:minLineWidth="2" :openSmooth="openSmooth"></l-signature>
		</view>
		<!-- <uni-popup ref="popup" type="bottom">
			<l-signature v-if="show" beforeDelay="1000" disableScroll backgroundColor="#000" ref="signatureRef2" :penColor="penColor"
				:penSize="penSize" :minLineWidth="2" :openSmooth="openSmooth"></l-signature>
		</uni-popup> -->
		<view>
			<!-- <button @click="open">弹出</button> -->
			<button @click="onClick('clear')">清空</button>
			<button @click="onClick('undo')">撤销</button>
			<button @click="onClick('save')">保存</button>
			<button @click="onClick('openSmooth')">压感{{openSmooth?'开':'关'}}</button>
		</view>
		<image :src="url" v-if="url" mode="widthFix"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				penColor: 'red',
				penSize: 16,
				url: '',
				show: false,
				openSmooth: true,
				bottomHeight: 0,
				customBar: this.CustomBar || 0,
			}
		},
		methods: {
			open() {
				// 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
				this.$refs.popup.open()
				this.show = true
			},
			onClick(type) {
				if (type == 'openSmooth') {
					this.openSmooth = !this.openSmooth
					return
				}
				if (type == 'save') {
					this.$refs.signatureRef.canvasToTempFilePath({
						success: (res) => {
							this.url = res.tempFilePath
						}
					})
					return
				}
				if (this.$refs.signatureRef)
					this.$refs.signatureRef[type]()
			}
		}
	}
</script>

<style>
</style>