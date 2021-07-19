import { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/LoginPage.css";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsGearWideConnected } from "react-icons/bs";

class LoginPage extends Component {
  render() {
    return (
      <div className="mainDiv mx-auto">
        <Row>
          <Col sm={8}>
            <div className="LoginTitle ">To use WhatsApp on your computer:</div>
            <ol>
              <li>Open WhatsApp on your phone</li>
              <li>
                Tap
                <span className="liBold">
                  Menu <BiDotsVerticalRounded />{" "}
                </span>
                or
                <span className="liBold">
                  {" "}
                  Settings <BsGearWideConnected />{" "}
                </span>
                and select
                <span className="liBold"> Linked Devices</span>
              </li>
              <li>Point your phone to this screen to capture the code</li>
            </ol>
          </Col>
          <Col sm={4}> </Col>
        </Row>
      </div>
    );
  }
}

export default LoginPage;
