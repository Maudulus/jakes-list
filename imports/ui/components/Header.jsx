import React from 'react';
import { Link } from 'react-router';

import LoginButtons from './LoginButtons.jsx';

export default class Header extends React.Component {
  render() {
    return (
      <header className='Header'>
      	<div id="top-bar-section">
	        <Link to="/">Map</Link> &nbsp;
	        <Link to="about">About</Link> &nbsp;

	        <LoginButtons align='left' />
        </div>
      </header>
    );
  }
}
