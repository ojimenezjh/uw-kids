const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: {
            main: './src/index.js',
            setup: './src/setup.js',
        },
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist'),
            clean: true,
        },
        resolve: {
            fallback: {
                path: require.resolve("path-browserify"),
                fs: false,
                os: require.resolve("os-browserify/browser"),
                stream: require.resolve("stream-browserify"),
                "buffer": require.resolve("buffer/")
            }
        },
        devServer: {
            port: 8080,
            contentBase: path.join(__dirname, 'dist'),
            historyApiFallback: {
                rewrites: [
                    { from: /^\/setup.html/, to: '/setup.html' },
                    { from: /./, to: '/index.html' },
                ]
            },
        },
        plugins: [
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: './src/index.html',
                chunks: ['main'],
                title: "Webpack Test",
            }),
            new HtmlWebpackPlugin({
                filename: 'setup.html',
                template: './src/setup.html',
                chunks: ['setup'],
                title: "Game Setup",
            }),
            new Dotenv()
        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(md2|fbx|gltf|obj|glb)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /\.(png|jp(e*)g|svg|gif|webp)$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 8000,
                            name: 'images/[hash]-[name].[ext]'
                        }
                    }]
                },
                {
                    test: /\.(ttf|eot|woff|woff2)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: 'assets/fonts/'
                            }
                        }
                    ]
                },
                {
                    test: /\.(mp3|wav|ogg)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            outputPath: 'assets/audio/'
                        }
                    }]
                }
            ]
        },
        mode: isProduction ? 'production' : 'development',
        optimization: {
            minimize: isProduction,
            splitChunks: {
                chunks: 'all',
            },
        },
    };
};
