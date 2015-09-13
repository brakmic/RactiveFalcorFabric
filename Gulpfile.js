/* jshint strict      : false */
//Plugins
var path              = require('path');
var gulp              = require('gulp');

var copy2             = require('gulp-copy2');
var shell             = require('gulp-shell');
var gutil             = require('gulp-util');
//var uglify            = require('gulp-uglifyjs');
var uglify            = require('gulp-uglify');
var buffer            = require('vinyl-buffer');
var sourcemaps        = require('gulp-sourcemaps');
var rename            = require('gulp-rename');
var del               = require('del');
var stripDebug        = require('gulp-strip-debug');
var cache             = require('gulp-cached');
var changed           = require('gulp-changed');
var plumber           = require('gulp-plumber');
var concat            = require('gulp-concat');
var webpack           = require('webpack');
var gWebpack          = require('webpack-stream');
var webpackBuild      = require('gulp-webpack-build');
var WebpackDevServer  = require('webpack-dev-server');
var ts                = require('gulp-typescript');
var merge             = require('merge2');
var msbuild           = require("gulp-msbuild");
var nodemon           = require('nodemon');
var webpackConfig     = require('./webpack.config');
var gulpIgnore        = require('gulp-ignore');
var livereload        = require('gulp-livereload');
var webpackInst       = webpack(webpackConfig);
//Paths
var solutionRoot       = '../';
var vsProjectRoot      = __dirname + '/';
var vsSolution         = solutionRoot + 'Advarics.Cloud.Cockpit.sln';
var scriptsRoot        = './scripts/';
var portalScriptsRoot  = scriptsRoot + 'portal/';
var tsRoot             = portalScriptsRoot;
var vendorScriptsRoot  = scriptsRoot + 'vendor/';
var templatesRoot      = portalScriptsRoot + 'templates/';
var stylesRoot         = vsProjectRoot + 'styles/';
var htmlRoot           = vsProjectRoot + '**/*.html';
var tsPattern          = tsRoot + '**/*.ts';
var jsPattern          = portalScriptsRoot + '**/*.js';
var cssPattern         = stylesRoot + '**/*.css';
var lessPattern        = stylesRoot + '**/*.less';
var sassPattern        = stylesRoot + '**/*.sass';
var htmlPattern        = scriptsRoot + '**/*.html';
var ractPattern        = scriptsRoot + '**/*.ract';
var templatesPattern   = templatesRoot + '**/*.html';
var releaseRoot        = './release/';
var buildRoot          = './build/';
var advarixBuildRoot   = buildRoot + 'advarix/';
var advarixReleaseRoot = releaseRoot + 'advarix/';
var webRoot            = 'C:/inetpub/wwwroot/';
var defsDest           = buildRoot + 'defs/';
var scriptsDest        = releaseRoot;
//Visual Studio MSBuild Options
var vsBuildTargets     = ['Clean','Build'];
var vsBuildConfig      = 'Debug';
var vsVersion          = 14.0;
var vsVerbosity        = 'quiet';
var vsErrorOnFail      = true;
var vsArch             = 'x64';
var vsProperties       = { WarningLevel: 1 };
var vsNoLogo           = false;
var vsStdOut           = true;
var vsPlatform         = process.platform;
//******************************
var watchPaths        = [
                          tsPattern,
                          jsPattern,
                          cssPattern,
                          lessPattern,
                          sassPattern,
                          htmlPattern,
                          ractPattern
                        ];
/* Deployment sources & destinations */
var deploySource      = vsProjectRoot;
var deployDest        = webRoot + 'cockpit';
var deployLogFile     = vsProjectRoot + 'deploy.log';

/* Webpack Build Settings */
var webpackDest       = path.resolve(vsProjectRoot);
var webpackOptions    = {
            debug: false,
            devtool: '#source-map',
            watchDelay: 200
        },
    webpackConfig = {
      useMemoryFs: true,
      progress: true
    };

var CONFIG_FILENAME = webpackBuild.config.CONFIG_FILENAME;

gulp.task('webpack', ['copyScripts'], function() {
    return gulp.src(path.join(vsProjectRoot, '**', CONFIG_FILENAME),
                          { base: path.resolve(vsProjectRoot) })
        .pipe(webpackBuild.init(webpackConfig))
        .pipe(webpackBuild.props(webpackOptions))
        .pipe(webpackBuild.run())
        .pipe(webpackBuild.format({
            version: false,
            timings: true
        }))
        .pipe(webpackBuild.failAfter({
            errors: true,
            warnings: true
        }))
        .pipe(gulp.dest(webpackDest));
});

gulp.task('webpack-dev-server', function(callback) {
  var server = new WebpackDevServer(webpack(webpackConfig), {
    hot: true,
    inline: true,
    noInfo: true,
    quiet: true,
    stats: { colors: true }
  });

  server.listen(8080, "localhost", function() {});

  gutil.log('[webpack-dev-server]',
    'http://localhost:8080/webpack-dev-server/build/index.html');

  callback();
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(watchPaths, ['copyScripts']).on('change', function(event) {
        if (event.type === 'changed') {
            gulp.src(event.path, { base: path.resolve(vsProjectRoot) })
                .pipe(webpackBuild.closest(CONFIG_FILENAME))
                .pipe(webpackBuild.init(webpackConfig))
                .pipe(webpackBuild.props(webpackOptions))
                .pipe(webpackBuild.watch(function(err, stats) {
                    gulp.src(this.path, { base: this.base })

                        .pipe(webpackBuild.proxy(err, stats))
                        .pipe(webpackBuild.format({
                            verbose: false,
                            version: false
                        }))
                        .pipe(gulp.dest(webpackDest))
                        .pipe(livereload());
                }));
        }
    });
});

gulp.task('clean', function (cb) {
    del([releaseRoot + '**/*'], function (err, deletedFiles) {
    if(err){
      console.log('Error during deletion: ' + err);
    }
  });
  cb();
});

gulp.task('copyScripts', function(){
  return gulp.src([portalScriptsRoot + '**/*.*',
                  vendorScriptsRoot + '**/*.*'],
                  {base: path.resolve(__dirname, 'scripts')})
          .pipe(changed(buildRoot))
          .pipe(gulp.dest(buildRoot));
});


var tsProject = ts.createProject({
    //typescript: require('typescript'),
    declarationFiles: true,
    noExternalResolve: true,
    noImplicitAny: false,
    sortOutput: true,
    module: 'commonjs',
    target: 'es5',
    removeComments: true,
});

gulp.task('advarix',['copyAdvarixScripts'], function() {
    var tsResult = gulp.src(advarixBuildRoot + '**/*.ts')
                    .pipe(sourcemaps.init())
                    .pipe(ts(tsProject));

    return merge([ // Merge the two output streams,
                    //so this task is finished when the IO of both operations are done.
        tsResult.dts.pipe(gulp.dest(advarixReleaseRoot + 'definitions')),
        tsResult.js
                  .pipe(concat('advarix.js'))
                  .pipe(sourcemaps.write())
                  .pipe(gulp.dest(advarixReleaseRoot + 'js'))
    ]);
});

gulp.task('msbuild', function() {
    return gulp.src(vsSolution)
        .pipe(plumber())
        .pipe(msbuild({
            stdout        : vsStdOut,
            targets       : vsBuildTargets,
            toolsVersion  : vsVersion,
            nologo        : vsNoLogo,
            configuration : vsBuildConfig,
            verbosity     : vsVerbosity,
            properties    : vsProperties,
            platform      : vsPlatform,
            architecutre  : vsArch,
            errorOnFail   : vsErrorOnFail
            })
        );
});

gulp.task('test-headless', function () {
    return gulp.src('spec/**/*Spec.js')
        .pipe(jasmine({
            reporter: new reporters.TerminalReporter({
                verbosity: 5,
                color: true,
                showStack: true
              })
        }));
});

gulp.task('test', ['jasmine-browser']);

gulp.task('jasmine-browser', function() {
  return gulp.src(['spec/**/*Spec.js'])
    .pipe(gWebpack({watch: true, output: {filename: 'spec.js'}}))
    //.pipe(gWebpack(require('./webpack.config.js')))
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server());
});

gulp.task('deployIIS', function(){
  console.log('vsRoot ' + vsProjectRoot);
  return robocopy({
        source: deploySource,
        destination: deployDest,
        files: ['*.config', '*.html', '*.htm', '*.js', '*.js.map', '*.dll', '*.pdb', '*.xap',
                '*.png', '*.jpg', '*.jpeg', '*.ttf', '*.svg', '*.eot', '*.gif', '*.css','Global.asax','Global.asax.cs'],
        copy: {
            mirror: true,
            multiThreaded: 10
        },
        file: {
            excludeFiles: ['packages.config','Gulpfile.js','README.*',
                           'tsconfig.json','Web.Debug.config','Web.Release.config',
                           'webpack.config.js'],
            excludeDirs: ['.idea','obj', 'Properties','App_Code','App_Data',
                          'App_Start','Controllers','Events','Helpers',
                          'Models','node_modules','Scripts/build','Service References']
        },
        logging: {
          verbose: false,
          hideProgress: false,
          showEta: true,
          output: {
            file: deployLogFile,
            overwrite: true,
            unicode: true
          },
          showAndLog: true,
          showUnicode: true,
        },
        retry: {
            count: 10,
            wait: 30
        }
    });

});

gulp.task('bump-mobile', function(){
  var options = {
    type: 'patch'
  };
  gulp.src('info.json')
  .pipe(bump(options))
  .pipe(gulp.dest('.'));
});

/*gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(watchPaths, ['copyScripts','webpack']);
});*/

gulp.task('run', ['watch'], function() {
  nodemon({
    execMap: {
      js: 'node --harmony'
    },
    script: 'index.js',
    ext: 'noop'
  }).on('restart', function() {
    console.log('restarted!');
  });
});

gulp.task('check-args', function(){
/* Copy user arguments if there are any*/
deploySource = args.srcdir ? args.srcdir.replace(/\\/g,"/") + '/' : deploySource;
deployDest   = args.dstdir ? args.dstdir.replace(/\\/g,"/") + '/' : deployDest;

  /* Check if asked for help */
if(args.usage){
    console.log(yargs.help());
    return gulp.src(vsProjectRoot).pipe(exit());
  }
});

gulp.task('uglifycockpit', function() {
  gulp.src('scripts/release/cockpit.min.js')
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify({
        mangle: {
          screw_ie8: true
        },
        compress: {
          sequences     : true,  // join consecutive statemets with the “comma operator”
          //properties    : true,  // optimize property access: a["foo"] → a.foo
          dead_code     : true,  // discard unreachable code
          //drop_debugger : true,  // discard “debugger” statements
          //unsafe        : false, // some unsafe optimizations (see below)
          //conditionals  : true,  // optimize if-s and conditional expressions
          //comparisons   : true,  // optimize comparisons
          //evaluate      : true,  // evaluate constant expressions
          //booleans      : true,  // optimize boolean expressions
          //loops         : true,  // optimize loops
          unused        : true,  // drop unused variables/functions
          //hoist_funs    : true,  // hoist function declarations
          //hoist_vars    : false, // hoist variable declarations
          //if_return     : true,  // optimize if-s followed by return/continue
          //join_vars     : true,  // join var declarations
          //cascade       : true,  // try to cascade `right` into `left` in sequences
          side_effects  : true,  // drop side-effect-free statements
          //warnings      : true,  // warn about potentially dangerous optimizations/code
        }
      }))
    .on('error', gutil.log)
    .pipe(sourcemaps.write())
    //.pipe(rename('cockpit.min.js'))
    .pipe(gulp.dest('Scripts/release'));
});

gulp.task('uglifymobile', function() {
  gulp.src('scripts/release/mobile.min.js')
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify({
        mangle: {
          screw_ie8: true
        },
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
      }))
    .on('error', gutil.log)
    .pipe(rename('mobile.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('Scripts/release'));
});

/*gulp.task('uglifymobile', function(){
  gulp.src('Scripts/release/mobile.min.js')
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(uglify())
  .on('error', gutil.log)
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('Scripts/release'));
});*/

gulp.task('dev', [
  'webpack-dev-server',
  'webpack'
]);

gulp.task('all', ['clean','msbuild','webpack']);
gulp.task('jsonly', ['webpack']);
gulp.task('webdeploy',['check-args','deployIIS']);
gulp.task('uglify', ['uglifycockpit','uglifymobile']);
gulp.task('default',['check-args','all']);