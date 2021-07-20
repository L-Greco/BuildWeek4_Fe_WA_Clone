import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import BackGround from './components/BackGround';
import Home from './components/Home.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './components/LoginPage';

function App() {
  return (
    <Router>
      <BackGround />
      <Home />
      <LoginPage />
    </Router>
  );
}

export default App;
