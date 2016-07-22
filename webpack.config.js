var webpack = require('webpack');
module.exports = {
    'stat': 'no-error',
    entry: [
      "./djangobucketlist/static/js/app.react.js"
    ],
    output: {
        path: __dirname + '/djangobucketlist/static/js/build/',
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.jsx?$/, loaders: ['babel-loader'], exclude: /node_modules/ }, // to transform JSX into JS
        ]
    },
  }
