const { resolve } = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = {
	mode: 'development',
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
	},
	context: resolve(__dirname, './src/content_scripts'),
	module: {
		rules: [
			{
				test: /\.js$/,
				use: ['babel-loader', 'source-map-loader'],
				exclude: /node_modules/,
			},
			{
				test: /\.tsx?$/,
				use: ['babel-loader', 'awesome-typescript-loader'],
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: { importLoaders: 1, modules: true },
					},
				],
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				loaders: [
					'file-loader?hash=sha512&digest=hex&name=img/[hash].[ext]',
					'image-webpack-loader?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false',
				],
			},
			{
				test: /\.woff/,
				use: {
					loader: 'file-loader',
					options: {
						name: 'fonts/[name].[ext]',
					},
				},
			},
		],
	},
	plugins: [new CheckerPlugin()],
	performance: {
		hints: false,
	},
	entry: './index.tsx',
	output: {
		filename: 'bundle.js',
		path: resolve(__dirname, './build/content_scripts'),
		publicPath: '/',
	},
};
