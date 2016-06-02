import Home from '../ui/pages/Home.jsx';
import Map from '../ui/pages/Map.jsx';
import Venue from '../ui/pages/Venue.jsx';
import About from '../ui/pages/About.jsx';
import NotFound from '../ui/pages/NotFound.jsx';

const routes = [
  {
    path: '/',
    component: Map
  },
  {
    path: '/home',
    component: Home
  }, {
    path: '/venue/:venueName',
    component: Venue
  },  
  {
    path: '/about',
    component: About
  }, {
    path: '*',
    component: NotFound
  }
];

export default routes;
