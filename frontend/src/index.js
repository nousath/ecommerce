import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import App from './App.js';
import redux from './store/index.js';
import { checkBackend } from './store/api.js';

const render = () => {
  console.log('render',redux.getState()); // debug
  return ReactDOM.render(<App />, document.getElementById("root"));
};

// request sessiontoken from localstorage, then request info from backend
checkBackend();

// load reactjs into html
redux.subscribe(render);
render();

// serviceworker for offline
serviceWorker.register();