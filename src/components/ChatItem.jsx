import "./styles/LeftNav.css";
import { Row, Col } from "react-bootstrap";
import parseISO from "date-fns/parseISO";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "./GlobalState";
import { format } from "date-fns";

const ChatItem = ({ id, participants, message, time, owner }) => {
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
        onClick={() => {
          setChatPartner({
            name: participants.find((el) => {
              return el.profile.email !== user.profile.email;
            }).profile.email,
            avatar: participants.find((el) => {
              return el.profile.email !== user.profile.email;
            }).profile.avatar,
            online: participants.find((el) => {
              return el.profile.email !== user.profile.email;
            }).profile.online,
          });
          setSelectedChat(id);
        }}>
        <Row>
          <Col sm={2}>
            <img
              src={participants[0].profile.avatar}
              alt='avatar'
              className='avatar-chat'
            />{" "}
          </Col>
          <Col sm={8}>
            <div className='chat-item-contact'>
              {participants &&
                participants
                  .filter((i) => i.profile.email !== user.profile.email)
                  .map((single) => single.profile.email)}
            </div>
            <div className='chat-item-messaage'>
              {message ? message : "lack of content"}
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
