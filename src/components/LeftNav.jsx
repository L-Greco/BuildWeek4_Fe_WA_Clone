import './styles/LeftNav.css';
import { Col, FormControl, Form } from 'react-bootstrap';
import { AiOutlineSearch } from 'react-icons/ai';
import { useState, useEffect } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { BiMessageDetail, BiLoaderCircle } from 'react-icons/bi';
import Contacts from './Contacts.jsx';
import Profile from './Profile';
import ChatItem from './ChatItem';
import Users from './Users';
import { socket } from '../App';
import { getRequest, postRequest } from '../lib/axios';

const LeftNav = ({ profile, chats, friends }) => {
  const toggleContacts = () => {
    const mainComp = document.getElementById('mainComp');
    mainComp.style.width = '33%';
  };
  const toggleProfile = () => {
    const mainComp = document.getElementById('myProfile');
    mainComp.style.width = '33%';
  };
  const [query, setQuery] = useState(null);
  const [users, setUsers] = useState(null);
  const [check, setCheck] = useState(false);
  const [groupName, setGroupName] = useState('Hell Hello');
  const [chat, setChat] = useState(null);

  const handleSearchInput = (event) => {
    const query = event.target.value;
    setQuery(query);
  };

  const makeQuery = async (event) => {
    const endPoint = check ? `users/me/friends/` : `users/finduser/`;

    event.preventDefault();
    if (query && query.length > 1) {
      const request = await getRequest(endPoint + query);
      setUsers(request.data);
      console.log(request);
    }
  };

  const makeChat = async (participantId) => {
    const chatObject = {
      name: groupName,
      participants: [participantId],
    };
    const request = await postRequest('chat', chatObject);
    setChat(request.data);
    console.log(request.data);
  };

  const handleCheckBox = (event) => {
    setCheck(!check);
  };

  return (
    <>
      <div className="profile-part-main">
        <img
          src="https://www.svgrepo.com/show/170303/avatar.svg"
          alt="avatar"
          className="avatar-img-style"
          onClick={() => toggleProfile()}
        />
        <span className="profile-user-header">
          {profile && profile.firstName}
        </span>
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
        <Form onSubmit={makeQuery}>
          <div className="searching-div">
            <span className="magnify-wrapper">
              <AiOutlineSearch className="magnify-glass-navbar" />
            </span>{' '}
            <FormControl
              onChange={handleSearchInput}
              value={query}
              type="text"
              placeholder={
                check == true ? 'Search for contacts' : 'Search for users'
              }
              className="navbar-searching-style"
            />
            <input
              type="checkbox"
              style={{ marginLeft: '5px' }}
              onChange={handleCheckBox}
            />
          </div>
        </Form>
      </Col>
      <Contacts friends={friends} />
      <Profile profile={profile} />

      {users !== null && query
        ? users.map((user) => (
            <div
              onClick={async () => {
                await makeChat(user._id);
                await socket.emit(
                  'participants-Join-room',
                  chat?._id,
                  chat?.participants
                );
              }}
            >
              <Users key={user._id} user={user} />
            </div>
          ))
        : chats.length > 0 &&
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
  );
};
export default LeftNav;
