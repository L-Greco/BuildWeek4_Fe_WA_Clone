import './styles/LeftNav.css';
import { Row, Col } from 'react-bootstrap';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

const ChatItem = ({ id, participants, message, time, owner }) => {
  console.log(time);

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
            <div className="chat-item-contact">
              {participants
                .filter((i) => i.profile.lastName !== owner)
                .map((single) => single.profile.lastName)}
            </div>
            <div className="chat-item-messaage">
              {message ? message : 'lack of content'}
            </div>
          </Col>
          <Col sm={2}>
            <div className="chat-item-time">
              {time ? format(parseISO(time), 'HH:mm') : 'nothing'}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ChatItem;
