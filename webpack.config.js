const path = require('path');

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        publicPath: '/dist/',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {}
            }, {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                    babelrc: false,
                    presets: [
                        'es2015',
                        'stage-0'
                    ],
                    plugins: [
                        'transform-regenerator'
                    ]
                }
            }, {
                test: /\.(scss|css)$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src')
        }
    },
    devtool: 'inline-source-map'
    //resolve: {
    //    alias: {
    //        msSpeech: "microsoft-speech-browser-sdk/distrib/speech.browser.sdk"
    //    }
    //}
    //,
    //externals: [
    //    {
    //        "msSpeech": {
    //            root: "Speech.Browser.Sdk",
    //            commonjs2: "./Speech.Browser.Sdk",
    //            commonjs: ["./Speech.Browser.Sdk", "subtract"],
    //            amd: "Speech.Browser.Sdk"
    //        }
    //    }
    //]
};