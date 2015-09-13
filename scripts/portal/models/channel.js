import Collection  from 'ampersand-collection';
import lodashMixin from 'ampersand-collection-lodash-mixin';
import Model       from 'ampersand-model';

let ChannelCollection = Collection.extend(lodashMixin, {
    model: ChannelModel
});

let ChannelModel = Model.extend({

    props: {
      id      : 'string',
      name    : 'string',
      style   : 'string',
      hrefUrl : 'string',
      hrefTag : 'string'
    }

});

module.exports = {
    ChannelCollection : ChannelCollection,
    ChannelModel      : ChannelModel
};