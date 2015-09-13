import PouchDB  from 'pouchdb';
import moviesdb from '../db/movies.js';

let log = require('bows')('MovieDB');

export default class MovieService {
  constructor(config){
    if(!config)throw Error('No config!');
    this._db = {};
    this.init();
  }
  init(config){
    let self = this;
    let data = moviesdb.get();
    self._db = new PouchDB('movies');
    var ddoc = {
                _id: '_design/movies',
                views: {
                  movies: {
                    map: function mapFun(doc) {
                      if (doc.videoTitle) {
                        emit(doc.videoTitle);
                      }
                    }.toString()
                  }
                }
              };
    self._db.put(ddoc).catch(function(err){
      if(err.status !== 409){
        throw err;
      }else{
        log(`Design doc already exists`);
      }
    });
    self._db.info().then(function(result){
      if(result.doc_count < 10){
        self.initDb(data);
      }else{
        log(`MoviesDb already contains ${result.doc_count} entries. Will not update!`);
      }
    }).catch(function(err){
      log(`ERROR: ${err}`);
    });
  }
  initDb(data){
    this._db.bulkDocs(data).then(function(){
      self._db.allDocs({include_docs: true})
      .then(function(result){
        self.printResult(result['rows']);
      });
    });
  }
  getMovie(key){
    return this._db.query('movies',{
      key: key,
      include_docs: true
    });
  }
  getAllMovies(){
    return this._db.allDocs({
      include_docs: true
    });
  }
  printResult(data){
    if(!data)throw Error('No data available!');
    let len = data.length;
    for (let i = 0; i < len; i++) {
      let doc = data[i]['doc'];
      log(`${data[i].key} - ${data[i].id}`);
    };
  }
}