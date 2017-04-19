/**
 * Created by fijapijpelink on 12/10/16.
 */

var movieController = function (Movie) {

    var post = function (req, res) {
        var movie = new Movie(req.body);
        if (!req.body.title || !req.body.actors || !req.body.genre) {
            res.status(400);
            res.send('This is required');
        }
        else {
            movie.save();
            res.status(201);
            res.send(movie);
        }
    };

    var get = function (req, res) {
        if (!req.accepts('application/json')) {
            res.status(400).send('Not accepted format');
        }

        else {
            var collection = {};
            var query = {};

            if (req.query.genre) {
                query.genre = req.query.genre;
            }

            // pagination waardes opvragen
            // req.body.start
            let start = 1;

            if(req.query.start) {
                start = parseInt(req.query.start);
            }

            // req.body.limit
            let limit = 1000000;
            if(req.query.limit) {
                limit = parseInt(req.query.limit);
            }

            Movie.find(query, function (err, movies) {
                if (err)
                    res.status(500).send(err);
                else {

                    collection.items = [];
                    var collectionLink = 'http://' + req.headers.host + '/api/movies';

                    let counter = 0;

                    movies.forEach(function (element, index, array) {

                        counter++;
                        var newMovie = element.toJSON();
                        newMovie._links = {};
                        newMovie._links.self = {};
                        newMovie._links.self.href = 'http://' + req.headers.host + '/api/movies/' + newMovie._id;
                        newMovie._links.collection = {};
                        newMovie._links.collection.href = collectionLink;

                        if ((counter >= start) && (collection.items.length < limit)) {
                            collection.items.push(newMovie);
                        }

                    });

                    collection._links = {};
                    collection._links.self = {};
                    collection._links.self.href = collectionLink;

                    collection.pagination = {};
                    collection.pagination.currentItems = collection.items.length;
                    collection.pagination.currentPage = Math.ceil(start / limit);
                    collection.pagination.totalItems = movies.length;
                    collection.pagination.totalPages = Math.ceil(movies.length / limit);

                    collection.pagination._links = {};
                    collection.pagination._links.first = {};

                    collection.pagination._links.first.page = 1;
                    collection.pagination._links.first.href = 'http://' + req.headers.host + '/api/movies?limit=' + limit;

                    collection.pagination._links.last = {};
                    collection.pagination._links.last.page = collection.pagination.totalPages;
                    collection.pagination._links.last.href = 'http://' + req.headers.host + '/api/movies?start=' + (movies.length - limit + 1) + '&limit=' + limit;

                    collection.pagination._links.previous = {};
                    if (collection.pagination.currentPage > 1) {
                        collection.pagination._links.previous.page = collection.pagination.currentPage - 1;
                        collection.pagination._links.previous.href = 'http://' + req.headers.host + '/api/movies?start=' + (start - limit) + '&limit=' + limit;
                    } else {
                        collection.pagination._links.previous.page = 1;
                        collection.pagination._links.previous.href = 'http://' + req.headers.host + '/api/movies?limit=' + limit;
                    }

                    collection.pagination._links.next = {};
                    if (collection.pagination.currentPage < collection.pagination.totalPages) {
                        collection.pagination._links.next.page = collection.pagination.currentPage + 1;
                        collection.pagination._links.next.href = 'http://' + req.headers.host + '/api/movies?start=' + (start + limit) + '&limit=' + limit;
                    } else {
                        collection.pagination._links.next.page = collection.pagination.totalPages;
                        collection.pagination._links.next.href = 'http://' + req.headers.host + '/api/movies?start=' + (movies.length - limit + 1) + '&limit=' + limit;
                    }

                    res.json(collection);

                }
            });
        }
    };

    return {
        post: post,
        get: get
    }

};

module.exports = movieController;