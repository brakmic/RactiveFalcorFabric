import template  from 'home-page-logic.html';
import BaseLogic from 'base-logic';
import home      from 'home-component';
let log          = require('bows')('Home Page Logic');

export default class HomePageLogic extends BaseLogic {
  constructor(){
    super();
    this.currentClass = 'home-page';
  }
  init(config){
    this.instance = new this.Ractive({
      el: '.home-page-module',
      template: template,
      data: function(){
        return {
        }
      },
      components: {
        'home-page-content': home
      },
      onrender: function(){
        log('rendered');
      },
      onconfig: function(){
        log('config');
      },
      oncomplete: function(){
        log('complete');
      },
      onteardown: function(){
        log('teardown');
      }
    });
  }
}