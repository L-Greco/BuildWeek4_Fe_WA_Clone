<<<<<<< Updated upstream
import './styles/LeftNav.css';
import { Col, FormControl, Form } from 'react-bootstrap';
import { AiOutlineSearch } from 'react-icons/ai';
=======
import "./styles/LeftNav.css";
import { Col, FormControl } from "react-bootstrap";
import { AiOutlineSearch } from "react-icons/ai";
>>>>>>> Stashed changes

import { BsThreeDotsVertical } from "react-icons/bs";
import { BiMessageDetail, BiLoaderCircle } from "react-icons/bi";

<<<<<<< Updated upstream
const LeftNav = () => {
=======
import Contacts from "./Contacts.jsx";
import Profile from "./Profile";
import ChatItem from "./ChatItem";

const LeftNav = ({ profile, chats, friends }) => {
  const toggleContacts = () => {
    const mainComp = document.getElementById("mainComp");
    mainComp.style.width = "432px";
  };
  const toggleProfile = () => {
    const mainComp = document.getElementById("myProfile");
    mainComp.style.width = "432px";
  };
>>>>>>> Stashed changes
  return (
    <>
      <>
        <div className='profile-part-main'>
          <img
<<<<<<< Updated upstream
            src="https://www.svgrepo.com/show/170303/avatar.svg"
            alt="avatar"
            className="avatar-img-style"
          />{' '}
          <div className="icons-span">
            <span className="icons-wrapper">
              <BiLoaderCircle className="icons-profile-style" />
=======
            src='https://www.svgrepo.com/show/170303/avatar.svg'
            alt='avatar'
            className='avatar-img-style'
            onClick={() => toggleProfile()}
          />
          <span className='profile-user-header'>
            {profile && profile.firstName}
          </span>
          <div className='icons-span'>
            <span className='icons-wrapper'>
              <BiLoaderCircle className='icons-profile-style' />
>>>>>>> Stashed changes
            </span>
            <span className='icons-wrapper'>
              <BsThreeDotsVertical className='icons-profile-style' />
            </span>
<<<<<<< Updated upstream
            <span className="icons-wrapper">
              <BiMessageDetail className="icons-profile-style" />
=======
            <span className='icons-wrapper'>
              <BiMessageDetail
                onClick={() => toggleContacts()}
                className='icons-profile-style'
              />
>>>>>>> Stashed changes
            </span>
          </div>
        </div>
        <Col md={12}>
          <div className='searching-div'>
            <span className='magnify-wrapper'>
              <AiOutlineSearch className='magnify-glass-navbar' />
            </span>{" "}
            <FormControl
              type='text'
              placeholder='Search contacts'
              className='navbar-searching-style'
            />
          </div>
        </Col>

<<<<<<< Updated upstream
        <div className="chats-list">chats</div>
=======
        {chats &&
          chats.map((item) => (
            <ChatItem
              owner={profile.lastName}
              participants={item.chat.participants}
              id={item.chat._id}
              message={item.chat.latestMessage.text}
              time={item.chat.latestMessage.updatedAt}
            />
          ))}
>>>>>>> Stashed changes
      </>
    </>
  );
};

export default LeftNav;
