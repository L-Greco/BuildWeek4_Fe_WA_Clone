import "./styles/LeftNav.css";
import { Col, FormControl, Form } from "react-bootstrap";
import { AiOutlineSearch } from "react-icons/ai";
import { useState, useContext } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiMessageDetail, BiLoaderCircle } from "react-icons/bi";
import Contacts from "./Contacts.jsx";
import Profile from "./Profile";
import ChatItem from "./ChatItem";
import Users from "./Users";
import { getRequest, postRequest } from "../lib/axios";
import { LoginContext } from "./GlobalState";
import { SocketContext } from "../socket";

const LeftNav = ({ profile, chats, friends }) => {
  const toggleContacts = () => {
    const mainComp = document.getElementById("mainComp");
    mainComp.style.width = "33%";
  };
  const toggleProfile = () => {
    const mainComp = document.getElementById("myProfile");
    mainComp.style.width = "33%";
  };
  const [query, setQuery] = useState(null);
  const [users, setUsers] = useState(null);
  const [check, setCheck] = useState(false);
  const [groupName, setGroupName] = useState("Hell Hello");
  const [chat, setChat] = useState(null);
  const { setUser, setLoggedIn } = useContext(LoginContext);
  const socket = useContext(SocketContext);

  const handleSearchInput = (event) => {
    const query = event.target.value;
    setQuery(query);
  };

  const getChats = async () => {
    try {
      const request = await getRequest("chat/me");
      if (request.status === 200) {
        const chats = request.data.map((ch) => {
          return { hidden: false, chat: ch };
        });
        setUser((u) => {
          return { ...u, chats: chats };
        });
      }
    } catch (error) {
      console.log();
      if (error.response?.status === 401) {
        // socket.emit("offline", user._id);
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
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
      if (error.response?.status === 401) {
        // socket.emit("offline", user._id);
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
    }
  };

  const makeChat = async (participantId) => {
    const chatObject = {
      name: groupName,
      participants: [participantId],
    };
    try {
      const request = await postRequest("chat", chatObject);
      if (request.status === 200) {
        setChat(request.data);
        getChats();
        socket.emit(
          "participants-Join-room",
          request.data._id,
          request.data.participants
        );
        setUsers(null);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        // socket.emit("offline", user._id);
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
    }
  };

  const handleCheckBox = (event) => {
    setCheck(!check);
  };

  return (
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
        <Form onSubmit={makeQuery}>
          <div className='searching-div'>
            <span className='magnify-wrapper'>
              <AiOutlineSearch className='magnify-glass-navbar' />
            </span>{" "}
            <FormControl
              onChange={handleSearchInput}
              value={query}
              type='text'
              placeholder={
                check == true ? "Search for contacts" : "Search for users"
              }
              className='navbar-searching-style'
            />
            <input
              type='checkbox'
              style={{ marginLeft: "5px" }}
              onChange={handleCheckBox}
            />
          </div>
        </Form>
      </Col>
      <Contacts friends={friends} />
      <Profile profile={profile} />

      {users !== null && query
        ? users.map((user, i) => (
            <div
              key={i}
              onClick={() => {
                makeChat(user._id);
              }}>
              <Users key={user._id} user={user} />
            </div>
          ))
        : chats !== undefined && chats?.length > 0
        ? chats.map((item) => {
            if (item.chat !== null) {
              return (
                <ChatItem
                  key={item._id}
                  owner={profile.lastName}
                  participants={item.chat.participants}
                  id={item.chat._id}
                  message={item.chat.latestMessage.text}
                  time={item.chat.latestMessage.date}
                />
              );
            }
          })
        : null}
    </>
  );
};
export default LeftNav;
