// #ifdef APP-VUE 
// import { Signature } from '@signature'
import { Signature } from './signature'
export default {
	data() {
		return {
			canvasid: null,
			signature: null,
			observer: null,
			options: {},
			saveCount: 0,
		}
	},
	mounted() {
		this.$nextTick(this.init)
	},
	methods: {
		init() {
			const el = this.$refs.limeSignature;
			const canvas = document.createElement('canvas')
			canvas.style = 'width:100%; height: 100%;'
			el.appendChild(canvas)
			this.signature = new Signature({
				el: canvas
			})
			this.signature.pen.setOption(this.options)
			const width = this.signature.canvas.get('width')
			const height = this.signature.canvas.get('height')

			this.emit({
				changeSize: {
					width,
					height
				}
			})
		},
		undo(v) {
			if (v && this.signature) {
				this.signature.undo()
			}
		},
		clear(v) {
			if (v && this.signature) {
				this.signature.clear()
			}
		},
		save(v) {
			if (v !== this.saveCount) {
				this.saveCount = v;
				const image = this.signature.canvas.get('el').toDataURL()
				const {backgroundColor,landscape} = this.options
				if (landscape || backgroundColor) {
					const canvas = document.createElement('canvas')
					const width = this.signature.canvas.get('width')
					const height = this.signature.canvas.get('height')
					const pixelRatio = this.signature.canvas.get('pixelRatio')
					const size = [width, height]
					if(landscape) {size.reverse()}
					canvas.width = size[0] * pixelRatio
					canvas.height = size[1] * pixelRatio
					const context = canvas.getContext('2d')
					context.scale(pixelRatio, pixelRatio)
					if (landscape) {
						context.translate(0, width)
						context.rotate(-Math.PI / 2)
					}
					if (backgroundColor) {
						context.fillStyle = backgroundColor
						context.fillRect(0, 0, width, height)
					}
					context.drawImage(this.signature.canvas.get('el'), 0, 0, width, height)
					this.emit({
						save: canvas.toDataURL()
					})
					canvas.remove()
				} else {
					this.emit({
						save: image
					})
				}
			}
		},
		isEmpty(v) {
			if (v && this.signature) {
				const isEmpty = this.signature.isEmpty()
				this.emit({
					isEmpty
				})
			}
		},
		emit(event) {
			this.$ownerInstance.callMethod('onMessage', {
				detail: {
					data: [{
						event
					}]
				}
			})
		},
		update(v) {
			if (v) {
				if (this.signature) {
					this.options = v
					this.signature.pen.setOption(v)
				} else {
					this.options = v
				}
			}
		}
	}
}
// #endif