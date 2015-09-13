//Mobile Main Page
let Ractive      = window.Ractive;
let win          = window;
let View         = require('ampersand-view');
let ViewSwitcher = require('ampersand-view-switcher');
let _            = require('underscore');
let domify       = require('domify');
let dom          = require('ampersand-dom');
let template     = require('main-view.html');
let setFavicon   = require('favicon-setter');
let app          = require('ampersand-app');
let log          = require('bows')('MainView');

module.exports = View.extend({
    template: template,
    initialize: function() {
        log('Initialized');
    },
    events: {
        'click a[href]': 'handleLinkClick'
    },
    render: function() {
        this.renderWithTemplate();
        this.pageContainer = this.queryByHook('view-switcher');
        this.pageSwitcher = new ViewSwitcher(this.pageContainer, {
            show: function(newView, oldView) {
                document.title = _.result(newView, 'pageTitle') || 'Ractive Falcor Fabric';
                document.scrollTop = 0;
                dom.addClass(newView.el, 'active-view');
                if(oldView){
                    oldView.trigger('remove');
                    dom.removeClass(oldView.el, 'active-view');
                }
                app.currentPage = newView;
            }
        });

        return this;
    },
    handleNewPage: function(view) {
        log(`SHOW | ${view.pageTitle}`);
        this.pageSwitcher.set(view);
    },
    handleLinkClick: function(e) {
        var aTag = e.target;
        var host = aTag.host;
        var pathname = aTag.pathname;
        var hash = aTag.hash;
        var nameProp = aTag.nameProp;
        if (host === '' &&
            !hash) {
            if(nameProp ||
                pathname){
                host = location.host;
            }
        }else{
            if(host === ''){
                host = 'no-switch';
            }else{
                host = location.host;
            }
        }
        var local = host === window.location.host;

        if (local && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            if(aTag.pathname){
                log(`Navigating to ${aTag.pathname}`);
                app.navigate(aTag.pathname);
            }
        }
    }
});
