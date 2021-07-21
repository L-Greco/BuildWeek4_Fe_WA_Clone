import { Col } from 'react-bootstrap';
import './styles/MainChat.css';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsFillMicFill } from 'react-icons/bs';
import { FormControl } from 'react-bootstrap';
import 'react-chat-elements/dist/main.css';
import { MessageList } from 'react-chat-elements';
import { LoginContext } from './GlobalState';
import { useContext, useEffect } from 'react';
import { getRequest } from '../lib/axios';
import { useState } from 'react';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

const MainChat = () => {
  const [messages, setMessages] = useState();
  const { selectedChat, user } = useContext(LoginContext);

  const getChatDetails = async () => {
    if (selectedChat) {
      try {
        const res = await getRequest(`chat/${selectedChat}`);
        if ((res.status = 200)) {
          console.log(res.data.history);
          setMessages(res.data.history);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  // getChatDetails();

  useEffect(() => {
    getChatDetails();
  }, [selectedChat]);
  return (
    <>
      <Col md={12}>
        <div className="main-chat-view">
          <div className="chat-header">
            {' '}
            <img
              src="https://www.svgrepo.com/show/170303/avatar.svg"
              alt="avatar"
              className="avatar-img-style"
            />
          </div>

          <MessageList
            lockable={true}
            toBottomHeight={'100%'}
            dataSource={
              messages &&
              messages.map((message) => {
                return {
                  ...message,
                  position: user._id === message.userId ? 'right' : 'left',
                  date: message.date ? parseISO(message.date) : 'nothing',
                };
              })
            }
          />

          <div>
            <Col md={12}>
              <div className="searching-div-main-chat">
                <span>
                  <AiOutlineSearch className="magnify-glass-main-chat" />
                </span>{' '}
                <FormControl
                  type="text"
                  placeholder="Type your message..."
                  className="message-input-main-chat"
                />
                <span>
                  <BsFillMicFill className="voice-message-icon" />
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
