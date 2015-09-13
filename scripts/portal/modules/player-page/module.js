import BaseModule from 'base-module';
import Logic      from 'player-page-logic';
let log           = require('bows')('Player Page Module');

export default class PlayerPageModule extends BaseModule {
  constructor(options) {
      if(!options){
        options = {name: 'Player Page Module', version: '0.0.1', logic: Logic};
      }
      super(options);
      this.options = options;
      this.instance = new this.logic();
  }
  init(config) {
      this.instance.init(config);
  }
}