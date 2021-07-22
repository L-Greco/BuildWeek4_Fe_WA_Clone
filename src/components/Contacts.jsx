import './styles/Contacts.css';
import { HiArrowNarrowLeft } from 'react-icons/hi';
import { AiOutlineSearch, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { FormControl, Row, Col } from 'react-bootstrap';

const Contacts = ({ friends }) => {
  const untoggleContacts = () => {
    const mainComp = document.getElementById('mainComp');
    mainComp.style.width = '0px';
  };
  return (
    <>
      <div id="mainComp" className="contacts-left-nav">
        <div className="navigation-new-chat">
          <span>
            <HiArrowNarrowLeft
              onClick={() => untoggleContacts()}
              className="narrow-header"
            />
          </span>
          <span className="navigation-header"> New Chat</span>
        </div>
        <div className="searching-div">
          <span className="magnify-wrapper">
            <AiOutlineSearch className="magnify-glass-navbar" />
          </span>{' '}
          <FormControl
            type="text"
            placeholder="Search contacts"
            className="navbar-searching-style"
          />
        </div>
        <Row>
          <Col md={2}>
            <div className="icon-wrapper">
              <span className="group-icon">
                <AiOutlineUsergroupAdd className="group-icon-style" />
              </span>
            </div>
          </Col>
          <Col md={10}>
            <div className="text-wrapper">
              <span className="new-group-text">New Group</span>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="contacts-div-text">MY CONTACTS</div>
          </Col>
        </Row>

        {friends &&
          friends.map((item) => (
            <Row key={item._id}>
              <Col md={2}>
                <div className="avatar-wrapper">
                  <span className="avatar-div">
                    <img
                      src={item.profile.avatar}
                      className="avatar-img"
                      alt="contact-avatar"
                    />
                  </span>
                </div>
              </Col>
              <Col md={10}>
                <span className="contacts-name-text">
                  {item.profile.firstName}
                </span>
              </Col>
            </Row>
          ))}
      </div>
    </>
  );
};

export default Contacts;
