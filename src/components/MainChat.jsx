<<<<<<< Updated upstream
import { Col } from 'react-bootstrap';
import './styles/MainChat.css';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsFillMicFill } from 'react-icons/bs';
import { FormControl } from 'react-bootstrap';

const MainChat = () => {
=======
import { Col } from "react-bootstrap";
import "./styles/MainChat.css";
import { AiOutlineSearch } from "react-icons/ai";
import { BsFillMicFill } from "react-icons/bs";
import { FormControl } from "react-bootstrap";
import "react-chat-elements/dist/main.css";
import { MessageList } from "react-chat-elements";
import { LoginContext } from "./GlobalState";
import { getRequest } from "../lib/axios";
import { useState, useEffect, useContext } from "react";

const MainChat = () => {
  const [messages, setMessages] = useState([]);
  console.log("messages:", messages);
  const { selectedChat, user } = useContext(LoginContext);

  const getChatDetails = async () => {
    try {
      const res = await getRequest(`chat/${selectedChat}`);
      if (res.status === 200) {
        setMessages(res.data.history);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getChatDetails();
  }, [selectedChat]);

>>>>>>> Stashed changes
  return (
    <>
      <Col md={12}>
        <div className='main-chat-view'>
          <div className='chat-header'>
            {" "}
            <img
              src='https://www.svgrepo.com/show/170303/avatar.svg'
              alt='avatar'
              className='avatar-img-style'
            />
          </div>
<<<<<<< Updated upstream
=======
          <MessageList
            lockable={true}
            toBottomHeight={"100%"}
            dataSource={
              messages !== [] &&
              messages.map((message) => {
                message = {
                  ...message,
                  position: user._id === message.userId ? "right" : "left",
                };
                return message;
              })
            }
          />

>>>>>>> Stashed changes
          <div>
            <Col md={12}>
              <div className='searching-div-main-chat'>
                <span>
                  <AiOutlineSearch className='magnify-glass-main-chat' />
                </span>{" "}
                <FormControl
                  type='text'
                  placeholder='Type your message...'
                  className='message-input-main-chat'
                />
                <span>
                  <BsFillMicFill className='voice-message-icon' />
                </span>
              </div>
            </Col>
          </div>
        </div>
      </Col>
    </>
  );
};
export default MainChat;
