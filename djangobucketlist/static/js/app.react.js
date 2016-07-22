import Dashboard from './components/dashboard.jsx';
import Home from './components/home.jsx';
import Main from './components/main.jsx';
import React from 'react';
import { Router, Route, browserHistory, hashHistory, IndexRoute } from 'react-router';
import { render } from 'react-dom';

const routes = (<Router history={browserHistory}>
  <Route path="/" component={Home}/>
  <Route path="dashboard" component={Dashboard}/>
  </Router>)

render(routes, document.getElementById('app'));
