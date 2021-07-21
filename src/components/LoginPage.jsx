import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "../styles/LoginPage.css";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsGearWideConnected } from "react-icons/bs";
import LoginForm from "./LoginForm";
import QRCode from "react-qr-code";
import { useState, useRef, useContext } from "react";
import { getRequest } from "../lib/axios";
import { LoginContext } from "./GlobalState";

function LoginPage({ history }) {
  const [signUp, setSignUp] = useState(false);
  const [validation, setValidation] = useState(true);
  const { setUser } = useContext(LoginContext);

  const hideModal = () => {
    setSignUp(false);
  };
  const userName = useRef(null);
  // .current points to the html Object atm
  // so value === current.value
  const password = useRef(null);

  const base64 = (input) => {
    return new Buffer(input).toString("base64");
  };

  const submitHandler = async () => {
    try {
      if (userName.current.value !== null && password.current.value !== null) {
        const res = await getRequest("users/login", {
          headers: {
            Authorization: `Basic ${base64(
              [userName.current.value, password.current.value].join(":")
            )}`,
          },
        });
        if (res.status === 200) {
          setValidation(true);
          setUser(res.data);
          console.log(res);
          history.push("/home");
          // saving to gState and redirect to Home
        }
      }
    } catch (error) {
      if (error.response.status === 401) {
        setValidation(false);
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <div className="mainDiv">
      <Container>
        <Row className="mt-5 ml-5 d-flex">
          <Col sm={12} md={8} className="px-5">
            <div className="LoginTitle ">To use WhatsApp on your computer:</div>
            <ol>
              <li className="LoginLi">Open WhatsApp on your phone</li>
              <li className="LoginLi mt-3">
                Tap{" "}
                <span className="LiBold">
                  Menu <BiDotsVerticalRounded />{" "}
                </span>
                or
                <span className="LiBold">
                  {" "}
                  Settings <BsGearWideConnected />{" "}
                </span>
                and select
                <span className="LiBold"> Linked Devices</span>
              </li>
              <li className="LoginLi mt-3 mb-5">
                Point your phone to this screen to capture the code
              </li>
              <a
                href="https://faq.whatsapp.com/web/download-and-installation/how-to-log-in-or-out?lang=en"
                target="_blank"
                className="GreenLink"
                rel="noreferrer"
              >
                Need help to get started?
              </a>
            </ol>
          </Col>
          <Col className="mb-2" sm={12} md={4}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <QRCode
                className="img-fluid mx-auto"
                value="hey Buddy! Nothing to Link here atm :/"
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
                className="mt-3 mx-auto"
              >
                <input id="connection" type="checkbox" />
                <label htmlFor="connection" className="text-muted">
                  Keep me signed in{" "}
                </label>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <div
        style={{
          width: "100%",
          backgroundColor: "rgb(249,249,249)",
        }}
      >
        <Container>
          <Form className="py-5 px-5 w-sm-100 w-lg-50 mx-auto">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control
                isInvalid={!validation}
                type="text"
                ref={userName}
                placeholder="Enter your Username"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                isInvalid={!validation}
                type="password"
                ref={password}
                placeholder="Password"
              />
            </Form.Group>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button onClick={() => submitHandler()} variant="primary">
                Log In
              </Button>
              <div
                className="GreenLink ml-2 ml-md-0"
                onClick={() => setSignUp(true)}
              >
                Don't have an account ? Sign Up!
              </div>
            </div>
          </Form>
        </Container>
      </div>
      <LoginForm showModal={signUp} hideModal={hideModal} />
    </div>
  );
}

export default LoginPage;
