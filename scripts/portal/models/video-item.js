import Collection  from 'ampersand-collection';
import lodashMixin from 'ampersand-collection-lodash-mixin';
import Model       from 'ampersand-model';

let VideoItemCollection = Collection.extend(lodashMixin, {
    model: VideoItemModel
});

let VideoItemModel = Model.extend({

    props: {
      id          : 'string',
      videoTitle  : 'string',
      videoLength : 'string',
      hrefUrl     : 'string',
      hrefTag     : 'string',
      imgUrl      : 'string',
      imgTitle    : 'string',
      imgAlt      : 'string',
      viewCount   : 'string'
    }

});

module.exports = {
    VideoItemCollection : VideoItemCollection,
    VideoItemModel      : VideoItemModel
};