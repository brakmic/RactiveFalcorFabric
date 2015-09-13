import Router    from 'falcor-router';
import Promise   from 'promise';
import jsonGraph from 'falcor-json-graph';
let $ref         = jsonGraph.ref;
let $error       = jsonGraph.error;
import MovieService from '../services/movie-service.js';

let MovieRouterBase = Router.createClass([
{
    route: 'movies',
    get: function(pathSet){
        return _service.getAllMovies().
                then(function(movieList){
                    return { path: ["movies"], value: movieList };
                });
    }
}
]);


let MovieRouter = function(userId) {
    MovieRouterBase.call(this);
    this._service = new MovieService({});
    this.userId = userId;
};
MovieRouter.prototype = Object.create(MovieRouterBase.prototype);

module.exports = function(userId) {
    return new MovieRouter(userId);
};
