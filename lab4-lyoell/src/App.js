import './App.css';
import { BrowserRouter as Router,Routes,  Route, Switch } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import AuthDetails from './components/auth/AuthDetails';
import NoAuthPage from './components/pages/NoAuthPage';
import DefaultPage from './components/pages/DefaultPage';
import AuthorizedPage from './components/pages/AuthorizedPage';
import InfoPage from './components/pages/InfoPage';
import Admin from './components/pages/Admin';

  const App = () => {
  return (
    <Router>
      <Routes>
        <Route path = "/DefaultPage" element={<DefaultPage/>}>
        </Route>
        <Route path="/NoAuthorization" element={<NoAuthPage/>}>
        </Route> 
        <Route path="/LoginPage" element={<SignIn />}>
        </Route>
        <Route path="/SignupPage" element={<SignUp />}>
        </Route>
        <Route path='/AuthorizedPage' element={<AuthorizedPage/>}>
        </Route>
        <Route path='/InfoPage' element={<InfoPage/>}>
        </Route>
        <Route path='/AdminPage' element={<Admin/>}>
        </Route>
        </Routes>
    </Router>
  );
};
 
export default App;

