import './styles/Profile.css';
import { HiArrowNarrowLeft } from 'react-icons/hi';

import { Row, Col } from 'react-bootstrap';

const Profile = ({ profile }) => {
  const untoggleProfile = () => {
    const mainComp = document.getElementById('myProfile');
    mainComp.style.width = '0px';
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
            <div className="contacts-div-text">{profile.lastName}</div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="profile-avatar-wrapper">
              <img
                src={profile.avatar}
                className="profile-avatar"
                alt="profile-avatar"
              />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Profile;
