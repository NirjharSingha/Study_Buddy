const path = require('path');

module.exports = {
    resolve: {
        modules: [
            path.resolve(__dirname, './lab/src/lab'),
            'node_modules'
        ],
        alias: {
            'lab': path.resolve(__dirname, './lab/src/lab')
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(glsl|tpl)$/,
                use: 'raw-loader'
            }
        ]
    }
}; 