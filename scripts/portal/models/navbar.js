import Collection  from 'ampersand-collection';
import lodashMixin from 'ampersand-collection-lodash-mixin';
import Model       from 'ampersand-model';

let NavBarCollection = Collection.extend(lodashMixin, {
    model: NavBarModel
});

let NavBarModel = Model.extend({

    props: {
      id    : 'string',
      title : 'string',
      items : 'array'
    }

});

module.exports = {
    NavBarCollection : NavBarCollection,
    NavBarModel      : NavBarModel
};