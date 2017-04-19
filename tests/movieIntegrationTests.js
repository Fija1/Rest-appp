var should = require('should'),
    request = require('supertest'),
    app = require('../app.js'),
    mongoose = require('mongoose'),
    Movie = mongoose.model('Movie'),
    agent = request.agent(app);


describe('Movie Crud Test', function(){
    it('Should allow a Movie to be posted and return an _id', function(done){
        var moviePost = {title:'new Movie', actors:'Fija', genre:'Fiction'};

        agent.post('/api/movies')
            .send(moviePost)
            .expect(200)
            .end(function(err, results){

                results.body.should.have.property('_id');
                done()
            })
    });

    afterEach(function(done){
        Movie.remove().exec();
        done();
    })
});