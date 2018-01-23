import webpack from 'webpack';
import path from 'path';

export default {
	devtool: 'source-map',
	entry: ['babel-polyfill',path.join(__dirname, 'src', 'app-client.js')],
	target: 'web',
    output: {
			path: path.join(__dirname, 'dist', 'js'),
			publicPath:"/js",
			filename: 'bundle.js'
    },
    watch: true,
    module: {
        loaders: [{
							test: path.join(__dirname, 'src'),
							exclude: [path.join(__dirname, 'src', 'server.js'), path.join(__dirname, 'src', 'server-test.js'),
								path.join(__dirname, 'src', 'startMessage.js'), path.join(__dirname, 'src', 'build.js'),
								path.join(__dirname, 'src', 'copyAssets.js')],
							loader: 'babel-loader',
							query: {
											cacheDirectory: 'babel_cache',
											presets: ['react','es2015', 'stage-0']
									}
							},
							{ test: /\.css$/,loader: "style-loader!css-loader" },
							//{ test: /\.css$/, loaders: ['style','css'] },
							{
								test: /\.jpe?g$|\.gif$|\.png$/,
								use: 'file-loader?name=[name].[ext]?[hash]'
							},
							{ test: /\.json$/, loader: "json-loader"},
							{test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader'},
							{test: /\.(woff|woff2)$/, loader: 'url-loader?prefix=font/&limit=5000'},
							{test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream'},
							{test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml'}
            ]
    },
    plugins: [
				new webpack.DefinePlugin({
					'process.env.NODE_ENV': JSON.stringify("production")
				}),
				new webpack.ProvidePlugin({
					$: "jquery",
					jQuery: "jquery"
				}),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ]
};
