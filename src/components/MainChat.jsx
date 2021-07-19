import { Col } from 'react-bootstrap';
import './styles/MainChat.css';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsFillMicFill } from 'react-icons/bs';
import { FormControl } from 'react-bootstrap';

const MainChat = () => {
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
