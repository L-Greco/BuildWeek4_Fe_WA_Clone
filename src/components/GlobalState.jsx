import React, { useState } from "react";

export const LoginContext = React.createContext();

const GlobalState = ({ children }) => {
  const [user, setUser] = useState({});
  const [selectedChat, setSelectedChat] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatPartner, setChatPartner] = useState({});
  const [newMessages, setNewMessages] = useState([]);
  const [socketId, setSocketId] = useState("");
  const [allUsers, setAllUsers] = useState("");
  const [group, setGroup] = useState([]);
  return (
    <LoginContext.Provider
      value={{
        group,
        setGroup,
        allUsers,
        setAllUsers,
        user,
        chatPartner,
        newMessages,
        setNewMessages,
        setChatPartner,
        setUser,
        isTyping,
        setIsTyping,
        selectedChat,
        setSelectedChat,
        socketId,
        setSocketId,
        loggedIn,
        setLoggedIn,
        messages,
        setMessages,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
export default GlobalState;
