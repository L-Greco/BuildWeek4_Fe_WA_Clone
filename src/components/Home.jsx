import { Container, Row, Col } from 'react-bootstrap';
import LeftNav from './LeftNav';
import MainChat from './MainChat';

import '../index.css';
import data from './json/profile.json'; ////this will be data coming from fetch!!!!!!!!!!!!!!!/////

const Home = () => {
  return (
    <Container>
      <Row className="main-div-home">
        <Col md={4}>
          <LeftNav
            profile={data.profile}
            chats={data.chats}
            friends={data.friends}
          />
        </Col>
        <Col md={8}>
          <MainChat />
        </Col>
      </Row>
    </Container>
  );
};
export default Home;
