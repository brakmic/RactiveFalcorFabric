// This file starts the server and exposes the Router at /model.json
/*var express = require('express');
var bodyParser = require('body-parser');
var falcor       = require('falcor');
var app = express();
var log = require('bows')('Express');
var Router = require('falcor-router');
var FalcorServer = require('falcor-express');
var MovieRouter  = require('./scripts/portal/routing/movie-router.js');

var model = new falcor.Model({
        cache: {
            todos: [
                { $type: "ref", value: ['todosById', 44] },
                { $type: "ref", value: ['todosById', 54] },
                { $type: "ref", value: ['todosById', 97] }
            ],
            todosById: {
                "44": {
                    name: 'get milk from corner store',
                    done: false,
                    prerequisites: [
                        { $type: "ref", value: ['todosById', 54] },
                        { $type: "ref", value: ['todosById', 97] }
                    ]
                },
                "54": { name: 'withdraw money from ATM', done: false },
                "97": { name: 'pick car up from shop', done: false }
            }
        }
    });
*/
//app.use(bodyParser.urlencoded({ extended: false }));



/*// Simple middleware to handle get/post
app.use('/model.json', FalcorServer.dataSourceRoute(function(req, res) {
    // Passing in the user ID, this should be retrieved via some auth system
    let date = new Date();
    log("ACCESS [" + date.toLocaleString() + "]");
    //return model.asDataSource();
    return MovieRouter("1");
}));

app.use(express.static('.'));

var server = app.listen(8080, function(err) {
    if (err) {
        console.error(err);
        return;
    }
    console.log("navigate to http://localhost:8080");
});*/

var hapi         = require('hapi');
var path         = require('path');
var falcorServer = require('falcor-hapi');
var falcor       = require('falcor');
var inert        = require('inert');
var MovieRouter  = require('./scripts/portal/routing/movie-router.js');

let log  = require('bows')('HapiServer');
let $ref = falcor.Model.ref;

var dataSource =
    new falcor.Model({
        cache: {
            todos: [
                { $type: "ref", value: ['todosById', 44] },
                { $type: "ref", value: ['todosById', 54] },
                { $type: "ref", value: ['todosById', 97] }
            ],
            todosById: {
                "44": {
                    name: 'get milk from corner store',
                    done: false,
                    prerequisites: [
                        { $type: "ref", value: ['todosById', 54] },
                        { $type: "ref", value: ['todosById', 97] }
                    ]
                },
                "54": { name: 'withdraw money from ATM', done: false },
                "97": { name: 'pick car up from shop', done: false }
            }
        }
    }).asDataSource();

var server = new hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: path.join(__dirname, '/')
            }
        }
    }
});
server.connection({ port: 8080 });

server.register(inert, function () {});

server.route({
    method: ['GET', 'POST'],
    path: '/model.json',
    handler: falcorServer.dataSourceRoute(function(req, res) {
        log("ACCESS [" + new Date().toLocaleString() + "]");
        return dataSource;
    })
});

server.route({
    method: 'GET',
    path: '/info.json',
    handler: function (request, reply) {
            reply.file('info.json');
        }
});

server.route({
    method: 'GET',
    path: '/home',
    handler: function (request, reply) {
            reply.file('index.html');
        }
});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true,
            index: true
        }
    }
});


server.start(function (err) {

    if (err) {
        throw err;
    }

    console.log('Server running at:', server.info.uri);
});

