import app      from 'ampersand-app';
import BasePage from 'base-page';
import MainView from 'main-view';
import portal   from 'portal-component';
import template from 'wrapper-page.html';
import domReady from 'domready';

let rootEl      = '.main-view';
let log         = require('bows')('WrapperBasePage');

export default class WrapperPage {
  constructor(){
    //super();
    this.pageTitle = 'Main Wrapper Page';
    this.router    = app.services.routing.instance;
    this.basePath  = app.services.routing.basePath;
    this.eventBus  = app.eventBus;
    this.Ractive   = window.Ractive;
    this.init();
  }
  init(){
    let self = this;
    self.wrapper = new self.Ractive({
      el: '#app-root',
      template: template,
      data: function(){
        return {};
      },
      components: {
        'portal': portal
      },
      onrender: function(){
        log('rendered');
      },
      oncomplete: function() {
        domReady(() => {
          this.initMainView();
          if(!app.env.routing.initialized){
            this.prepareRouting();
            app.env.routing.initialized = true;
          }

          self.router.navigate('/home',{replace:false});
        });
      },
      onteardown: function(){
      },
      initMainView: function(){
        self.mainView = new MainView({
            el: document.querySelector(rootEl)
        });
        self.mainView.render();
      },
      prepareRouting: function(){
         // listen for new pages from the router
         self.router.on('page', self.mainView.handleNewPage, self.mainView);
          // we have what we need, we can now start our router and show the appropriate page
         self.router.history.start({pushState: true, root: self.basePath, silent: true});
         app.navigate = function(page) {
            if(page){
              let url = (page.charAt(0) === '/') ? page.slice(1) : page;
              if (url.indexOf('/') !== -1) {
                  url = url.match(/\/(.*?)$/)[1];
              }
              self.router.history.navigate(url, {trigger: true});
            }
          };
      },
    })
  }
};