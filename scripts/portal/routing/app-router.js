import Router         from 'ampersand-router';
import BasePage       from 'base-page';
import HomePage       from 'home-page';
import HomeModule     from 'home-page-module';
import ChannelsPage   from 'channels-page';
import ChannelsModule from'channels-page-module';
import PlayerPage     from 'player-page';
import PlayerModule   from 'player-page-module';
import _              from 'underscore';
import app            from 'ampersand-app';
let log               = require('bows')('AppRouter');

let AppRouter = Router.extend({
    initialize: function() {
        log('initialized');
    },
    routes: {
        ''                    : 'home',
        'home'                : 'home',
        'channels'            : 'channels',
        'employee-interviews' : 'employee-interviews',
        'executive-briefings' : 'executive-briefings',
        'web-tech-talks'      : 'web-tech-talks',
        'player'              : 'player',
        '(*path)'             : 'home'
    },
    home: function(){
        let page = new HomePage({ module: HomeModule,
                                   config: {}
                                  });
        this.trigger('page', page);
        page.init();
    },
    channels: function(){
        let page = new ChannelsPage({ module: ChannelsModule,
                                   config: {}
                                  });
        this.trigger('page', page);
        page.init();
    },
    player: function(){
        let page = new PlayerPage({ module: PlayerModule,
                                   config: {}
                                  });
        this.trigger('page', page);
        page.init();
    }
});

module.exports = AppRouter;
