/**
 * Created by fijapijpelink on 11/20/16.
 */


var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var movieModel = new Schema({
    title:{type: String},
    actors: {type: String},
    genre: {type: String},

});

module.exports= mongoose.model('Movie', movieModel);