//Office Fabric UI styles
require('fabric.min.css');
require('fabric.components.min.css');
//Boostrap styles
require('bootstrap.min.css');
require('bootstrap.theme.min.css');
//WebSocket support
require('reconnecting-websocket');
//Extra fonts
require('font-awesome.min.css');
//Portal styles
require('VideoPortal.css');
require('app.css');
//Global scripts
import Ractive from 'ractive';
window.Ractive = Ractive;
import jQuery  from 'jquery';
window.$       = window.jQuery = jQuery;
require('bootstrap.min');
require('imports?jQuery=>window.$!jquery.fabric.min');

import moment       from 'moment-timezone';
import domReady     from 'domready';
import app          from 'ampersand-app';
import _events      from 'ampersand-events';
import cuid         from 'cuid';
import AppRouter    from 'app-router';
import MovieService from 'movie-service';

let log  = require('bows')('Deps');
let hash = require('js-sha512').sha512;

//Extensions for JS
require('string.prototype.startswith');
//WebSocket support
import _ws from 'reconnecting-websocket';
window.ReconnectingWebSocket = _ws;
//RactiveJS adaptors
import RactiveAdaptorsAmpersand from 'ractive-adaptors-ampersand';
//DEBUG
let debug          = true;
let debugLogin     = false;
let debugMessaging = false;
let debugApi       = false;
let debugPromises  = false;

export default class Deps {
    constructor(config){
      this.moment = moment;
      this.VERSION = '0.0.1';
      if(!config)throw Error('No config!');
      this._init(config);
    }
    _init(config){
      app.extend({
        init: function(){
          log('init');
          Ractive.DEBUG = /unminified/.test(function() { /*unminified*/ });
          Ractive.DEBUG_PROMISES = debugPromises;
          localStorage.debug = debug;
          window.Ractive.adaptors.Ampersand = RactiveAdaptorsAmpersand;
          moment.locale('de-DE');
          this.eventBus = _events.createEmitter();
          this.tools = {
              cuid: cuid,
              hash: hash
          };
          this.services = {
            routing: {
              basePath: '/',
              instance: new AppRouter()
            },
            movies: {
              instance: new MovieService({})
            }
          }
          this.session = {
              instance: null
          };
          this.env = {
            routing: {
              initialized: false
            },
            instances: {
              app: null
            },
            modules: []
          };
          this.DEBUG           = debug;
          this.DEBUG_MESSAGING = debugMessaging;
          this.DEBUG_API       = debugApi;
          this.DEBUG_LOGIN     = debugLogin;
          this.timeStamp       = moment().format('dddd, Do MMMM YYYY, h:mm:ss a');
          this.version         = '',
          this.companyUrl      = '';
          this.companyName     = '';
        },
        registerEvents: function(){
          log('register events');
        },
        printAppInfo: function() {
          let self = this;
          $.getJSON('info.json').done(function(data) {
            log(`INFO | ${JSON.stringify(data)}`);
            self.version     = data.version;
            self.companyUrl  = data.companyUrl;
            self.companyName = data.companyName;
          });
        },
        _start: function(){
          this.init();
          this.registerEvents();
          this.printAppInfo();

          if (this.DEBUG) {
              log(`Running in DEBUG mode.`);
              window.app = this;
           }

        }
      });

     app._start.call(app);
    }
  }