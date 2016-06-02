import '../imports/startup/server/main.js';

if (Meteor.isServer) {
	// This code only runs on the server

	Meteor.startup(function () {
	    // code to run on server at startup
	    process.env.MAIL_URL="smtp://mgreggortest:testtest1@smtp.gmail.com:587/";
	});

	Meteor.publish('wait', function waitPublication() {
		return Wait.find();
	});
	Meteor.publish('price', function waitPublication() {
		return Price.find();
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
		var fsResponse = HTTP.call('GET',"https://api.foursquare.com/v2/venues/search?client_id=XTGLW12TM1TLLELLTFEAQPESJURGCJSKN0KMPYASIKTNNX3C&client_secret=FB4KZQ5W5NNZRICPUFCX4OFN1EXYUMEIZRZV5LYASEVDSUQJ&v=20130815&ll="+lat+","+lng+"&query=" + venue);
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
		var uberResponse = HTTP.call('GET',"https://sandbox-api.uber.com/v1/estimates/price?start_latitude=42.363271&start_longitude=-71.050084&end_latitude=42.379521&end_longitude=-71.103980&server_token=AZZ_BGU7B0aZQle-VEc-VQ8FvYYLZnLJ2AiwZ6ki&seat_count=2");

		res.setHeader( 'Content-Type', 'application/json' );
		res.statusCode = 200;
		res.end( JSON.stringify(uberResponse) );
	});	

	var getRoutes = Picker.filter(function(req, res) {
	  return req.method == "GET";
	});		
}

