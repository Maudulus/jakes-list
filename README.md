UBER ESTIMATES
https://sandbox-api.uber.com/v1/estimates/price?start_latitude=42.363271&start_longitude=-71.050084&end_latitude=42.379521&end_longitude=-71.103980&server_token=AZZ_BGU7B0aZQle-VEc-VQ8FvYYLZnLJ2AiwZ6ki&seat_count=2

UBER REQUESTS
https://sandbox-api.uber.com/v1/estimates/price?start_latitude=42.363271&start_longitude=-71.050084&end_latitude=42.379521&end_longitude=-71.103980&server_token=AZZ_BGU7B0aZQle-VEc-VQ8FvYYLZnLJ2AiwZ6ki

UBER response: 
https://login.uber.com/oauth/v2/authorize?client_id=zJ3GkufM0yruqffPR_B9rWiO0n7evyGM&response_type=code

sets no specific time; need to set "expireAt" field in the actual document.
db.venues.createIndex({"expireAt":1},{expireAfterSeconds:0})
https://docs.mongodb.com/v3.0/tutorial/expire-data/

Query Mongo for recently created stuff: 
var lastHour = new Date();
lastHour.setHours(lastHour.getHours()-1);

var lastDay = new Date();
lastDay.setDate(lastDay.getDate() - 1);

db.users.aggregate(
	{$match:{ "createdAt":{$gt: lastDay}, }}
)  

Can search for venues on foursquare: 
https://api.foursquare.com/v2/venues/search?client_id=XTGLW12TM1TLLELLTFEAQPESJURGCJSKN0KMPYASIKTNNX3C&client_secret=FB4KZQ5W5NNZRICPUFCX4OFN1EXYUMEIZRZV5LYASEVDSUQJ&v=20130815&ll=40.7,-74&query=sushi

# meteor-react-boilerplate
A starter project for React &amp; Meteor

This repo aims to get you up and running with with React with little effort. It has sane defaults that 
most apps will use (router, accounts, browserify).

Most of the content is in the 'both' folder so that we can so serverside rendering more easily. Here's the 
rundown on what's included.

See [this guide](http://react-in-meteor.readthedocs.org/en/latest/client-npm/) to learn how to import NPM modules/components via browserify in Meteor.

For an in-depth example of how to use Meteor with React see 
[React-ive Meteor](https://github.com/AdamBrodzinski/react-ive-meteor). For flux support see the [Flux Leaderboard](https://github.com/AdamBrodzinski/meteor-flux-leaderboard) example app.

#### Packages

- React (MDG preview)
- Flow Router
- React Layout
- Accounts Password
- Accounts UI (with React wrapper)
- meteorhacks:npm
- cosmos:browserify
- Removes insecure
- Removes autopublish

#### Components

- Header
- LoginButtons
- [Classnames](https://github.com/JedWatson/classnames) (NPM Component)

####Models
- User
- (See a more [complex example](https://github.com/AdamBrodzinski/react-ive-meteor/blob/master/both/models/post.js))

####Pages/Routes

- Home, About
- Not Found
- Main Layout
