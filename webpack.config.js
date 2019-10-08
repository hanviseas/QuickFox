module.exports = {

	entry: {
		'common': __dirname + '/static/v2/index.jsx'
	},

	output: {
		publicPath: 'http://localhost:8080/static/dist/',
		path: __dirname + '/static/dist/',
		filename: '[name].js'
	},

	module: {
		loaders: [{
			test: /\.(js|jsx)?$/,
			loaders: 'babel-loader',
			exclude: /node_modules/,
			query: {
				presets: ['react', 'es2015', 'stage-0'],
				plugins: ["transform-decorators-legacy"]
			}
		}, {
			test: /\.css$/,
			loaders: 'style-loader!css-loader?modules&localIdentName=[path][name]-[local]-[hash:base64:5]'
		}]
	},

	resolve: {
		alias: {

		}
	}
}