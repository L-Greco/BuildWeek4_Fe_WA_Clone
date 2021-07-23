import './styles/LeftNav.css';
import { Col, FormControl, Form, Modal, Button } from 'react-bootstrap';
import { AiOutlineSearch } from 'react-icons/ai';
import { useState, useEffect, useContext } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { BiMessageDetail, BiLoaderCircle } from 'react-icons/bi';
import Contacts from './Contacts.jsx';
import Profile from './Profile';
import ChatItem from './ChatItem';
import Users from './Users';
import { socket } from '../App';
import { getRequest, postRequest } from '../lib/axios';
import { LoginContext } from './GlobalState';
import { withRouter } from 'react-router-dom';
import Friend from './Friend.jsx';

const LeftNav = ({ profile, chats, friends, history }) => {
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
  const [group, setGroup] = useState(null);
  const [chat, setChat] = useState(null);
  const [visible, setModalVisibility] = useState(false);
  const { setUser } = useContext(LoginContext);

  const handleSearchInput = (event) => {
    const query = event.target.value;
    setQuery(query);
  };

  const getChats = async () => {
    try {
      const request = await getRequest('chat/me');
      if (request.status === 200) {
        const chats = request.data.map((ch) => {
          return { hidden: false, chat: ch };
        });
        setUser((u) => {
          return { ...u, chats: chats };
        });
      }
      if (request.status === 401) {
        history.push('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const makeQuery = async (event) => {
    try {
      const endPoint = check ? `users/me/friends/` : `users/finduser/`;

      event.preventDefault();
      if (query && query.length > 1) {
        const request = await getRequest(endPoint + query);
        if (request.status === 200) {
          setUsers(request.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const makeChat = async (participantId) => {
    const chatObject = {
      name: group,
      participants: [participantId],
    };
    try {
      const request = await postRequest('chat', chatObject);
      if (request.status === 200) {
        setChat(request.data);
        getChats();
        setUsers(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckBox = (event) => {
    setCheck(!check);
  };

  useEffect(() => {}, [query]);

  return (
    <>
      <div className="profile-part-main">
        <img
          src={profile.avatar}
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
                check === true ? 'Search for contacts' : 'Search for users'
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
      <Friend />

      {users !== null && query
        ? users.map((user) => (
            <div>
              <div onClick={() => setModalVisibility(true)}>
                <Users key={user._id} user={user} />
              </div>
              <Modal
                size="lg"
                show={visible}
                aria-labelledby="example-modal-sizes-title-lg"
              >
                <Modal.Header>
                  <Modal.Title
                    style={{ width: '100%' }}
                    id="example-modal-sizes-title-lg"
                  >
                    <div className="w-100 position-relative d-flex- flex-row justify-content-between w-100">
                      <h>Your Group Name</h>

                      <button
                        style={{ top: '-10px', right: '-10px' }}
                        className="btn position-absolute"
                      >
                        <img
                          src="https://cdn4.iconfinder.com/data/icons/web-interface-5/1191/close-512.png"
                          width="40"
                          height="40"
                          alt="close modal sign"
                        />
                      </button>
                    </div>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <input
                    onChange={(event) => setGroup(event.target.value)}
                    type="text"
                    value={group}
                    style={{ padding: '10px', width: '100%' }}
                    placeholder="Enter a name for your group"
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    onClick={() => setModalVisibility(false)}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      if (group !== null && group.length > 2) {
                        await makeChat(user._id);
                        socket.emit(
                          'participants-Join-room',
                          chat?._id,
                          chat?.participants
                        );
                        setGroup(null);
                        setModalVisibility(false);
                      } else {
                        alert(
                          'You have not provided your group name! Please enter a name and try again'
                        );
                      }
                    }}
                    style={{ background: '#1ebea5', border: 'none' }}
                  >
                    Create Group
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          ))
        : chats !== undefined && chats?.length > 0
        ? chats.map((item) => (
            <ChatItem
              key={item._id}
              owner={profile.socketId}
              participants={item.chat.participants}
              id={item.chat._id}
              message={item.chat.latestMessage.text}
              time={item.chat.latestMessage.date}
            />
          ))
        : null}
    </>
  );
};
export default withRouter(LeftNav);
