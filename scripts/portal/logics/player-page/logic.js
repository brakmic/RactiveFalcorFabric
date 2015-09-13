import template  from 'player-page-logic.html';
import BaseLogic from 'base-logic';
import videos    from 'video-list-component';
let log          = require('bows')('Home Page Logic');

export default class PlayerPageLogic extends BaseLogic {
  constructor(){
    super();
    this.currentClass = 'player-page';
  }
  init(config){
   this.instance = new this.Ractive({
      el: '.player-page-module',
      template: template,
      data: function(){
        return {
        }
      },
      components: {
        'video-list': videos
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