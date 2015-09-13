import Collection  from 'ampersand-collection';
import lodashMixin from 'ampersand-collection-lodash-mixin';
import Model       from 'ampersand-model';

let NavBarItemCollection = Collection.extend(lodashMixin, {
    model: NavBarItemModel
});

let NavBarItemModel = Model.extend({

    props: {
      id        : 'string',
      linkClass : 'string',
      hrefClass : 'string',
      hrefText  : 'string',
      hrefUrl   : 'string',
      hrefTag   : 'string'
    }

});

module.exports = {
    NavBarItemCollection : NavBarItemCollection,
    NavBarItemModel      : NavBarItemModel
};