import React, { useState } from "react";

export const LoginContext = React.createContext();

const GlobalState = ({ children }) => {
  const [user, setUser] = useState({});
  const [selectedChat, setSelectedChat] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatPartner, setChatPartner] = useState({});
  return (
    <LoginContext.Provider
      value={{
        user,
        chatPartner,
        setChatPartner,
        setUser,
        isTyping,
        setIsTyping,
        selectedChat,
        setSelectedChat,
        loggedIn,
        setLoggedIn,
        messages,
        setMessages,
      }}>
      {children}
    </LoginContext.Provider>
  );
};
export default GlobalState;
