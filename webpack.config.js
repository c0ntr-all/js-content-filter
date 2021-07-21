const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')
const AssetsManifest = require('webpack-assets-manifest')

const isDevMode = process.env.NODE_ENV === 'development'
const filename = ext => isDevMode ? '[name].' + ext : '[name].[contenthash:8].' + ext

let plugins = [
	new SpriteLoaderPlugin({
		plainSprite: true
	}),
	new AssetsManifest({
		output: 'manifest.json',
		publicPath: true,
	}),
	new CleanWebpackPlugin(),
	new MiniCssExtractPlugin({
		filename: 'css/' + filename('css')
	})
]

if(!isDevMode) {
	plugins.push(
		new CopyWebpackPlugin({
			patterns: [
				{ from: 'img', to: 'img/' + filename('[ext]') },
			],
		})
	)
	plugins.push(
		new ImageminPlugin({
			test: /\.(jpe?g|png|gif)$/i,
			cacheFolder: path.join(__dirname, `./node_modules/.cache/imagemin-webpack-plugin`),
			jpegtran: {
				progressive: true
			}
		})
	)
}

module.exports = {
	mode: process.env.NODE_ENV,
	context: path.join(__dirname, './src'),
	resolve: { alias: { '@src': path.join(__dirname, './src') } },
	entry: {
		main: '/js/pages/main'
	},
	output: {
		filename: 'js/' + filename('js'),
		path: path.join(__dirname, './dist'),
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
							publicPath: '/src/fonts/'
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
							publicPath: '/dist/css/',
						},
					},
					'css-loader?url=false',
					'sass-loader',
				],
			},
		]
	}
}
