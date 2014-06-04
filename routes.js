var _ = require('underscore'),
  moment = require('moment'),
  model = require('./lib/model'),
  Trend = model.Trend,
  routePrefix = '/trending/v1',
  config = require('./config');

// console.log('API', api);

module.exports = exports = function(app) {
  app.delete(routePrefix + '/trend/:id?', function(req, res, next) {
    if (!req.params.id && !req.query.force) {
      return res.send(401, 'must pass an id or force');
    }

    var filter = {};
    if (req.params.id) {
      filter._id = req.params.id;
    }

    if (req.query.force) {
      console.warn('deleting all tickets!');
      filter = {}; // remove all tickets!
    }

    Trend.remove(filter, function(err, result) {
      if (err) {
        return res.send(401, err);
      }
      res.json(result);
    });
  });

  app.post(routePrefix + '/trend', function(req, res, next) {
    var trend = new Trend(req.body);
    trend.trend = trend.trend || {} ;
    trend.createdDate = Date.now();
    trend.save(function(err, result) {
      if (err) {
        return res.send(401, err);
      }
      res.send(result);
    });
  });

  app.get(routePrefix + '/trend/:id?', function(req, res, next) {
    var filter = _.extend({}, req.body);

    if (req.params.id) {
      filter._id = req.params.id;
    }

    Trend.find(filter, function(err, result) {
      res.json(req.params.id ? result[0] : result);
    });
  });

  app.patch(routePrefix + '/trend/:id', function(req, res, next) {
    // get existing Trend
    Trend.findById(req.params.id, function(err, result) {
      if (err) {
        return res.send(401, 'Missing');
      }
      var today = moment().startOf('day').valueOf();

      result.trend = result.trend || {}; // make sure it exists
      var trend = result.trend[today];
      trend = trend || {
        up: 0,
        down: 0
      };
      trend.up += +req.query.up || 0;
      trend.down -= +req.query.down || 0;

      result.trend[today] = trend; // update trend
      result.markModified('trend');

      // console.log(result);

      result.save(function(err, result) {
        if (err) {
          return res.send(401, 'Missing');
        }
        res.json(result);
      });
    });
  });
};