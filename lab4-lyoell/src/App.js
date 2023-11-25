import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import AuthDetails from './components/auth/AuthDetails';
import NoAuthPage from './components/pages/NoAuthPage';
import DefaultPage from './components/pages/DefaultPage';
import AuthorizedPage from './components/pages/AuthorizedPage';
import InfoPage from './components/pages/InfoPage';

//const mongoose = require('mongoose')
//const express = require('express')
//mongoose.connect('mongodb://localhost:27017/databasename')

  const App = () => {
  return (
    <Router>
        <Route path = "/DefaultPage">
        <DefaultPage/>
        </Route>
        <Route path="/NoAuthorization">
          <NoAuthPage/>
        </Route> 
        <Route path="/LoginPage">
          <SignIn />
        </Route>
        <Route path="/SignupPage">
        <SignUp />
        </Route>
        <Route path='/AuthorizedPage'>
          <AuthorizedPage/>
        </Route>
        <Route path='/InfoPage'>
          <InfoPage/>
        </Route>
    </Router>
  );
};
 
export default App;

