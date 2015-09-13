let app              = require('ampersand-app');
let _                = require('underscore');
let template         = require('base-logic.html');
let log              = require('bows')('Base Logic');
let moment           = require('moment-timezone');

export default class BaseFunction {
  constructor(){
    this.currentClass = 'base-page';
    this.eventBus     = app.eventBus;
    this.cuid         = app.tools.cuid;
    this.moment       = moment;
    this.instance     = null;
    this.isPhone      = false;
    this.win          = window;
    this.Ractive      = window.Ractive;
    this.calculateWidth();
  }
  init(config){
    let self = this;
    self.instance = new config.ractive();
  }
  calculateWidth(){
    let width;
    if(this.win.innerWidth){
       width = this.win.innerWidth;
    } else {
        width = screen.width;
    }
    this.isPhone = width < this.tabletWidth;
  }
  teardown(){
    if(this.instance){
      this.instance.teardown();
    }
  }
}