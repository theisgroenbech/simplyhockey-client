import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
// import PersistentDrawerRight from './Drawer';
// import './app.global.css';
import Screen from './Screen';

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', () =>
  render(
    <AppContainer>
      <Screen/>
    </AppContainer>,
    document.getElementById('root')
  )
);
