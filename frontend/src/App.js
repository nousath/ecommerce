import React from 'react';
import './css/App.scss';
import { reduxGetState } from './store/redux.js'; 
import _ from 'lodash'; 
// typical store, call it different for dont confuse concept store from ecommerce
import Header from './components/Header.js'
import Footer from './components/Footer.js'
import Content from './components/Content.js'

// main APP
class App extends React.Component {
  render() {
  	const state = reduxGetState();
  	const newStore = _.isEmpty(state.products);
    return [
	      <Header newStore={newStore}></Header>,
	      <Content newStore={newStore}></Content>,
	      <Footer></Footer>
    ];
  }
}

export default App;