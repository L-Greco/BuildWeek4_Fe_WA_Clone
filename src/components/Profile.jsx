import './styles/Profile.css';
import { HiArrowNarrowLeft } from 'react-icons/hi';
import { GrEdit } from 'react-icons/gr';

import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getRequest } from './../lib/axios';
import { LoginContext } from './GlobalState';
import { useContext } from 'react';
import { socket } from '../App';

const Profile = ({ profile }) => {
  const untoggleProfile = () => {
    const mainComp = document.getElementById('myProfile');
    mainComp.style.width = '0px';
  };

  const { setLoggedIn, setUser, user } = useContext(LoginContext);

  const logout = async () => {
    try {
      const res = await getRequest('users/logout');
      if (res.status === 200) {
        socket.emit('offline', user._id);
        setLoggedIn(false);
        setUser({});
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div id="myProfile" className="profile-left-nav">
        <div className="navigation-profile">
          <span>
            <HiArrowNarrowLeft
              onClick={() => untoggleProfile()}
              className="narrow-header"
            />
          </span>
          <span className="navigation-header"> Profile</span>
        </div>

        <Row>
          <Col md={12}>
            <div className="profile-div-text">
              {profile && profile.firstName} {profile && profile.lastName}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="profile-avatar-wrapper  ">
              <img
                src={profile && profile.avatar}
                className="profile-avatar"
                alt="profile-avatar"
              />
            </div>
            <div className="profile-details-wrapper">
              <div>
                <div className="name-descr">Your name</div>
                <div className="profile-name-edit">
                  {profile && profile.lastName}
                  <span className="edit-icon-wrapper">
                    <GrEdit />
                  </span>
                </div>
              </div>
            </div>
            <div className="muted-text">
              This is not your name nor PIN. This setting will be visible only
              for your Whatsapp contacts.
            </div>
            <div className="profile-about-wrapper">
              <div>
                <div className="name-descr">About me</div>
                <div className="profile-name-edit">
                  Hey there! I'm using Whatsapp.
                  <span className="edit-icon-wrapper">
                    <GrEdit />
                  </span>
                </div>
              </div>
            </div>
            <button onClick={() => logout()} className="logout-button">
              Log out
            </button>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Profile;
