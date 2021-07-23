import './styles/Contacts.css';
import { HiArrowNarrowLeft } from 'react-icons/hi';
import { AiOutlineSearch, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { HiUserAdd } from 'react-icons/hi';
import { FormControl, Row, Col, Modal, Button } from 'react-bootstrap';
import { useCallback, useEffect, useContext, useState } from 'react';
import { getRequest, postRequest } from '../lib/axios';
import { LoginContext } from './GlobalState';
import { SocketContext } from '../socket';

const Contacts = ({ friends, history }) => {
  const { allUsers, setAllUsers, group, setGroup, setUser, setLoggedIn } =
    useContext(LoginContext);
  const socket = useContext(SocketContext);

  const [groupChat, setGroupChat] = useState(null);
  const [setUsers] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [visible, setModalVisibility] = useState(false);

  const getAllUsers = useCallback(async () => {
    try {
      const res = await getRequest('users/all');
      if (res.status === 200) {
        setAllUsers(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    getAllUsers();
  }, []);

  const untoggleContacts = () => {
    const mainComp = document.getElementById('mainComp');
    mainComp.style.width = '0px';
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
      console.log();
      if (error.response?.status === 401) {
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
    }
  };

  const addToGroup = (id) => {
    setGroup([...group, id]);
    console.log(group);
  };
  const makeGroupChat = async (group) => {
    const groupObject = {
      name: groupName,
      participants: group,
    };
    try {
      const request = await postRequest('chat', groupObject);
      console.log(request);
      if (request.status === 200) {
        setGroupChat(request.data);
        console.log(request.data);
        getChats();
        socket.emit(
          'participants-Join-room',
          request.data._id,
          request.data.participants
        );
        setUsers(null);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
    }
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
                    onChange={(event) => setGroupName(event.target.value)}
                    type="text"
                    value={groupName}
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
                        await makeGroupChat(group);
                        socket.emit(
                          'participants-Join-room',
                          groupChat?._id,
                          groupChat?.participants
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
              <span
                className="group-icon"
                onClick={() => setModalVisibility(true)}
              >
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

        {allUsers &&
          allUsers.map((item) => (
            <Row key={item._id} onClick={() => addToGroup(item._id)}>
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
                  {item.profile.firstName}{' '}
                  <span className="add-icon-wrapper">
                    <HiUserAdd className="add-to-group" />
                  </span>
                </span>
              </Col>
            </Row>
          ))}
      </div>
    </>
  );
};

export default Contacts;
