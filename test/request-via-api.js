/*
	Meant to be called via shell for testing functional hitting actual endpoints
*/
var request = require('request'),
	_ = require('underscore'),
	assert = require('chai').assert,
	moment = require('moment'),
	colors = require('colors'),
	host = 'http://localhost:4001', // 'https://demo.transitsherpa.com'
	basePath = '/trending/v1';


describe('API functionality', function() {
	this.timeout(5000);

	// global to tests
	var id,
		trend = {
			user: {
				email: 'mrotter@globesherpa.com',
				display: 'Skip',
				password: '12345'
			},
			title: 'Italian-style unbuttoned top shirt button',
			description: 'You know!',
			category: 'fashion',
			// createdDate: Date.now(), // set internally?
			city: null,
			country: 'US',
			trend: {}
			// set with no trend to start
			// trend: [{
			// 	date: Date.now(),
			// 	up: 10,
			// 	down: 3
			// }]
		},
		otherTrend = _.clone(trend);

	// delete all
	it('can delete everthin', function(done) {
		runTest('/trend?force=true', 'DELETE', {
			"_all": true
		}, function(err, res, body) {
			assert(parseInt(body) >= 0);
			done();
		});
	});


	// create
	it('can create a trend', function(done) {
		runTest('/trend', 'POST', trend, function(err, res, body) {
			assert.isNotNull(body._id);
			id = body._id;
			done();
		});
	});

	// find the created one
	it('can find a trend by id', function(done) {
		runTest('/trend/' + id, 'GET', null, function(err, res, body) {
			// console.log(body);
			body = JSON.parse(body); // GETs don't auto-parse
			assert.isNull(err);
			assert.equal(trend.title, body.title);
			assert.equal(id, body._id);
			done();
		});
	});

	// vote
	it('can vote on a trend', function(done) {
		runTest('/trend/' + id + '?up=5&down=10', 'PATCH', trend, function(err, res, body) {
			assert.isNull(err);
			done();
		});
	});

	// vote again on same day
	it('can vote on a trend', function(done) {
		runTest('/trend/' + id + '?down=1', 'PATCH', trend, function(err, res, body) {
			assert.isNull(err);
			var today = moment().startOf('day').valueOf();
			assert.equal(body.trend[today].down, -11);
			done();
		});
	});

});



// update
// test $(curl --write-out %{http_code} --silent --output /dev/null -X PUT -H "Content-Type: application/json" -d '{"_all": true}' "$HOST$basePath/trend") 'update trend'

function runTest(path, method, obj, callback) {
	var url = host + basePath + path,
		options = {
			url: url,
			method: method
		};

	if (method.match(/get/i)) {
		options.qs = obj;
	} else {
		options.json = obj;
	}

	request(options, callback);
}