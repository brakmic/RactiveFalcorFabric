import Deps        from '../config/deps.js';
import _           from 'underscore';
import app         from 'ampersand-app';
import template    from 'main.html';
import WrapperPage from 'wrapper-page';
import Events      from 'ampersand-events';
import domReady    from 'domready';
import bows        from 'bows';


let log            = bows('Main');

export default new class App {
  constructor(){
    domReady(() => {
      this.deps  = new Deps({});
      this.Ractive = window.Ractive;
      this.pages = {};
      this.init();
    });
  }
  init(){
    let self = this;
    app.env.instances.mainApp = self;
    self.eventBus = app.eventBus;
    self.eventBus.on('load-page', self.onLoadPage.bind(self));
    self._main = new self.Ractive({
      el: '#app-root',
      template: template,
      data: function(){
        return {};
      },
      onrender: function(){
        log('App rendered');
      },
      oncomplete: function(){
        self.eventBus.trigger('load-page', { name: 'wrapper-page', data: {}});
      },
      onteardown: function(){
        log('App teared down');
      }
    });
  }
  onLoadPage(message){
    if(!message)return;
    let name = message.name;
    switch(name){
      case 'wrapper-page':{
        this.pages.wrapperPage = new WrapperPage();
      }
      break;
      default:{
        log(`Could not load page ${name}`)
      }
      break;
    }
  }
  teardown(){
    log('closing');
  }
}