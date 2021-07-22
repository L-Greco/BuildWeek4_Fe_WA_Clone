import './App.css';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import BackGround from './components/BackGround';
import Home from './components/Home.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './components/LoginPage';
import { LoginContext } from '../src/components/GlobalState';
import { io } from 'socket.io-client';

import { getRequest } from './lib/axios';
import { useEffect, useContext } from 'react';

const ADDRESS = process.env.REACT_APP_BE_URL;
export const socket = io(ADDRESS, { transports: ['websocket'] });

function App() {
  const { loggedIn, setLoggedIn, setUser,setSelectedChat, user,setChatPartner } = useContext(LoginContext);

  const isLogged = async () => {
    try {
      const data = await getRequest(`users/me`);
      if (data.status === 200) {
        setLoggedIn(true);
        setUser(data.data);
        setSelectedChat(data.data.chats[0].chat._id)
        setChatPartner({
          name: data.data.chats[0].chat.participants[0].profile.email,
          avatar: data.data.chats[0].chat.participants[0].profile.avatar,
          online: data.data.chats[0].chat.participants[0].profile.online,
        });
        socket.emit('connect-chats', data.data._id, data.data.chats);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        // socket.emit("offline", user._id);
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
    }
  };
  useEffect(() => {
    isLogged();

    // return socket.emit('offline', user._id);
  }, [loggedIn]);

  return (
    <Router>
      {!loggedIn && <Redirect to="/" />}
      {loggedIn && <Redirect to="/home" />}
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
