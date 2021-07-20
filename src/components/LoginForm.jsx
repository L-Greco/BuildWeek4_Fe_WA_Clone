import { Button, Modal, Col, Container, Row, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import { BiExit } from "react-icons/bi";
import "../styles/LoginForm.css";

function LoginForm({ showModal, hideModal }) {
  const [show, setShow] = useState(false);
  const [firstNameValidation, setFirstNameValidation] = useState(false);
  const [lastNameValidation, setLastNameValidation] = useState(false);
  const [emailValidation, setEmailValidation] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(false);
  const [user, setUser] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    let id = e.target.id;
    switch (id) {
      case "name":
        setFirstNameValidation(false);
        break;
      case "lastName":
        setLastNameValidation(false);
        break;
      case "email":
        setEmailValidation(false);
        break;
      default:
        setPasswordValidation(false);
    }

    setUser({ ...user, [`${id}`]: e.target.value });
  };

  useEffect(() => {
    setShow(showModal);
  }, [showModal]);

  const handleClose = () => {
    setShow(false);
    hideModal();
  };

  const handleShow = () => setShow(true);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title style={{ color: "rgb(120,190,165)" }}>
            <em>Registration Form</em>
          </Modal.Title>
          <BiExit className="formExit" onClick={() => handleClose()} />
        </Modal.Header>
        <Modal.Body>
          <Container className="mt-3">
            <Row>
              <Col className="mx-auto" sm={8}>
                <Form>
                  <Form.Row>
                    <Col>
                      <Form.Control
                        id="name"
                        isInvalid={firstNameValidation}
                        placeholder="First name"
                        pattern="[A-Za-z]{2,}"
                        title="Type a real name please..."
                        onChange={(e) =>
                          e.target.validity.valid
                            ? handleChange(e)
                            : setFirstNameValidation(true)
                        }
                        required
                      />
                      {}
                    </Col>
                    <Col>
                      <Form.Control
                        id="lastName"
                        isInvalid={lastNameValidation}
                        placeholder="Last name"
                        pattern="[A-Za-z]{3,}"
                        title="Type a real surname please..."
                        onChange={(e) =>
                          e.target.validity.valid
                            ? handleChange(e)
                            : setLastNameValidation(true)
                        }
                        required
                      />
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group className="mt-1" as={Col}>
                      <Form.Control
                        id="email"
                        isInvalid={emailValidation}
                        onChange={(e) =>
                          e.target.validity.valid
                            ? handleChange(e)
                            : setEmailValidation(true)
                        }
                        type="email"
                        placeholder="email"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mt-1" as={Col}>
                      <Form.Control
                        id="password"
                        isInvalid={passwordValidation}
                        onChange={(e) =>
                          e.target.validity.valid
                            ? handleChange(e)
                            : setPasswordValidation(true)
                        }
                        type="password"
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        placeholder="Password"
                        required
                        title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"
                      />
                    </Form.Group>
                  </Form.Row>
                </Form>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="my-auto mx-auto loginFormSubmitButton"
            type="submit"
            onClick={() => console.log(user)}
          >
            Submit
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LoginForm;
