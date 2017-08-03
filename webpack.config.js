const webpack = require('webpack');
const merge = require('webpack-merge');
const parts = require('./webpack.parts');

const commonConfig = merge([
    parts.commonConfig(),
    parts.lintStyles(),
    parts.loadJavaScript({ exclude: [/node_modules/] })
]);

const developmentConfig = merge([
    parts.developmentConfig(),
    parts.extractStyles()
]);

const productionConfig = merge([
    parts.productionConfig(),
    parts.extractStyles()
]);

module.exports = merge( commonConfig, process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig );
