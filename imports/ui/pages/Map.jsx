import React from 'react';
var ReactDOM = require('react-dom');
import classNames from 'classnames';
import './Venue.jsx';


Map = React.createClass({
  render() {
    var self = this;
    return (
      <div>
        <div className={classNames('flip-container')}>
          <div className={classNames('flipper')} ontouchstart="this.classList.toggle('hover');">
            <div className={classNames('front')}>
              <div id="map" className={classNames('map')}></div>
              <a className={classNames('button')} onClick={self.flipMapList}>List</a>
            </div>
            <div className={classNames('back')}>
              <h2>Lorem Ipsum</h2>
              <a className={classNames('button')} onClick={self.flipMapList}>Map</a>
              <div id="list-item" className={classNames('row list-item')}></div>
            </div>  
           </div>
         </div>
         <div id="venue-bind" className={classNames('hidden')}>
          
         </div>
       </div>
    );
  },
  flipMapList() {
    $('.flip-container').toggleClass('flip');
  },
  componentDidMount() { 
    var self=this;
    Mapbox.load(); 
    (function myLoop (i) {          
       setTimeout(function () {   
          if(geo) {
            if (Mapbox.loaded()) {
              L.mapbox.accessToken = 'pk.eyJ1IjoibWF1ZHVsdXMiLCJhIjoiY2lqbHkxODBxMDA4dHU0bTVwOThiNjBqbCJ9.ALkY_spgnw5ZqOWx4qECZA';
              map = L.mapbox.map('map', 'mapbox.streets').setView([geo.lat, geo.lng], 12);   
              self.queryFourSquare('nightclub',geo.lat,geo.lng);
            }
          }
          if (--i && geo == null) myLoop(i);      
       }, 1000)
    })(10);                        
  },
  queryFourSquare(query,latitude,longitude) {
    var self=this;
    $.ajax({
     type: "POST",
     url: "/qfs?venue=" + query + "&lat=" + latitude + "&lng=" + longitude,
     success: function(response){
       self.plotMapPoints(response.data.response.venues);
     },
     error: function(response){
       console.log("Error:" + JSON.stringify(response));
     }
   });  
  }, 
  plotMapPoints(arr) {
    var self = this;
    ReactDOM.render(<VenueItem allVenues={arr}/>,document.getElementById('list-item'));

    $.each(arr,function(index, thisVenue) {
      var marker = L.marker([thisVenue.location.lat, thisVenue.location.lng], {
            icon: L.mapbox.marker.icon({
              'marker-color': '#9c89cc'
            })
          })
          .bindPopup('<div class=\"marker-title\"><h2>'+thisVenue.name+'</h2></div><table> <tr> <th>Phone</th> <td>'+thisVenue.contact.formattedPhone+'</td> </tr> <tr> <th>Address</th> <td>'+thisVenue.location.formattedAddress[0]+thisVenue.location.formattedAddress[1]+'</td> </tr> </table>')
          .addTo(map);
    });
  },
  mountVenue() {
    console.log("mounting...");
  }
});

VenueItem = React.createClass({
  render() {
    var self = this;
    var allVenues = this.props.allVenues;
    return(
      <div>
        {allVenues.map(function(singleVenue, index){
          return <a className={classNames('columns small-12')} key={index} onClick={self.showVenue.bind(null,singleVenue.name,singleVenue)} data-venue="">{singleVenue.name}</a>;
        })}  
      </div>    
    );
  }, 
  showVenue(currName,venueCompleteObj) {
    ReactDOM.render(<Venue venueCompleteObj={venueCompleteObj} venueName={currName}/>,document.getElementById('venue-bind'));
  }
});

export default Map;