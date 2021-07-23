import "./styles/LeftNav.css";
import { Row, Col } from "react-bootstrap";
import parseISO from "date-fns/parseISO";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "./GlobalState";
import { format } from "date-fns";

const ChatItem = ({ id, participants, message, time, owner, chatName }) => {
  const {
    setSelectedChat,
    setChatPartner,
    user,
    newMessages,
    selectedChat,
    setNewMessages,
  } = useContext(LoginContext);

  const [newMessage, setNewMessage] = useState(false);

  useEffect(() => {
    if (newMessages.includes(id)) {
      setNewMessages((m) => {
        return m.filter((chatId) => newMessages.indexOf(chatId) === -1);
      });
      setNewMessage(true);
    }
    if (id === selectedChat) {
      setNewMessage(false);
    }
  }, [newMessages, selectedChat]);
  return (
    <>
      <div
        className='chat-list-item'
        style={{
          backgroundColor: `${selectedChat === id ? "#EBEBEB" : "#fff"}`,
        }}
        onClick={() => {
          setChatPartner({
            name: participants.find((el) => {
              return el.profile.email !== user.profile.email;
            }).profile.firstName,
            avatar: participants.find((el) => {
              return el.profile.email !== user.profile.email;
            }).profile.avatar,
            online: participants.find((el) => {
              return el.profile.email !== user.profile.email;
            }).profile.online,
          });
          setSelectedChat(id);
        }}>
        <Row className='chatRow'>
          <Col sm={2}>
            <span>
              <img
                src={
                  participants.filter((el) => el.profile.socketId !== owner)[0]
                    .profile.avatar
                }
                alt='avatar'
                className='list-avatar-wrapper'
              />{" "}
            </span>
          </Col>
          <Col sm={8} s={4}>
            {chatName ? (
              chatName
            ) : (
              <div className='chat-item-contact'>
                {participants &&
                  participants
                    .filter((i) => i.profile.email !== user.profile.email)
                    .map((single) => single.profile.firstName)}
              </div>
            )}
            <div className='chat-item-message'>
              <span className={message ? "" : "no-message-chat-item"}>
                {" "}
                {message ? message : "no messages"}
              </span>
            </div>
          </Col>
          <Col sm={2}>
            <div className='chat-item-time'>
              {time ? format(parseISO(time), "hh:mm") : "nothing"}
            </div>
            {newMessage && (
              <div
                className=' text-white d-flex justify-content-center align-items-center'
                style={{
                  width: "15px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "#06D755",
                }}>
                <span>1</span>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ChatItem;
