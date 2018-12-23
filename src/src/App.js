import React from 'react';
import './css/App.scss';
import redux from './store'; 
// typical store, call it different for dont confuse concept store from ecommerce
import Header from './components/Header.js'

// main APP
class App extends React.Component {
  render() {
    console.log(redux.getState());
    return (
      <Header redux={redux.getState()}></Header>
    );
  }
}

export default App;