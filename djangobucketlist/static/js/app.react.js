import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { render } from 'react-dom';

import Dashboard from './components/dashboard.jsx';
import Home from './components/home.jsx';
import Main from './components/main.jsx';

const routes = (<Router history={browserHistory}>
                  <Route path="/" component={Main}>
                      <IndexRoute component={Home} history={browserHistory}/>
                      <Route path="dashboard" component={Dashboard}/>
                  </Route>
                </Router>);

render(routes, document.getElementById('app'));
