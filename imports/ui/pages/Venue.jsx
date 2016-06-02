import React from 'react';
import classNames from 'classnames';
import '/imports/api/Price.js';
import '/imports/api/Wait.js';

Venue = React.createClass({
  render() {
    var self = this;
    // console.log(this.props.venueName);
    var venueName = this.props.venueName;
    // var venueName = this.props.params.venueName;
    return (
      <div className='venue'>
        <h1>This is ... </h1> // {venueName}

        <WaitTimeClass name={venueName}/>
        <PriceClass name={venueName}/>
        <div className='wait-time-chooser' >
          <div className="red" onClick={self.handleWaitTime.bind(this,venueName,0)}>RED</div>
          <div className="yellow" onClick={self.handleWaitTime.bind(this,venueName,1)}>YELLOW</div>
          <div className="green" onClick={self.handleWaitTime.bind(this,venueName,2)}>GREEN</div>
        </div>
        <div className='price-chooser'>
          <div className="low" onClick={self.handlePrice.bind(this,venueName,0)}>$</div>
          <div className="medium" onClick={self.handlePrice.bind(this,venueName,1)}>$$</div>
          <div className="high" onClick={self.handlePrice.bind(this,venueName,2)}>$$$</div>
        </div>
      </div>
    );
  },
  handleWaitTime(currentVenue,time) {
    sendWaitTime(currentVenue,time);
  },
  handlePrice(currentVenue,price){
    sendPrice(currentVenue,price);
  }, componentDidMount() {  
    requestUberEstimate();
  },
});
function sendWaitTime(venue,time) {
  var userId = Meteor.user()._id;
  $.ajax({
    type: "POST",
    url: "/wait?venue=" + venue + "&wait=" + time + "&user=" + userId,
    success: function(response){
      console.log(response);
    },
    error: function(response){
      console.log("Error:" + JSON.stringify(response));
    }
  });  
}
function sendPrice(venue,price) {
  var userId = Meteor.user()._id;
  $.ajax({
    type: "POST",
    url: "/price?venue=" + venue + "&price=" + price + "&user=" + userId,
    success: function(response){
      console.log(response);
    },
    error: function(response){
      console.log("Error:" + JSON.stringify(response));
    }
  });  
}
function requestUberEstimate(venue,price) {
  $.ajax({
    type: "POST",
    url: "/uber-estimate",
    success: function(response){
      console.log(response.data.prices);
    },
    error: function(response){
      console.log("Error:" + JSON.stringify(response));
    }
  });  
}

WaitTimeClass = React.createClass({
  mixins: [ReactMeteorData],
  render() {
    return (
      <div>
        <h3>WAIT TIME: {!$.isEmptyObject(this.data)? this.data.avg : <p>Loading...</p>}</h3>
      </div>
    );
  },  
  componentDidMount() {  
    // wait for task...
  },
  getMeteorData() {
    var currentProps = this.props;
    var data = {};
    var handle = Meteor.subscribe('wait');
    if(handle.ready()) {
      data.wait = Wait.find({venue: currentProps.name}).fetch();
      data.avg = calculateAverageTime(data.wait,"wait");  
    }
    return data;
  }  
});
PriceClass = React.createClass({
  mixins: [ReactMeteorData],
  render() {
    return (
      <div>
        <h3>Price: {!$.isEmptyObject(this.data)? this.data.avg : <p>Loading...</p>}</h3>
      </div>
    );
  },  
  componentDidMount() {  
    // wait for task...
  },
  getMeteorData() {
    var currentProps = this.props;
    var data = {};
    var handle = Meteor.subscribe('price');
    if(handle.ready()) {
      data.price = Price.find({venue: currentProps.name}).fetch();
      data.avg = calculateAverageTime(data.price,"price");  
    }
    return data;
  }  
});

function calculateAverageTime(allTimes,param) {
  var arr = [];
  var now = new Date();
  _.each(allTimes, function(num) {
    if (num.expiresAt >= now) {
      // selected date is in the past
      arr.push(Number(num[param]));
    }    
  });
  var average = _.reduce(arr, function(memo, num) {
    return memo + num;
  }, 0) / (arr.length === 0 ? 1 : arr.length);   
  return average;   
}

// function getMeteorData() {
//  var handle = Meteor.subscribe('wait');
//  // if(handle.ready()) {
//    var data = Wait.findOne({venue:"Ascend Nightclub"});
//     console.log(data);
//  // }
//  return data;
// }

export default Venue;