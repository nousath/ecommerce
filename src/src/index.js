import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import App from './App.js';

// load reactjs into html
ReactDOM.render(<App />, document.getElementById('root'));

// serviceworker for offline
serviceWorker.register();