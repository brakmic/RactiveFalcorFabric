import app      from 'ampersand-app';
import View     from 'ampersand-view';
import template from 'base-page.html';
let log         = require('bows')('BasePage');

module.exports = View.extend({
    pageTitle: 'Base Page',
    template: template,
    initialize: function(options) {
        this.logger   = require('bows')(`${this.pageTitle}`);
        this.module   = null;
        this.config   = options ? options.config : {};
        this.eventBus = app.eventBus;
        if (options &&
            options.module) {
            this.module = new options.module();
            app.env.modules[this.module.name] = this.module;
        }
        this.once('remove',this.cleanup, this);
        this.logger(`INIT | ${this.pageTitle}`);
    },
    render: function() {
        this.renderWithTemplate();
        return this;
    },
    init: function() {
        if (this.module &&
            this.module.init) {
            this.module.init(this.config);
        }
    },
    cleanup: function(){
        log(`CLOSE | ${this.pageTitle}`);
        //this.eventBus.trigger('destroy-page');
        if(this.module){
            if(this.module.teardown){
                this.module.teardown();
            }else{
                log(`WARNING: ${this.module.name} has no TEARDOWN-Function!`);
            }
        }
    }
});
