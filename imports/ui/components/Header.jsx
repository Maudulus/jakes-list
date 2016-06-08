import React from 'react';
import { Link } from 'react-router';

import LoginButtons from './LoginButtons.jsx';

export default class Header extends React.Component {
  render() {
    return (
      <header className='Header'>
        <Link to="/">Map</Link> &nbsp;
        <Link to="about">About Page</Link> &nbsp;

        <LoginButtons align='left' />
      </header>
    );
  }
}
