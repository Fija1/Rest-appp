/**
 * Created by fijapijpelink on 12/8/16.
 */

var express = require('express');

var routes = function(Movie){
    var movieRouter = express.Router();

    var movieController = require('../controllers/movieController')(Movie);
    movieRouter.route('/')
        .post(movieController.post)
        .get(movieController.get)
        .options(function(req, res) {
            res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

            res.status(200).send();
        });


    movieRouter.use('/:movieId', function (req,res,next){
        Movie.findById(req.params.movieId, function(err,movie){
            if(err)
                res.status(500).send(err);
            else if (movie){
                req.movie = movie;
                next();
            }
            else{
                res.status(404).send('No movie found');
            }
        });
    });

    movieRouter.route('/:movieId')
        .get(function(req,res){

            var returnMovie = req.movie.toJSON();
            returnMovie._links = {};
            returnMovie._links.self = {};
            returnMovie._links.self.href = 'http://' + req.headers.host + '/api/movies/' + returnMovie._id;
            returnMovie._links.collection = {};
            returnMovie._links.collection.href = 'http://' + req.headers.host + '/api/movies/';
            res.json(returnMovie);
        })

    .put(function(req,res){

            if(!req.body.title || !req.body.actors ||  !req.body.genre){
                res.status(400);
                res.send('This is required');
            }
            else{
                req.movie.title = req.body.title;
                req.movie.actors = req.body.actors;
                req.movie.genre = req.body.genre;

                req.movie.save(function (err) {
                    if (err)
                        res.status(500).send(err);
                    else {
                        res.json(req.movie);
                    }
                });
            }
        })

/*    .patch(function (req,res) {
        if(req.body._id)
            delete req.body._id;

       for(var p in req.body){
           req.movie[p] = req.body[p];
       }

       req.movie.save(function (err) {
           if(err)
               res.status(500).send(err);
           else{
               res.json(req.movie);
           }

       });
    })*/

    .delete(function (req,res) {
        req.movie.remove(function (err) {
            if(err)
                res.status(500).send(err);
            else{
                res.status(204).send('Movie removed');
            }
        });

    })

    .options(function(req, res) {

        res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
        res.status(200).send();
    });

    return movieRouter;
};

module.exports = routes;