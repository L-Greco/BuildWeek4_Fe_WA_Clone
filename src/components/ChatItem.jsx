import './styles/LeftNav.css';
import { Row, Col } from 'react-bootstrap';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import { useContext, useEffect } from 'react';
import { LoginContext } from './GlobalState';
import { getRequest } from '../lib/axios';

const ChatItem = ({ id, participants, message, time, owner }) => {
  const { setSelectedChat, selectedChat } = useContext(LoginContext);

  return (
    <>
      <div className="chat-list-item" onClick={() => setSelectedChat(id)}>
        <Row>
          <Col sm={2}>
            <img
              src="https://www.svgrepo.com/show/170303/avatar.svg"
              alt="avatar"
              className="avatar-chat"
            />{' '}
          </Col>
          <Col sm={8}>
            <div className="chat-item-contact">
              {participants &&
                participants
                  .filter((i) => i.profile.lastName !== owner)
                  .map((single) => single.profile.lastName)}
            </div>
            <div className="chat-item-messaage">
              {message ? message : 'lack of content'}
            </div>
          </Col>
          <Col sm={2}>
            <div className="chat-item-time">
              {time ? parseISO(time) : 'nothing'}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ChatItem;
