const { resolve } = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = {
	mode: 'production',
	resolve: {
		extensions: ['.ts', '.js'],
	},
	context: resolve(__dirname, './src/background'),
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
		],
	},
	plugins: [new CheckerPlugin()],
	performance: {
		hints: false,
	},
	entry: './index.ts',
	output: {
		filename: 'bundle.js',
		path: resolve(__dirname, './build/background'),
		publicPath: '/',
	},
};
