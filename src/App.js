import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import BackGround from './components/BackGround';
import Home from './components/Home.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './components/LoginPage.jsx';

function App() {
  return (
    <Router>
      <BackGround />
      <Route component={LoginPage} path="/" exact />
      <Route component={Home} path="/Home" exact />
    </Router>
  );
}

export default App;
