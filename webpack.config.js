const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorPlugin = require('friendly-errors-webpack-plugin');
module.exports = {
    entry: {
        app: ['./dev-client', path.resolve(__dirname, 'build/main.js')]
    },
    output: {
        path: path.resolve(__dirname, 'server/static/'),
        filename: 'js/[name].bundle.js',
        publicPath: '/',
        chunkFilename: 'js/[name].bundle.js'
    },
    devtool: '#cheap-module-eval-source-map',
    module: {
        rules: [
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                include: [path.join(__dirname, 'build')],
                enforce: 'pre',
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: ExtractTextPlugin.extract({
                            use: 'css-loader',
                            fallback: 'vue-style-loader'
                        }),
                        stylus: ExtractTextPlugin.extract({
                            use: 'css-loader!stylus-loader',
                            fallback: 'vue-style-loader'
                        })
                    },
                }

            },
            {
                test: /\.(js)$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'file-loader',
                query: {
                    name: 'img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'file-loader',
                query: {
                    name: 'font/[name].[hash:7].[ext]'
                }
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue': 'vue/dist/vue.js'
        }
    },
    plugins: [
        new ExtractTextPlugin('css/appstyle.css'),
        new webpack.HotModuleReplacementPlugin(),
        new FriendlyErrorPlugin(),
        new htmlWebpackPlugin({
            titile: 'hotreloaddemo',
            filename: 'index.html',
            template: 'index.html',
            inject: true
        })
    ]
};