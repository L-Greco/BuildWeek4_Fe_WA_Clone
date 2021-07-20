import './styles/LeftNav.css';
import { Col, FormControl, Form } from 'react-bootstrap';
import { AiOutlineSearch } from 'react-icons/ai';

import { BsThreeDotsVertical } from 'react-icons/bs';
import { BiMessageDetail, BiLoaderCircle } from 'react-icons/bi';

const LeftNav = () => {
  return (
    <>
      <>
        <div className="profile-part-main">
          <img
            src="https://www.svgrepo.com/show/170303/avatar.svg"
            alt="avatar"
            className="avatar-img-style"
          />{' '}
          <div className="icons-span">
            <span className="icons-wrapper">
              <BiLoaderCircle className="icons-profile-style" />
            </span>
            <span className="icons-wrapper">
              <BsThreeDotsVertical className="icons-profile-style" />
            </span>
            <span className="icons-wrapper">
              <BiMessageDetail className="icons-profile-style" />
            </span>
          </div>
        </div>
        <Col md={12}>
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
        </Col>

        <div className="chats-list">chats</div>
      </>
    </>
  );
};

export default LeftNav;
