import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import BackGround from './components/BackGround';
import Home from './components/Home.jsx';

function App() {
  return (
    <Router>
      <BackGround />
      <Home />
    </Router>
  );
}

export default App;
