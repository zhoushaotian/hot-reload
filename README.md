# cvms-with-vue
## 如何在cvms项目中结合webpack与vue开发  
- 在app目录下新建build文件夹，所有vue单文件模板都放在这个文件夹中，
build文件夹的结构与vuecli生成src目录结构一样。webpack打包生成的app.min.js放入public/static/js/中。
## webpack的配置  
除了一些loader的配置外，还要加上以下选项
```json
 resolve: {
        alias: {
            'vue': 'vue/dist/vue.js'
        }
   }
```  
### 提取vue单文件中的style到css文件  
```json
 {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
            loaders: {
                css: ExtractTextPlugin.extract({
                    use: 'css-loader',
                    fallback: 'vue-style-loader'
                    }),
                },
            }

}
plugins: [
    new ExtractTextPlugin('../css/appstyle.css')
]
```  
另外需要安装 vue-template-compiler 
### babel配置  
```json
{
    "presets": [
        "es2015",
        "stage-2"
    ]
}
```  
需要安装依赖  
```
    "babel-core": "^6.24.0",
    "babel-loader": "^6.4.0",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-stage-2": "^6.24.1",
```  
### 代码分离  
使用webpack的requrie.ensure。  
原理是当触发了某个异步加载的模块的时候，动态生成一个script标签来加载该模块依赖的js文件。webpack会自动把使用require.ensure加载
的模块从之前打包的单独js文件中分离出来。  
- 结合vue-router 异步加载组件  
```
//首先加载某个路由需要的组件
const demo = resolve => {
    require.ensure(['../components/demo'], () => {
        resolve(require('../components/demo'));
    });
};

//然后和使用普通组件一样
export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/client',
            name: 'main',
            component: main
        },
        {
            path: '/client/demo',
            name: 'demo',
            component: demo
        }
    ]
});
```  
### 使用hotmiddleware与devmiddleware热重载  
在路由器按过滤器加两个中间件：
```
    "webpack-dev-middleware": "^1.11.0",
    "webpack-hot-middleware": "^2.18.2"

    //中间件参数如下
    //devmiddleware
const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true //屏蔽打包输出信息
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
//设置静态目录 即服务器上所有静态文件的访问目录  
app.use('./static', express.static(path.join(__dirname, '/static')));

```  
之后要在webpack配置文件中加入以下配置：
```
 entry: {
        app: ['./dev-client', path.resolve(__dirname, 'build/main.js')]
    }
 //"./dev-client.js":
    /* eslint-disable */
    require('eventsource-polyfill')
    var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')

    hotClient.subscribe(function (event) {
    if (event.action === 'reload') {
        window.location.reload()
    }
    })
//这里写入了客户端的配置，当服务器端发送reload事件的时候，客户端响应这个事件，
//自动刷新浏览器

```  
* 注意：这里的webpack版本不能是3，并且extract-text-webpack-plugin也不能为最新。否则热更新的时候会报出错误无法找到hot.install


