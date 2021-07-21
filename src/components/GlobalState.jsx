import React, { useState } from 'react';

export const LoginContext = React.createContext();

const GlobalState = ({ children }) => {
  const [user, setUser] = useState({});
  const [selectedChat, setSelectedChat] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <LoginContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        loggedIn,
        setLoggedIn,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
export default GlobalState;
