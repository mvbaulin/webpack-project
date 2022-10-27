const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const path = require('path');

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;

let htmlPageNames = [
    'index',
    '404'
];

let multipleHtmlPlugins = htmlPageNames.map(pageName => {
    return new HtmlWebpackPlugin({
        template: `./src/${pageName}.html`,
        filename: `${pageName}.html`,
        scriptLoading: 'blocking | defer',
        inject: 'body'
    })
});

module.exports = {
    mode,
    target,
    devtool,
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    devServer: {
        port: 3000,
        open: true
    },
    entry: ['@babel/polyfill', path.resolve(__dirname, 'src', 'main.js')],
    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        filename: 'bundle.[contenthash].js',
        assetModuleFilename: 'assets/[hash][ext][query]',
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'bundle.[contenthash].css'
        })
    ].concat(multipleHtmlPlugins),
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
                options: {
                    minimize: false
                }
            },
            {
                test: /\.(c|sa|sc|le)ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [require('postcss-preset-env')]
                            }
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.woff2?/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            },
            {
                test: /\.(jpe?g|png|webp|gif|svg)$/i,
                type: 'asset/resource',
                use: [
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true
                            },
                            optipng: {
                                enabled: true
                            },
                            pngquant: {
                                quality: [0.65, 0.90],
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false
                            },
                            webp: {
                                quality: 75
                            }
                        }
                    }
                ]
            },
            {
                test: /\.m?js$/i,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}