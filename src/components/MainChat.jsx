import { Col } from 'react-bootstrap';
import './styles/MainChat.css';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsFillMicFill } from 'react-icons/bs';
import { FormControl } from 'react-bootstrap';
import 'react-chat-elements/dist/main.css';
import { MessageList } from 'react-chat-elements';
import { LoginContext } from './GlobalState';
import { useContext } from 'react';
import { getRequest } from '../lib/axios';
import { useState } from 'react';

const MainChat = () => {
  const [messages, setMessages] = useState();
  const { selectedChat } = useContext(LoginContext);

  const getChatDetails = async () => {
    try {
      const res = await getRequest(`chat/${selectedChat}`);
      if (res.status === 200) {
        console.log(res);
        setMessages(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
            dataSource={[
              {
                position: 'left',
                type: 'text',
                text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
                date: new Date(),
                user: 'me',
              },
              {
                position: 'right',
                type: 'text',
                text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
                date: new Date(),
              },
              {
                position: 'right',
                type: 'text',
                text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
                date: new Date(),
              },
            ]}
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
