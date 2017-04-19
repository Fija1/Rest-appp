/**
 * Created by fijapijpelink on 12/10/16.
 */
var should = require('should'),
    sinon =  require('sinon');

describe ('Movie Controller Tests:', function () {

    describe('Post', function () {
        it('should not allow an emoty title on post', function () {
            var Movie = function (movie) {
                this.save = function(){
                }
            };

            var req = {
                body: {
                    actors: 'Fija'
                }
            };

            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            };

            var movieController = require('../controllers/movieController')(Movie);

            movieController.post(req,res);

            res.status.calledWith(400).should.equal(true, 'Bad Status' + res.status.args[0][0]);
            res.send.calledWith('Title is required').should.equal(true);
        })
    })
});