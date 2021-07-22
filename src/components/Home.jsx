import { Container, Row, Col } from "react-bootstrap";
import LeftNav from "./LeftNav";
import MainChat from "./MainChat";

import "../index.css";

import { useContext } from "react";
import { LoginContext } from "./GlobalState";

const Home = () => {
  const { user } = useContext(LoginContext);
  return (
    <Container>
      <Row className='main-div-home'>
        <Col md={4}>
          <LeftNav
            profile={user.profile}
            chats={user.chats}
            friends={user.friends}
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
