import { Container, Row, Col } from "react-bootstrap";
import LeftNav from "./LeftNav";
import MainChat from "./MainChat";
import "../index.css";

const Home = () => {
  return (
    <Container>
      <Row className="main-div-home">
        <Col md={4}>
          <LeftNav />
        </Col>
        <Col md={8}>
          <MainChat />
        </Col>
      </Row>
    </Container>
  );
};
export default Home;
