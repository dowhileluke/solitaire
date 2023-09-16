import { Asset, Preset, defineConfig, minimalPreset } from '@vite-pwa/assets-generator/config'

const padding = 0.25
const resizeOptions: Asset['resizeOptions'] = {
	background: 'aliceblue',
}
const preset: Preset = {
  transparent: {
    sizes: [192, 512],
    favicons: [[48, 'favicon.ico']],
		padding: 0,
  },
  maskable: {
    sizes: [
			// 512
		],
		padding,
		resizeOptions,
  },
  apple: {
    sizes: [180],
		padding,
		resizeOptions,
  },
	assetName(type, size) {
		switch (type) {
			case 'transparent':
				return `pwa-${size.width}x${size.height}.png`
			case 'maskable':
				return `maskable-${size.width}x${size.height}.png`
			case 'apple':
				return `apple-touch-icon.png`
		}
	},
}

export default defineConfig({
	preset,
  images: ['public/favicon.svg']
})
