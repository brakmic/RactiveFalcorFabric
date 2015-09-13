import BaseModule from 'base-module';
import Logic      from 'home-page-logic';
let log           = require('bows')('Home Page Module');

export default class HomePageModule extends BaseModule {
  constructor(options) {
      if(!options){
        options = {name: 'Home Page Module', version: '0.0.1', logic: Logic};
      }
      super(options);
      this.options = options;
      this.instance = new this.logic();
  }
  init(config) {
      this.instance.init(config);
  }
}