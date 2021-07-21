import { Container, Row, Col, Form, Spinner } from 'react-bootstrap';
import '../styles/LoginPage.css';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { BsGearWideConnected } from 'react-icons/bs';
import LoginForm from './LoginForm';
import QRCode from 'react-qr-code';
import { useState, useRef, useContext, useEffect } from 'react';
import { getRequest } from '../lib/axios';
import { LoginContext } from './GlobalState';
import { io } from 'socket.io-client';

const ADDRESS = process.env.REACT_APP_BE_URL;
const socket = io(ADDRESS, { transports: ['websocket'] });

function LoginPage({ history }) {
  const [signUp, setSignUp] = useState(false);
  const [validation, setValidation] = useState(true);
  const [Loading, setLoading] = useState(false);
  const { setUser } = useContext(LoginContext);
  const { loggedIn, setLoggedIn, user } = useContext(LoginContext);

  useEffect(() => {
    if (loggedIn) {
      socket.on('loggedIn', (arg) => {
        // with on we're listening for an event
        console.log('we are connected with id: ', socket.id);
      });

      socket.emit('connect-chats', user._id, user.chats);
    }
  }, [loggedIn]);
  const hideModal = () => {
    setSignUp(false);
  };
  const email = useRef(null);
  // .current points to the html Object atm
  // so value === current.value
  const password = useRef(null);

  const base64 = (input) => {
    return new Buffer(input).toString('base64');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (email.current.value !== '' && password.current.value !== '') {
        const res = await getRequest('users/login', {
          headers: {
            Authorization: `Basic ${base64(
              [email.current.value, password.current.value].join(':')
            )}`,
          },
        });
        if (res.status === 200) {
          console.log(res);
          setValidation(true);
          setUser(res.data);
          setLoggedIn(true);
          setLoading(false);

          // console.log(res);
          history.push('/home');
          // saving to gState and redirect to Home and establish connection with socketio
        }
      } else {
        setValidation(false);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      if (error.response.status === 401) {
        socket.emit('offline', user._id);
        setUser({});
        setLoggedIn(false);
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
                Tap{' '}
                <span className="LiBold">
                  Menu <BiDotsVerticalRounded />{' '}
                </span>
                or
                <span className="LiBold">
                  {' '}
                  Settings <BsGearWideConnected />{' '}
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
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <QRCode
                className="img-fluid mx-auto"
                value="hey Buddy! Nothing to Link here atm :/"
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                className="mt-3 mx-auto"
              >
                <input id="connection" type="checkbox" />
                <label htmlFor="connection" className="text-muted">
                  Keep me signed in{' '}
                </label>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <div
        style={{
          width: '100%',
          backgroundColor: 'rgb(249,249,249)',
        }}
      >
        <Container>
          <Form className="py-5 px-5 w-sm-100 w-lg-50 mx-auto">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                isInvalid={!validation}
                type="text"
                ref={email}
                placeholder="Enter your email"
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
            {!validation && (
              <p className="wrongValidation">Wrong Credentials </p>
            )}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <button
                onClick={(e) => submitHandler(e)}
                className={Loading ? 'disabledButton' : 'loginFormSubmitButton'}
                disabled={Loading}
              >
                {!Loading ? 'Log In' : 'Loading'}
                {'  '}
                {Loading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
              </button>
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
