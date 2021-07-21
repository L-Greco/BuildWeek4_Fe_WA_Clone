import React, { Dispatch, SetStateAction, useState } from 'react';

export const LoginContext = React.createContext();

const GlobalState = ({ children }) => {
  const [user, setUser] = useState({});
  const [selectedChat, setSelectedChat] = useState({});

  return (
    <LoginContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default GlobalState;
