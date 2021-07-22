import './styles/LeftNav.css';
import { Row, Col } from 'react-bootstrap';
import parseISO from 'date-fns/parseISO';
import { useContext } from 'react';
import { LoginContext } from './GlobalState';

const ChatItem = ({ id, participants, message, time, owner }) => {
  const { setSelectedChat, setChatPartner, user } = useContext(LoginContext);

  return (
    <>
      <div
        className="chat-list-item"
        onClick={() => {
          setChatPartner({
            name: user.chats[0].chat.participants.find((el) => {
              return el.profile.email !== user.profile.email;
            }).profile.email,
            avatar: user.chats[0].chat.participants.find((el) => {
              return el.profile.email !== user.profile.email;
            }).profile.avatar,
            online: user.chats[0].chat.participants.find((el) => {
              return el.profile.email !== user.profile.email;
            }).profile.online,
          });
          setSelectedChat(id);
        }}
      >
        <Row>
          <Col sm={2}>
            <span>
              <img
                src={participants[0].profile.avatar}
                alt="avatar"
                className="list-avatar-wrapper"
              />{' '}
            </span>
          </Col>
          <Col sm={8}>
            <div className="chat-item-contact">
              {participants &&
                participants
                  .filter((i) => i.profile.email !== user.profile.email)
                  .map((single) => single.profile.email)}
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
