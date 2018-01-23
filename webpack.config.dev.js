import webpack from 'webpack';
import path from 'path';

export default {
    devtool: 'inline-source-map',
    entry: [
        'babel-polyfill',
        'webpack-hot-middleware/client?reload=true',
        path.join(__dirname, 'src', 'app-client.js')
    ],
    target: 'web',
    output: {
        path: path.join(__dirname, 'src', 'static', 'js'),
        publicPath:"/js",
        filename: 'bundle.js'
    },
    watch: true,
    module: {
        loaders: [{
            test: path.join(__dirname, 'src'),
            exclude: [path.join(__dirname, 'src', 'server.js'), path.join(__dirname, 'src', 'server-test.js'), path.join(__dirname, 'src', 'startMessage.js')],
            loader: 'babel-loader',
            query: {
                cacheDirectory: 'babel_cache',
                presets: ["react-hmre"]
            }
        },
            { test: /\.css$/,loader: "style-loader!css-loader"},
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: 'file-loader'
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
            'process.env.NODE_ENV': JSON.stringify("dev")
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
};
