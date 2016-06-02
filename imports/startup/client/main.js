import './app.jsx';
(function myLoop (i) {          
	setTimeout(function () {   
          geo = Geolocation.latLng();
          if (--i && geo == null) myLoop(i);      
      }, 1000)
})(10); 