const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
// const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')
const AssetsManifest = require('webpack-assets-manifest')

const isDevMode = process.env.NODE_ENV === 'development'
const filename = ext => isDevMode ? '[name].' + ext : '[name].[contenthash:8].' + ext

let plugins = [
	// svg спрайты
	new SpriteLoaderPlugin({
		plainSprite: true
	}),
	// Этот плагин веб-пакета сгенерирует файл JSON, который соответствует исходному имени файла с хешированной версией.
	new AssetsManifest({
		output: 'manifest.json',
		publicPath: true,
	}),
	// для отчищение в dist, данных перед пересборкой проекта
	new CleanWebpackPlugin(),
	// минификация и экстрадирование css в отдельную директорию
	new MiniCssExtractPlugin({
		filename: 'css/' + filename('css')
	})
]

if(!isDevMode) {
  	// сборка для прода
	// копировать все что необходимо
	plugins.push(
		new CopyWebpackPlugin({
			patterns: [
				{ from: 'img', to: 'img/' + filename('[ext]') },
			],
		})
	)
	// оптимизация изобаржений
	plugins.push(
		new ImageminPlugin({
			test: /\.(jpe?g|png|gif)$/i,
			cacheFolder: path.join(__dirname, `./node_modules/.cache/imagemin-webpack-plugin`),
			jpegtran: {
				progressive: true
			}
		})
	)
	// конвертация изображений в формат WebP, с сохранением при этом исходных файлов
	// plugins.push(
	// 	new ImageminWebpWebpackPlugin({
	// 		config: [{
	// 			test: /\.(jpe?g|png)/,
	// 			options: { quality:  80 }
	// 		}],
	// 	})
	// )
}

module.exports = {
	mode: process.env.NODE_ENV, // режим сборки
	// настройка путей
	context: path.join(__dirname, './public/assets/src'),
	resolve: { alias: { '@src': path.join(__dirname, './public/assets/src') } },
	// входные файлы
	entry: {
		main: '/js/pages/main',
		maintenance: '/js/pages/maintenance',
		newsCatalog: '/js/pages/newsCatalog',
		contact: '/js/pages/contact',
		disclosure: '/js/pages/disclosure',
		'404': '/js/pages/404',
		'500': '/js/pages/500',
	},
	// результат сборки
	output: {
		filename: 'js/' + filename('js'),
		path: path.join(__dirname, './public/assets/dist'),
		publicPath: '/'
	},
	devtool: false,
	target: 'web',
	plugins,
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					}
				}
			},
			{
				test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: filename('[ext]'),
							outputPath: 'fonts/',
							publicPath: '/assets/src/fonts/'
						}
					}
				],
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				loader: 'file-loader',
				options: {
					name: filename('[ext]'),
				},
			},
			{
				test: /\.svg$/i,
				loader: `svg-sprite-loader`,
				options: {
					extract: true,
					spriteFilename: `/img/sprite.svg`,
				}
			},
			{
				test: /\.s[ac]ss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '/public/assets/dist/css/',
							// sourceMap: true
						},
					},
					'css-loader?url=false',
					'sass-loader',
				],
			},
		]
	}
}
