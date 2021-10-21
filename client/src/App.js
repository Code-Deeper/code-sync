import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { createBrowserHistory } from 'history';

import Room from './Components/Room/Room';
import HomePage from './Components/HomePage/HomePage';
import Editor from './Components/Editor/Editor';
import JoinRoom from './Components/Room/JoinRoom';
import CreateRoom from './Components/Room/CreateRoom';
import FrontPage from './Components/FrontPage/FrontPage';
import LoginPage from './Components/Auth/Login/LoginPage';
import Register from './Components/Auth/Register/Register';
import Cookies from 'universal-cookie';
import ProtectedRoute from './Protected'
import Trial from './trial';
const cookies = new Cookies();
const history = createBrowserHistory();

const isAuthenticated =  JSON.parse(localStorage.getItem('authUser'))?.token
function App() {
  useEffect(() => {
    console.log({ authroot: isAuthenticated });
  }, [isAuthenticated])
  const [loginUser, setLoginUser] = useState(null)





  return (
    
    <Router history={history}>
      <Route path="/" component={FrontPage} exact />
      <Route path="/login" render={(props) => <LoginPage {...props} />} exact />
      <Route path="/register" component={Register} exact />
      <ProtectedRoute path='/room' component={HomePage} exact />
      <Route path='/room/:id' render={(props) => (isAuthenticated ? <Room {...props} /> : <Redirect to="/login" />)} exact />
      <ProtectedRoute path='/joinRoom' render={JoinRoom} exact />
      <Route path='/newRoom' render={(props) => isAuthenticated ? <CreateRoom {...props} /> : <Redirect to="/login" />} exact />
      <Route path='/editor' render={Editor} exact />
      <Route path='/trial' render={(props) => <Trial {...props} />} exact />

    </Router>
  );
}

export default App;
