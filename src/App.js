import './App.css';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import BackGround from './components/BackGround';
import Home from './components/Home.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './components/LoginPage';
import { LoginContext } from "../src/components/GlobalState";
import { useContext } from "react"


function App() {
  const { loggedIn } = useContext(LoginContext);
  return (

    <Router>
      <BackGround />
      <Route component={LoginPage} path="/" exact />
      {/* Uncomment the line 19 and comment line 20-22 to prevent logged in behaviour */}
      {/* <Route component={Home} path="/home" exact /> */}
      <Route exact path="/home">
        {!loggedIn ? <Redirect to="/" /> : <Home />}
      </Route>


    </Router>
  );
}

export default App;
