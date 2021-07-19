import { Col } from 'react-bootstrap';
import './styles/MainChat.css';
import { AiOutlineSearch } from 'react-icons/ai';
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
                <span className="magnify-wrapper">
                  <AiOutlineSearch className="magnify-glass-navbar" />
                </span>{' '}
                <FormControl
                  type="text"
                  placeholder="Search"
                  className="navbar-searching-style"
                />
              </div>
            </Col>
          </div>
        </div>
      </Col>
    </>
  );
};
export default MainChat;
