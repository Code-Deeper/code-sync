import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import Room from './Components/Room/Room';
import HomePage from './Components/HomePage/HomePage';
import Editor from './Components/Editor/Editor';
import JoinRoom from './Components/Room/JoinRoom';
import CreateRoom from './Components/Room/CreateRoom';
import FrontPage from './Components/FrontPage/FrontPage';
import LoginPage from './Components/Auth/Login/LoginPage';
import ForgotPassword from './Components/Auth/ForgotPassword/ForgotPassword';
import ResetPassword from './Components/Auth/ResetPassword/ResetPassword';
import Register from './Components/Auth/Register/Register';
import Cookies from 'universal-cookie';
import ProtectedRoute from './Protected';
import Trial from './Components/trial/trial';
import ReactGA from 'react-ga';
import TeamPage from './Components/Team Page/TeamPage';
import NotFound from './Components/NotFound/NotFound';
import { Helmet } from 'react-helmet';
import { useMediaQuery } from 'react-responsive';
import Mobile from './Components/Mobile/Mobile';
const cookies = new Cookies();
const history = createBrowserHistory();

const isAuthenticated = JSON.parse(localStorage.getItem('authUser'))?.token;
function App() {
  // useEffect(() => {
  //   console.log({ authroot: isAuthenticated });
  // }, [isAuthenticated])
  useEffect(() => {
    ReactGA.initialize('UA-213485416-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  const [loginUser, setLoginUser] = useState(null);
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)',
  });
  const isBigScreen = useMediaQuery({ query: '(min-width: 1200px)' });

  console.log({ isBigScreen });

  return (
    <>
      <Helmet>
        <title>CodeSync</title>
        <meta
          name='description'
          content='Cloud collaborative tool for student , Teachers and Professional with real time code editor or IDE, Realtime drawing board , Real time chat app '
        />
      </Helmet>
      {isBigScreen == true ? (
        <Router history={history}>
          <Route path='/' component={FrontPage} exact />
          <Route path='/forgot_password' exact component={ForgotPassword} />
          <Route path='/_reset_password/:id' exact component={ResetPassword} />

          <Route
            path='/login'
            render={(props) => <LoginPage {...props} />}
            exact
          />
          <Route path='/register' component={Register} exact />
          <ProtectedRoute path='/room' component={HomePage} exact />
          <Route
            path='/room/:id'
            render={(props) =>
              isAuthenticated ? <Room {...props} /> : <Redirect to='/login' />
            }
            exact
          />
          <ProtectedRoute path='/joinRoom' render={JoinRoom} exact />
          <Route
            path='/newRoom'
            render={(props) =>
              isAuthenticated ? (
                <CreateRoom {...props} />
              ) : (
                <Redirect to='/login' />
              )
            }
            exact
          />
          <Route path='/editor' render={Editor} exact />
          <Route path='/trial' render={(props) => <Trial {...props} />} exact />
          <Route path='/team' component={TeamPage} exact />
        </Router>
      ) : (
        <Mobile />
      )}
    </>
  );
}

export default App;
