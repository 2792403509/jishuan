export const uniContext = (ctx) => {
	ctx.uniDrawImage = ctx.drawImage
	ctx.drawImage = (image,...agrs) => {
		ctx.uniDrawImage(image.src, ...agrs)
	}
	return ctx
}

class Image {
	constructor() {
		this.currentSrc = null
		this.naturalHeight = 0
		this.naturalWidth = 0
		this.width = 0
		this.height = 0
		this.tagName = 'IMG'
	}
	set src(src) {
		this.currentSrc = src
		uni.getImageInfo({
			src,
			success: (res) => {
				this.naturalWidth = this.width = res.width
				this.naturalHeight = this.height = res.height
				this.onload()
			},
			fail: () => {
				this.onerror()
			}
		})
	}
	get src() {
		return this.currentSrc
	}
}

export const createImage = () => {
	return new Image()
}
export function useCurrentPage() {
	const pages = getCurrentPages();
	return pages[pages.length - 1];
}
export const toDataURL = (canvasId, context, options = {}) => {
	// #ifdef MP-QQ
	// context = context.$scope
	// #endif
	// #ifdef MP-ALIPAY
	context = ''
	// #endif
	return new Promise((resolve, reject) => {
		uni.canvasToTempFilePath({
			...options,
			canvasId,
			success: (res) => {
				resolve(res.tempFilePath)
			},
			fail: (err) => {
				reject(err)
			}
		}, context)
	})
	
}