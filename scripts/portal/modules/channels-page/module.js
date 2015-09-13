import BaseModule from 'base-module';
import Logic      from 'channels-page-logic';
let log           = require('bows')('Channels Page Module');

export default class ChannelsPageModule extends BaseModule {
  constructor(options) {
      if(!options){
        options = {name: 'Channels Page Module', version: '0.0.1', logic: Logic};
      }
      super(options);
      this.options = options;
      this.instance = new this.logic();
  }
  init(config) {
      this.instance.init(config);
  }
}