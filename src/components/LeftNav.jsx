import './styles/LeftNav.css';
import { Col, FormControl } from 'react-bootstrap';
import { AiOutlineSearch } from 'react-icons/ai';

import { BsThreeDotsVertical } from 'react-icons/bs';
import { BiMessageDetail, BiLoaderCircle } from 'react-icons/bi';

import Contacts from './Contacts.jsx';
import ChatItem from './ChatItem';
import { useState } from 'react';

const LeftNav = ({ profile, chats, friends }) => {
  const [selected, setSelected] = useState(false);

  const handleClick = (e) => {
    setSelected(true);
  };
  const toggleContacts = () => {
    console.log('Magda');
    const mainComp = document.getElementById('mainComp');
    mainComp.style.width = 'auto';
  };
  return (
    <>
      <>
        <div className="profile-part-main">
          <img
            src="https://www.svgrepo.com/show/170303/avatar.svg"
            alt="avatar"
            className="avatar-img-style"
          />
          <span className="profile-user-header">{profile.lastName}</span>
          <div className="icons-span">
            <span className="icons-wrapper">
              <BiLoaderCircle className="icons-profile-style" />
            </span>
            <span className="icons-wrapper">
              <BsThreeDotsVertical className="icons-profile-style" />
            </span>
            <span className="icons-wrapper">
              <BiMessageDetail
                onClick={() => toggleContacts()}
                className="icons-profile-style"
              />
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
        <Contacts friends={friends} />

        {chats &&
          chats.map((chat) => <ChatItem key={chat.chat} id={chat.chat} />)}
      </>
    </>
  );
};

export default LeftNav;
