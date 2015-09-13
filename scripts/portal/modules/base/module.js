let log = require('bows')('BaseModule');

export default class BaseModule {
  constructor(options) {
    if(options){
      this._name    = options.name;
      this._version = options.version;
      this._logic   = options.logic;
      this._config  = options.config;
    }
  }

  get name() {
      return this._name;
  }
  set name(value) {
      this._name = value;
  }
  get version() {
      return this._version;
  }
  set version(value) {
      this._version = value;
  }
  get logic() {
      return this._logic;
  }
  set logic(value) {
      this._logic = value;
  }
  get config() {
      return this._config;
  }
  set config(value) {
      this._config = value;
  }
  init(config) {
      log(`BaseModule.init() called with config: ${config}`);
  }
  teardown(){
    if(this.instance){
      if(this.instance.teardown){
        this.instance.teardown();
      }else{
        log(`WARNING: ${this._name} has no TEARDOWN-Function!`);
      }
    }
  }
}
