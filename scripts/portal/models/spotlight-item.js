import Collection  from 'ampersand-collection';
import lodashMixin from 'ampersand-collection-lodash-mixin';
import Model       from 'ampersand-model';

let SpotlightItemCollection = Collection.extend(lodashMixin, {
    model: SpotlightItemModel
});

let SpotlightItemModel = Model.extend({

    props: {
      id          : 'string',
      videoTitle  : 'string',
      videoLength : 'string',
      hrefUrl     : 'string',
      hrefTag     : 'string',
      imgUrl      : 'string',
      imgTitle    : 'string',
      imgAlt      : 'string'
    }

});

module.exports = {
    SpotlightItemCollection : SpotlightItemCollection,
    SpotlightItemModel      : SpotlightItemModel
};