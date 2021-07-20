import './styles/LeftNav.css';
import { Row, Col } from 'react-bootstrap';

const ChatItem = ({ id }) => {
  return (
    <>
      <div className="chat-list-item">
        <Row>
          <Col sm={2}>
            <img
              src="https://www.svgrepo.com/show/170303/avatar.svg"
              alt="avatar"
              className="avatar-chat"
            />{' '}
          </Col>
          <Col sm={8}>
            <div className="chat-item-contact">id of the chat</div>
            <div className="chat-item-messaage">{id}</div>
          </Col>
          <Col sm={2}>
            <div className="chat-item-time"> 11:28</div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ChatItem;
