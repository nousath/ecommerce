import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import App from './App.js';
import redux from './store';

const render = () => {
  console.log(redux.getState()); // debug
  return ReactDOM.render(<App />, document.getElementById("root"));
};

// load reactjs into html
redux.subscribe(render);
render();

// serviceworker for offline
serviceWorker.register();