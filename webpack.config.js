'use strict';
var webpack           = require('webpack');
var AsyncUglifyJs     = require("async-uglify-js-webpack-plugin");
var path              = require('path');
var CompressionPlugin = require('compression-webpack-plugin');
var root              = __dirname + '/';
var npmRoot           = root + 'node_modules/';
var stylesRoot        = root + 'styles/';
var nodeScripts       = root + 'node_modules/';
var scripts           = root + 'scripts/';
var buildScripts      = root + 'build/';
var releaseScripts    = root + 'release/';
var vendorScripts     = buildScripts + 'vendor/';
var dxScriptsJS       = vendorScripts + 'dx/';
var dxStyles          = stylesRoot + 'dx/';
var portalScripts     = buildScripts + 'portal/';

var config = {
  cache: false,
  entry: {
    'portal': path.resolve(__dirname, 'build/portal/app/main.js')
  },
  output: {
    path: path.resolve(__dirname, 'release'),
    filename: '[name].min.js',
    sourceMapFilename: '[name].min.js.map',
  },

  module: {
    preLoaders: [],
    loaders: [
            {
                include: /\.json$/,
                loaders: ["json-loader"]
            },
            {
                test: /raphael\.js$/,
                loader:"imports?module=>undefined&define=>undefined"
            },
            {
                test: /reconnecting-websocket\.js$/,
                loader:"imports?module=>undefined&define=>undefined"
            },
            {
                test: /\.ract$/,
                loader: 'ractive-component'
            },
            {
                test : /\.ts$/, exclude: [/node_modules/, /vendor/],
                loader: 'typescript-loader?typescriptCompiler=typescript'
            },
            {
                test : /\.(es6|js)$/,
                exclude: [/node_modules/, /vendor/],
                loader: 'babel-loader?optional=runtime&sourceMaps=both&nonStandard&compact=auto'
            },
            {
                test : /\.html$/, loader: 'html'
            },
            {
                test : /\.less$/, loader: 'style-loader!css-loader!less-loader'
            },
            {
                test : /\.css$/, loader: 'style-loader!css-loader'
            },
            {
                test : /\.(png|jpe?g|eot|ttf|svg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loaders: [
                    'url-loader?limit=8192&hash=sha512&digest=hex&name=[hash].[ext]',
                    'image?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?mimetype=application/font-woff'
            },
            {   test: /\.jpg$/,
                loader: "file-loader?name=[path][name].[ext]"
            },
    ]
  },
   resolve: {
      extensions: ['', '.js', '.es6', '.es6.js', '.jsx', '.json', '.ts', '.css', '.html', '.ract'],
      moduleDirectories: ['node_modules', 'bower_components'],
      alias: {
          //Styles
          'fabric.min.css'                 : stylesRoot + 'fabric/fabric.min.css',
          'fabric.css'                     : stylesRoot + 'fabric/fabric.css',
          'fabric.components.min.css'      : stylesRoot + 'fabric/fabric.components.min.css',
          'fabric.components.css'          : stylesRoot + 'fabric/fabric.components.css',
          'VideoPortal.css'                : stylesRoot + 'portal/VideoPortal.css',
          'app.css'                        : stylesRoot + 'portal/app.css',
          'bootstrap.min.css'              : stylesRoot + 'bootstrap/css/bootstrap.min.css',
          'bootstrap.theme.min.css'        : stylesRoot + 'bootstrap/css/bootstrap-theme.min.css',
          'metisMenu.min.css'              : stylesRoot + 'metis/metisMenu.min.css',
          'font-awesome.min.css'           : stylesRoot + 'fontawesome/css/font-awesome.min.css',
          'bootstrap'                      : stylesRoot + 'bootstrap/js/bootstrap.js',
          'bootstrap.min'                  : stylesRoot + 'bootstrap/js/bootstrap.min.js',
          'raphael'                        : __dirname + '/scripts/vendor/raphael/raphael-min.js',
          'morris'                         : __dirname + '/node_modules/morris.js/morris.min.js',
          //Vendor Scripts
          'reconnecting-websocket'         : vendorScripts + 'reconnecting-websocket/reconnecting-websocket.min.js',
          'jquery.fabric.min'              : vendorScripts + 'fabric/jquery.fabric.min.js',
          'jquery.fabric'                  : vendorScripts + 'fabric/jquery.fabric.js',
          //Databases
          'movies-db'                      : portalScripts + 'db/movies.js',
          //Application
          'deps'                           : portalScripts + 'config/deps.js',
          'main'                           : portalScripts + 'app/main.js',
          'main.html'                      : portalScripts + 'app/main.html',
          //Components
          'portal-component'               : portalScripts + 'components/portal.ract',
          'navbar-component'               : portalScripts + 'components/navbar.ract',
          'channels-component'             : portalScripts + 'components/channels.ract',
          'spotlight-component'            : portalScripts + 'components/spotlight.ract',
          'home-component'                 : portalScripts + 'components/home.ract',
          'channel-list-component'         : portalScripts + 'components/channel-list.ract',
          'video-list-component'           : portalScripts + 'components/video-list.ract',
          'player-component'               : portalScripts + 'components/player.ract',
          //Modules
          'base-module'                    : portalScripts + 'modules/base/module.js',
          'home-page-module'               : portalScripts + 'modules/home-page/module.js',
          'channels-page-module'           : portalScripts + 'modules/channels-page/module.js',
          'player-page-module'             : portalScripts + 'modules/player-page/module.js',
          //Logics
          'base-logic'                     : portalScripts + 'logics/base/logic.js',
          'base-logic.html'                : portalScripts + 'logics/base/logic.html',
          'home-page-logic'                : portalScripts + 'logics/home-page/logic.js',
          'home-page-logic.html'           : portalScripts + 'logics/home-page/logic.html',
          'channels-page-logic'            : portalScripts + 'logics/channels-page/logic.js',
          'channels-page-logic.html'       : portalScripts + 'logics/channels-page/logic.html',
          'player-page-logic'              : portalScripts + 'logics/player-page/logic.js',
          'player-page-logic.html'         : portalScripts + 'logics/player-page/logic.html',
          //Routing
          'app-router'                     : portalScripts + 'routing/app-router.js',
          'movie-router'                   : portalScripts + 'routing/movie-router.js',
          //Pages
          'base-page'                      : portalScripts + 'ui/pages/base/page.js',
          'base-page.html'                 : portalScripts + 'ui/pages/base/page.html',
          'wrapper-page'                   : portalScripts + 'ui/pages/wrapper/page.js',
          'wrapper-page.html'              : portalScripts + 'ui/pages/wrapper/page.html',
          'home-page'                      : portalScripts + 'ui/pages/home/page.js',
          'home-page.html'                 : portalScripts + 'ui/pages/home/page.html',
          'channels-page'                  : portalScripts + 'ui/pages/channels/page.js',
          'channels-page.html'             : portalScripts + 'ui/pages/channels/page.html',
          'player-page'                    : portalScripts + 'ui/pages/player/page.js',
          'player-page.html'               : portalScripts + 'ui/pages/player/page.html',
          //Views
          'main-view'                      : portalScripts + 'ui/views/main/view.js',
          'main-view.html'                 : portalScripts + 'ui/views/main/view.html',
          //Models
          'navbar-model'                   : portalScripts + 'models/navbar.js',
          'navbar-item-model'              : portalScripts + 'models/navbar-item.js',
          'spotlight-item-model'           : portalScripts + 'models/spotlight-item.js',
          'video-item-model'               : portalScripts + 'models/video-item.js',
          'channel-model'                  : portalScripts + 'models/channel.js',
          //Services
          'movie-service'                  : portalScripts + 'services/movie-service.js',
      }
  },
  plugins: [
        new CompressionPlugin({
            asset     : '{file}.gz',
            algorithm : 'gzip',
            regExp    : /\.js$|\.html$/,
            threshold : 10240,
            minRatio  : 0.8
        }),
        /*new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })*/
    ]
};
if (process.env.NODE_ENV === 'production') {
    config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }),
    /*new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        mangle: false
    }),*/
    new AsyncUglifyJs({
      delay: 5000,
      minifyOptions: {
        mangle: false,
        warnings: true,
        compress: {
          sequences     : true,  // join consecutive statemets with the “comma operator”
          properties    : true,  // optimize property access: a["foo"] → a.foo
          dead_code     : true,  // discard unreachable code
          drop_debugger : true,  // discard “debugger” statements
          unsafe        : false, // some unsafe optimizations (see below)
          conditionals  : true,  // optimize if-s and conditional expressions
          comparisons   : true,  // optimize comparisons
          evaluate      : true,  // evaluate constant expressions
          booleans      : true,  // optimize boolean expressions
          loops         : true,  // optimize loops
          unused        : true,  // drop unused variables/functions
          hoist_funs    : true,  // hoist function declarations
          hoist_vars    : false, // hoist variable declarations
          if_return     : true,  // optimize if-s followed by return/continue
          join_vars     : true,  // join var declarations
          cascade       : true,  // try to cascade `right` into `left` in sequences
          side_effects  : true,  // drop side-effect-free statements
          warnings      : true,  // warn about potentially dangerous optimizations/code
        }
      },
      logger: false,
      done: function(path, originalContents) { }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(true)
  ]);
} else {
    config.devtool = '#source-map';
    config.debug   = true;
}

config.useMemoryFs = true;
config.progress = true;

module.exports = config;
