import React, { Dispatch, SetStateAction, useState } from "react";

export const LoginContext = React.createContext();

const GlobalState = ({ children }) => {
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <LoginContext.Provider value={{ user, setUser, loggedIn, setLoggedIn }}>
      {children}
    </LoginContext.Provider>
  );
};

export default GlobalState;
