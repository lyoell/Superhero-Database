import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import AuthDetails from './components/auth/AuthDetails';
import NoAuthPage from './components/pages/NoAuthPage';

const App = () => {
  return (
    <Router>
        <Route path="/NoAuthorization">
          <NoAuthPage/>
        </Route> 
        <Route path="/LoginPage">
          <SignIn />
          <AuthDetails /> 
        </Route>
        <Route path="/SignupPage">
        <SignUp />
        <AuthDetails/>
        </Route>
    </Router>
  );
};
 
export default App;
