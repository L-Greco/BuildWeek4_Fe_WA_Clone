import "./styles/Profile.css";
import { HiArrowNarrowLeft } from "react-icons/hi";

import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getRequest } from "./../lib/axios";
import { LoginContext } from "./GlobalState";
import { useContext } from "react";
import { socket } from "../App";

const Profile = ({ profile }) => {
  const untoggleProfile = () => {
    const mainComp = document.getElementById("myProfile");
    mainComp.style.width = "0px";
  };

  const { setLoggedIn, setUser, user } = useContext(LoginContext);

  const logout = async () => {
    try {
      const res = await getRequest("users/logout");
      if (res.status === 200) {
        socket.emit("offline", user._id);
        setLoggedIn(false);
        setUser({});
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div id='myProfile' className='profile-left-nav'>
        <div className='navigation-profile'>
          <span>
            <HiArrowNarrowLeft
              onClick={() => untoggleProfile()}
              className='narrow-header'
            />
          </span>
          <span className='navigation-header'> Profile</span>
        </div>

        <Row>
          <Col md={12}>
            <div className='contacts-div-text'>
              {profile && profile.lastName}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className='profile-avatar-wrapper'>
              <img
                src={profile && profile.avatar}
                className='profile-avatar'
                alt='profile-avatar'
              />
            </div>
            <Link onClick={() => logout()}>Log out</Link>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Profile;
