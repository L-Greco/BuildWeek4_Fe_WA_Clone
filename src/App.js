import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import BackGround from "./components/BackGround"
import LoginPage from './components/LoginPage';


function App() {
  return (

    <Router>
      <BackGround />
      <LoginPage />

    </Router>
  )
}

export default App;
