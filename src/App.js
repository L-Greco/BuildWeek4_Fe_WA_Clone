import './App.css';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import BackGround from './components/BackGround';
import Home from './components/Home.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './components/LoginPage';
import { LoginContext } from "../src/components/GlobalState";
import { useContext } from "react"


function App() {
  const { loggedIn, setLoggedIn, user } = useContext(LoginContext);
  return (

    <Router>
      <BackGround />
      <Route component={LoginPage} path="/" exact />
      <Route exact path="/home">
        {!loggedIn ? <Redirect to="/" /> : <Home />}
      </Route>


    </Router>
  );
}

export default App;
