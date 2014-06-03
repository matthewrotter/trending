var mongoose = require('mongoose'),
  _ = require('underscore'),
  config = require('../config'),
  conn;

var asc = 1,
  desc = -1;


/*
 * Trend stuff
 */
var TrendSchema = new mongoose.Schema({
  user: {
    email: String,
    display: String,
    password: String
  },
  title: String,
  description: String,
  category: String,
  createdDate: Date,
  city: String,
  country: String,
  trend: {}
});

// each trend property, named by date, looks like below
// not sure how to model that in mongoose
/* 
  {
    up: Number, // total for aggregate
    down: Number // total for aggregate
  }
*/

// mongoose.Schema.Types.ObjectId,
// indexes for listing jobs
// TrendSchema.index({
//   city: desc
// });

var Trend = mongoose.model('Trend', TrendSchema);



// exports
exports.Trend = Trend;



var uri = config.mongo;
if (!conn) {
  conn = mongoose.connect(uri);
}
console.log('connected to mongo');