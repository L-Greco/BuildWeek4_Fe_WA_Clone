import { Col, Form } from 'react-bootstrap';
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
import { io } from 'socket.io-client';

const ADDRESS = process.env.REACT_APP_BE_URL;
const socket = io(ADDRESS, { transports: ['websocket'] });

const MainChat = () => {
  const [messages, setMessages] = useState();
  const [messageReceived, setMessageReceived] = useState();
  const [newMessage, setNewMessage] = useState('');
  const { selectedChat, user } = useContext(LoginContext);

  const getChatDetails = async () => {
    if (selectedChat) {
      try {
        const res = await getRequest(`chat/${selectedChat}`);
        if ((res.status = 200)) {
          setMessages(res.data.history);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const messageToSend = {
    text: newMessage,
    _id: socket.id,
    chatId: selectedChat,
    date: new Date(),
  };

  const handleSubmit = () => {
    console.log(newMessage);
    console.log(messageToSend);
    socket.emit('send-message', messageToSend, selectedChat);
    setNewMessage('');
  };

  useEffect(() => {
    getChatDetails();
    socket.on('receive-message', (message) => {
      messages.push(message);
    });
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
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="message-input-main-chat"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit();
                    }
                  }}
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
