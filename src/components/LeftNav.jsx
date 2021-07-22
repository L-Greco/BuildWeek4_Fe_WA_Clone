import './styles/LeftNav.css';
import { Col, FormControl, Form } from 'react-bootstrap';
import { AiOutlineSearch } from 'react-icons/ai';
import {useState, useEffect } from 'react'

import { BsThreeDotsVertical } from 'react-icons/bs';
import { BiMessageDetail, BiLoaderCircle } from 'react-icons/bi';
import Contacts from "./Contacts.jsx";
import Profile from "./Profile";
import ChatItem from "./ChatItem";
import axios from 'axios'

const LeftNav = ({ profile, chats, friends }) => {
  const toggleContacts = () => {
    const mainComp = document.getElementById("mainComp");
    mainComp.style.width = "432px";
  };
  const toggleProfile = () => {
    const mainComp = document.getElementById("myProfile");
    mainComp.style.width = "432px";
  };
  
  const [query, setQuery] = useState(null)
  const handleSearchInput = (event) => {
    const query = event.target.value;
    setQuery(query)
  }




    // useEffect({

  // },[])
  return (
    <>
      <>
        <div className='profile-part-main'>
          <img
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
            </span>
            <span className='icons-wrapper'>
              <BsThreeDotsVertical className='icons-profile-style' />
            </span>
            <span className='icons-wrapper'>
              <BiMessageDetail
                onClick={() => toggleContacts()}
                className='icons-profile-style'
              />
            </span>
          </div>
        </div>
        <Col md={12}>
          	<Form>
						<div className="searching-div">
							<span className="magnify-wrapper">
								<AiOutlineSearch className="magnify-glass-navbar" />
							</span>{" "}
							<FormControl
								onChange={handleSearchInput}
								value={query}
								type="text"
								placeholder="Search contacts"
								className="navbar-searching-style"
							/>
						</div>
					</Form>
        </Col>
        <Contacts friends={friends} />
        <Profile profile={profile} />

        {chats &&
          chats.map((item) => (
            <ChatItem
              key={item._id}
              owner={profile.lastName}
              participants={item.chat.participants}
              id={item.chat._id}
              message={item.chat.latestMessage.text}
              time={item.chat.latestMessage.updatedAt}
            />
          ))}
      </>
    </>
  );
};

export default LeftNav;
