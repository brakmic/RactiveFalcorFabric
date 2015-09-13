import channels  from 'channels-component';
import template  from 'channels-page-logic.html';
import BaseLogic from 'base-logic';
let log       = require('bows')('Channel Page Logic');

export default class ChannelsPageLogic extends BaseLogic {
  constructor(){
    super();
    this.currentClass = 'channels-page';
  }
  init(config){
    this.instance = new this.Ractive({
      el: '.channels-page-module',
      template: template,
      data: function(){
        return {
          header: 'channels page',
          content: 'channels page',
          footer: 'channels page'
        }
      },
      components: {
        'channels': channels
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