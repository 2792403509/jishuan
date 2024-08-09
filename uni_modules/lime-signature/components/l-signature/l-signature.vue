<template>
	<view class="lime-signature" v-if="show" :style="[canvasStyle, styles]" ref="limeSignature">
		<!-- #ifndef APP-VUE || APP-NVUE -->
		<canvas 
		v-if="useCanvas2d"
		class="lime-signature__canvas"
		:id="canvasId" 
		type="2d"
		:disableScroll="disableScroll"
		@touchstart="touchStart"
		@touchmove="touchMove"
		@touchend="touchEnd"
		></canvas>
		<canvas 
		v-else
		:disableScroll="disableScroll"
		class="lime-signature__canvas"
		:canvas-id="canvasId" 
		:id="canvasId"
		:width="canvasWidth"
		:height="canvasHeight"
		@touchstart="touchStart"
		@touchmove="touchMove"
		@touchend="touchEnd"
		@mousedown="touchStart"
		@mousemove="touchMove"
		@mouseup="touchEnd"
		></canvas>
		<canvas 
			class="offscreen" 
			canvas-id="offscreen" 
			id="offscreen" 
			:style="'width:' + offscreenSize[0] + 'px;height:' + offscreenSize[1] + 'px'" 
			:width="offscreenSize[0]" 
			:height="offscreenSize[1]">
		</canvas>
		<!-- #endif -->
		<!-- #ifdef APP-VUE -->
		<view 
		:id="canvasId"
		:disableScroll="disableScroll"
		:rparam="param"
		:change:rparam="sign.update"
		
		:rclear="rclear"
		:change:rclear="sign.clear"
		
		:rundo="rundo"
		:change:rundo="sign.undo"
		
		:rsave="rsave"
		:change:rsave="sign.save"
		
		:rempty="rempty"
		:change:rempty="sign.isEmpty"
		
		></view>	
		<!-- #endif -->
		<!-- #ifdef APP-NVUE -->
		<web-view 
		src="/uni_modules/lime-signature/static/index.html"
		class="lime-signature__canvas"
		ref="webview"
		@pagefinish="onPageFinish"
		@error="onError"
		@onPostMessage="onMessage"
		></web-view>
		<!-- #endif -->
	</view>
</template>
<!-- #ifdef APP-VUE -->
<script module="sign" lang="renderjs">
export {default}  from './render'
</script>		
<!-- #endif -->

<script>
	// #ifndef APP-NVUE
	import {canIUseCanvas2d, wrapEvent, requestAnimationFrame, sleep} from './utils'
	import {Signature} from './signature'
	// import {Signature} from '@signature';
	import {uniContext, createImage, toDataURL} from './context'
	// #endif
	import props from './props';
	import {base64ToPath, getRect} from './utils'
	export default {
		props,
		data() {
			return {
				canvasWidth: null,
				canvasHeight: null,
				useCanvas2d: true,
				show: true,
				offscreenStyles: '',
				// #ifdef APP-PLUS
				rclear: 0,
				rundo: 0,
				rsave: 0,
				rempty: 0,
				risEmpty: true,
				toDataURL: null,
				tempFilePath: [],
				// #endif
			}
		},
		computed: {
			canvasId() {
				return `lime-signature${this._uid||this._.uid}`
			},
			offscreenId() {
				return this.canvasId + 'offscreen'
			},
			offscreenSize() {
				const {canvasWidth, canvasHeight} = this
				return this.landscape ? [canvasHeight, canvasWidth] : [canvasWidth, canvasHeight]
			},
			canvasStyle() {
				const {canvasWidth, canvasHeight, backgroundColor} = this
				return {
					width: canvasWidth && (canvasWidth + 'px'),
					height: canvasHeight && (canvasHeight + 'px'),
					background: backgroundColor
				}
			},
			param() {
				const {penColor, penSize, backgroundColor, landscape, openSmooth, minLineWidth, maxLineWidth, minSpeed, maxWidthDiffRate, maxHistoryLength, disableScroll} = this
				return JSON.parse(JSON.stringify({penColor, penSize, backgroundColor, landscape, openSmooth, minLineWidth, maxLineWidth, minSpeed, maxWidthDiffRate, maxHistoryLength, disableScroll}))
			}
		},
		// #ifdef APP-NVUE
		watch: {
			param(v) {
				this.$refs.webview.evalJS(`update(${JSON.stringify(v)})`)
			}
		},
		// #endif
		// #ifndef APP-PLUS
		created() {
			this.useCanvas2d = this.type == '2d' && canIUseCanvas2d()
		},
		// #endif
		// #ifndef APP-PLUS
		async mounted() {
			if(this.beforeDelay) {
				await sleep(this.beforeDelay)
			}
			const config = await this.getContext()
			this.signature = new Signature(config)
			this.canvasEl =  this.signature.canvas.get('el')
			this.canvasWidth = this.signature.canvas.get('width')
			this.canvasHeight = this.signature.canvas.get('height')
			
			this.stopWatch = this.$watch('param' , (v) => {
				this.signature.pen.setOption(v)
			}, {immediate: true})
		},
		// #endif
		// #ifndef APP-PLUS
		// #ifdef VUE3
		beforeUnmount() {
			this.stopWatch && this.stopWatch()
			this.signature.destroy()
			this.signature = null
			this.show = false;
		},
		// #endif
		// #ifdef VUE2
		beforeDestroy() {
			this.stopWatch && this.stopWatch()
			this.signature.destroy()
			this.show = false;
			this.signature = null
		},
		// #endif
		// #endif
		methods: {
			// #ifdef MP-QQ
			// toJSON() { return this },
			// #endif
			// #ifdef APP-PLUS
			onPageFinish() {
				this.$refs.webview.evalJS(`update(${JSON.stringify(this.param)})`)
			},
			onMessage(e = {}) {
				const {detail: {data: [res]}} = e
				if(res.event?.save) {
					 this.toDataURL = res.event.save
				}
				if(res.event?.changeSize) {
					const {width, height} = res.event.changeSize
				}
				if(res.event.hasOwnProperty('isEmpty')) {
					this.risEmpty = res.event.isEmpty
				}
				if (res.event?.file) {
					this.tempFilePath.push(res.event.file)
					if (this.tempFilePath.length > 7) {
						this.tempFilePath.shift()
					}
					return
				}
				if (res.event?.success) {
					if (res.event.success) {
						this.tempFilePath.push(res.event.success)
						if (this.tempFilePath.length > 8) {
							this.tempFilePath.shift()
						}
						this.toDataURL = this.tempFilePath.join('')
						this.tempFilePath = []
					} else {
						this.$emit('fail', 'canvas no data')
					}
					return
				}
			},
			// #endif
			undo() {
				// #ifdef APP-VUE || APP-NVUE
				this.rundo += 1
				// #endif
				// #ifdef APP-NVUE
				this.$refs.webview.evalJS(`undo()`)
				// #endif
				// #ifndef APP-VUE
				if(this.signature)
					this.signature.undo()
				// #endif
			},
			clear() {
				// #ifdef APP-VUE || APP-NVUE
				this.rclear += 1
				// #endif
				// #ifdef APP-NVUE
				this.$refs.webview.evalJS(`clear()`)
				// #endif
				// #ifndef APP-VUE
				if(this.signature)
					this.signature.clear()
				// #endif
			},
			isEmpty() {
				// #ifdef APP-NVUE
				this.$refs.webview.evalJS(`isEmpty()`)
				// #endif
				// #ifdef APP-VUE || APP-NVUE
				this.rempty += 1
				// #endif
				// #ifndef APP-VUE || APP-NVUE
				return this.signature.isEmpty()
				// #endif
			},
			canvasToTempFilePath(param) {
				const isEmpty = this.isEmpty()
				// #ifdef APP-NVUE
				this.$refs.webview.evalJS(`save()`)
				// #endif
				// #ifdef APP-VUE || APP-NVUE
				const stopURLWatch = this.$watch('toDataURL', (v, n) => {
					if(v && v !== n) {
						// if(param.pathType == 'url') {
						base64ToPath(v).then(res => {
							param.success({tempFilePath: res,isEmpty: this.risEmpty })
						})
						// } else {
						// 	param.success({tempFilePath: v,isEmpty: this.risEmpty })
						// }
						this.toDataURL = ''
					}
					stopURLWatch && stopURLWatch()
				})
				this.rsave += 1
				// #endif
				// #ifndef APP-VUE || APP-NVUE
				const success = (success) => param.success && param.success(success)
				const fail = (fail) => param.fail && param.fail(err)
				const {canvas} = this.signature.canvas.get('el')
				const {backgroundColor, landscape} =  this
				const width = this.signature.canvas.get('width')
				const height = this.signature.canvas.get('height')
				
				const canvasToTempFilePath = (image) => {
					const context = uni.createCanvasContext('offscreen', this)
					context.save()
					context.setTransform(1,0,0,1,0,0)
					if(landscape) {
						context.translate(0, width)
						context.rotate(-Math.PI / 2)
					}
					if(backgroundColor) {
						context.fillStyle = backgroundColor
						context.fillRect(0,0, width, height)
					}
					context.drawImage(image, 0, 0, width, height);
					
					context.draw(false, () => {
						toDataURL('offscreen', this, param).then((res) => {
							const size = Math.max(width, height)
							context.restore()
							context.clearRect(0,0, size, size)
							success({tempFilePath: res, isEmpty})
						})
					})
				}
				
				if(this.useCanvas2d) {
					try{
						// #ifndef MP-ALIPAY
						base64ToPath(canvas.toDataURL()).then(canvasToTempFilePath)
						// #endif
						// #ifdef MP-ALIPAY
						canvas.toTempFilePath({
							canvasid: this.canvasid,
							success(res){
								canvasToTempFilePath(res.tempFilePath)
							},
							fail
						})
						// #endif
					} catch(err){fail(err)}
				} else {
					toDataURL(this.canvasId, this).then(canvasToTempFilePath).catch(fail)
				}
				// #endif
			},
			// #ifndef APP-PLUS
			getContext() {
				return getRect(`#${this.canvasId}`, {context: this, type: this.useCanvas2d ? 'fields': 'boundingClientRect'}).then(res => {
					if(res) {
						let {width, height, node: canvas, left, top, right} = res
						let {pixelRatio} = uni.getSystemInfoSync()
						let context;
						if(canvas) {
							context = canvas.getContext('2d')
							canvas.width = width * pixelRatio;
							canvas.height = height * pixelRatio;
						} else {
							pixelRatio = 1
							context = uniContext(uni.createCanvasContext(this.canvasId, this))
							canvas = {
								createImage, 
								toDataURL: () => toDataURL(this.canvasId, this), 
								requestAnimationFrame
							}
						}
						// 支付宝小程序 使用stroke有个默认背景色
						context.clearRect(0,0,width,height)
						return { left, top, right, width, height, context, canvas, pixelRatio};
					}
				})
			},
			touchStart(e) {
				if(!this.canvasEl) return
				this.isStart = true
				this.canvasEl.dispatchEvent('touchstart', wrapEvent(e))
			},
			touchMove(e) {
				if(!this.canvasEl || !this.isStart && this.canvasEl) return
				this.canvasEl.dispatchEvent('touchmove', wrapEvent(e))
			},
			touchEnd(e) {
				if(!this.canvasEl) return
				this.isStart = false
				this.canvasEl.dispatchEvent('touchend', wrapEvent(e))
			},
			// #endif
		}
	}
</script>
<style lang="stylus">
	.lime-signature,.lime-signature__canvas
		// #ifndef APP-NVUE
		width: 100%;
		height: 100%
		// #endif
		// #ifdef APP-NVUE
		flex: 1;
		// #endif
	.offscreen {
		position: fixed;
		top: 0
		left: 1500rpx;
	}
</style>