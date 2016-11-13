import '../imports/startup/server/main.js';
var Uber = require('node-uber');
var uber = new Uber({
  client_id: process.env.UBER_CLIENT_ID,
  client_secret: process.env.UBER_CLIENT_SECRET,
  server_token: process.env.UBER_SERVER_TOKEN,
  redirect_uri: 'http://localhost:3000/',
  name: "Jake's List",
  language: 'en_US', // optional, defaults to en_US
  sandbox: true // optional, defaults to false
});

if (Meteor.isServer) {
	// This code only runs on the server

	Meteor.startup(function () {
	    // code to run on server at startup
	});

	Meteor.publish('wait', function waitPublication() {
		return Wait.find();
	});
	Meteor.publish('price', function waitPublication() {
		return Price.find();
	});	
	Meteor.publish('venues', function waitPublication() {
		return Venues.find();
	});		

	var postRoutes = Picker.filter(function(req, res) {
	  // you can write any logic you want.
	  // but this callback does not run inside a fiber
	  // at the end, you must return either true or false
	  return req.method == "POST";
	});
	postRoutes.route('/qfs', function(params, req, res, next) {
		var venue = params.query.venue;
		var lat = params.query.lat;
		var lng = params.query.lng;
		var fsResponse = HTTP.call('GET',"https://api.foursquare.com/v2/venues/search?client_id="+process.env.FOURSQUARE_CLIENT_ID+"&client_secret="+process.env.FOURSQUARE_CLIENT_SECRET+"&v=20130815&ll="+lat+","+lng+"&query=" + venue);
		for (var ven in fsResponse.data.response.venues) {
			var nextMinutes = new Date();
			nextMinutes.setMinutes(nextMinutes.getMinutes() + 90);
			fsResponse.data.response.venues[ven].expireAt = nextMinutes;
			Venues.upsert({name:fsResponse.data.response.venues[ven].name}, fsResponse.data.response.venues[ven])
		}
		res.setHeader( 'Content-Type', 'application/json' );
		res.statusCode = 200;
		res.end( JSON.stringify(fsResponse) );
	});
	postRoutes.route('/wait', function(params, req, res, next) {
		var expiresAt = new Date();
		expiresAt.setMinutes(expiresAt.getMinutes() + 90);
		params.query.expiresAt = expiresAt;
		Wait.upsert({venue:params.query.venue, user: params.query.user},params.query);

		res.setHeader( 'Content-Type', 'application/json' );
		res.statusCode = 200;
		res.end( JSON.stringify(params) );
	});
	postRoutes.route('/price', function(params, req, res, next) {
		var expiresAt = new Date();
		expiresAt.setMinutes(expiresAt.getMinutes() + 90);
		params.query.expiresAt = expiresAt;
		Price.upsert({venue:params.query.venue, user: params.query.user},params.query);

		res.setHeader( 'Content-Type', 'application/json' );
		res.statusCode = 200;
		res.end( JSON.stringify(params) );
	});	

	postRoutes.route('/uber-estimate', function(params, req, res, next) {
		var currLat = params.query.lat;
		var currLng = params.query.lng;
		var venueLocationLat = params.query.venueLocationLat;
		var venueLocationLng = params.query.venueLocationLng;

		var uberResponse = HTTP.call('GET',"https://sandbox-api.uber.com/v1/estimates/price?start_latitude="+currLat+"&start_longitude="+currLng+"&end_latitude="+venueLocationLat+"&end_longitude="+venueLocationLng+"&server_token="+process.env.UBER_SERVER_TOKEN+"&seat_count=2");

		res.setHeader( 'Content-Type', 'application/json' );
		res.statusCode = 200;
		res.end( JSON.stringify(uberResponse) );
	});	

	var getRoutes = Picker.filter(function(req, res) {
	  return req.method == "GET";
	});		

	getRoutes.route('/api/login', function(params, req, res, next) {
	});
}

