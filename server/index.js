'use strict';
const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');

const app = express();
const compiler = webpack(webpackConfig);
//devmiddleware
const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath, 
    quiet: true
});
//hotmiddleware
const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => {}
});
//当html-webpack-plugin template改变的时候强制reload
compiler.plugin('compilation', (compilation) => {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({ action: 'reload' });
        cb();
    });
});

app.use(devMiddleware);
app.use(hotMiddleware);
//设置静态目录
app.use('./static', express.static(path.join(__dirname, '/static')));


app.listen('3000');



