var path = require('path');

module.exports = {
    // entry: './src/js/main.js',
    // output: {
    //     path: __dirname + '/dist',
    //     filename: 'bundle.js'
    // },
    // module: {
    //     rules: [
    //         {
    //             enforce: 'pre',
    //             test: /.js$/,
    //             exclude: /node_modules/,
    //             loader: 'eslint-loader'
    //         },
    //         {
    //             test: /\.m?js$/,
    //             exclude: /node_modules/,
    //             use: {
    //                 loader: 'babel-loader',
    //                 options: {
    //                     presets: ['@babel/preset-env']
    //                 }
    //             }
    //         }]
    // }
    entry: './src/ts/index',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [{
            // Include ts, tsx, js, and jsx files.
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }],
    }
}
