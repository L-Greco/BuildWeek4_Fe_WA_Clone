import { Col, Spinner } from 'react-bootstrap';
import './styles/MainChat.css';
import { FormControl } from 'react-bootstrap';
import 'react-chat-elements/dist/main.css';
import { MessageList, MessageBox } from 'react-chat-elements';
import { LoginContext } from './GlobalState';
import { useContext, useEffect, useRef } from 'react';
import { getRequest, putRequest } from '../lib/axios';
import { useState } from 'react';
import parseISO from 'date-fns/parseISO';
import Compress from 'react-image-file-resizer';
import { dateDiff, gotoBottom } from '../lib/helper';
import { GrEmoji } from 'react-icons/gr';
import { FiPaperclip } from 'react-icons/fi';
import { BsFillMicFill, BsCheck, BsCheckAll } from 'react-icons/bs';
import Picker from 'emoji-picker-react';
import { withRouter } from 'react-router-dom';
import ChatItem from './ChatItem';
import { SocketContext } from '../socket';
import { useCallback } from 'react';

const MainChat = ({ history }) => {
  const [newMessage, setNewMessage] = useState('');
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [emojiClicked, setEmojiClicked] = useState(false);
  const [image, setImage] = useState('');
  const pickerRef = useRef(null);
  const grEmoji = useRef(null);
  const [delivered, setDelivered] = useState(true);
  const [loading, setLoading] = useState(false);
  const {
    selectedChat,
    user,
    messages,
    setMessages,
    isTyping,
    chatPartner,
    setIsTyping,
    setChatPartner,
    setNewMessages,
    setLoggedIn,
    setSocketId,
    setUser,
  } = useContext(LoginContext);
  const socket = useContext(SocketContext);

  const toggleFriend = () => {
    const mainComp = document.getElementById('friend');
    mainComp.style.width = '33%';
  };
  const getChatDetails = useCallback(async () => {
    if (selectedChat) {
      try {
        setLoading(true);
        const res = await getRequest(`chat/${selectedChat}`);
        if (res.status === 200) {
          setLoading(false);
          setMessages(res.data.history);
          gotoBottom('.main-chat-view');
        }
      } catch (error) {
        if (error.response.status === 401) {
          history.push('/');
        }
        setLoading(false);
        console.log(error);
        if (error.response?.status === 401) {
          // socket.emit("offline", user._id);
          setLoggedIn(false);
        } else {
          setLoggedIn(true);
        }
      }
    }
  }, [selectedChat, setLoggedIn, setMessages]);

  const getChats = async () => {
    try {
      const request = await getRequest('chat/me');
      if (request.status === 200) {
        const chats = request.data.map((ch) => {
          return { hidden: false, chat: ch };
        });
        setUser((u) => {
          return { ...u, chats: chats };
        });
      }
    } catch (error) {
      console.log();
      if (error.response?.status === 401) {
        // socket.emit("offline", user._id);
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
    }
  };

  let messageToSend = {
    text: newMessage,
    chatId: selectedChat,
    userId: user._id,
    date: new Date().toISOString(),
    status: 'waiting',
    type: 'text',
  };

  const handleSubmit = () => {
    socket.emit('send-message', messageToSend, selectedChat);
    setDelivered(false);
    setMessages((h) => [...h, messageToSend]);
    setNewMessage('');
    gotoBottom('.main-chat-view');
  };

  useEffect(() => {
    getChatDetails();
  }, [selectedChat]);

  const handleReceivedMessage = useCallback(
    (message) => {
      console.log('handleReceivedMessage');
      if (message.chatId !== selectedChat) {
        setNewMessages((m) => {
          return [...m, message.chatId];
        });
        gotoBottom('.main-chat-view');
      } else {
        setMessages((h) => [...h, message]);
      }
    },
    [selectedChat]
  );

  const handleIsTyping = useCallback(
    (chatId) => {
      if (chatId === selectedChat) {
        setIsTyping(true);
      }
    },
    [selectedChat]
  );
  const handleMessageDelivered = useCallback(
    (date, chatId) => {
      if (chatId === selectedChat) {
        console.log('handleReceivedMessage');
        setMessages((h) =>
          h.map((message) => {
            if (message.date === date) {
              message = { ...message, status: 'received' };
            }
            return message;
          })
        );
      }
    },
    [selectedChat]
  );
  const handledStopTyping = useCallback(
    (chatId) => {
      if (chatId === selectedChat) {
        setIsTyping(false);
      }
    },
    [selectedChat, setIsTyping]
  );
  const handleLogout = useCallback(
    (chatId) => {
      if (chatId !== selectedChat) {
        setChatPartner((cp) => {
          return { ...cp, online: false, lastSeen: new Date().toISOString() };
        });
      }
    },
    [selectedChat]
  );

  const handleLogin = useCallback(
    (chatId) => {
      if (chatId === selectedChat) {
        setChatPartner((cp) => {
          return { ...cp, online: true };
        });
      }
    },
    [selectedChat]
  );
  const handleNewChat = useCallback(
    (chatId) => {
      console.log('chat Updated');
      getChats();
    },
    [selectedChat]
  );

  const handleDeleteMessage = useCallback(
    (msgId, chatId) => {
      if (chatId === selectedChat) {
        setMessages((h) => h.filter((msg) => msg._id !== msgId));
      }
    },
    [selectedChat]
  );
  const handleConnect = useCallback(() => {
    console.log('socketId', socket.id);
    setUser((u) => {
      return { ...u, profile: { ...u.profile, socketId: socket.id } };
    });
  }, []);

  useEffect(() => {
    socket.on('receive-message', handleReceivedMessage);
    socket.on('is-typing', handleIsTyping);
    socket.on('message-delivered', handleMessageDelivered);
    socket.on('stopped-typing', handledStopTyping);
    socket.on('logged-out', handleLogout);
    socket.on('logged-in', handleLogin);
    socket.on('delete-message', handleDeleteMessage);
  }, [selectedChat]);
  // Emoji Logic from here

  useEffect(() => {
    socket.on('connect', handleConnect);
    socket.on('new-chat', handleNewChat);
  });

  // Setting Emoji to messsage
  const onEmojiClick = (event, emojiObject) => {
    setNewMessage(newMessage + emojiObject.emoji);
  };

  const toggleEmoji = () => {
    emojiClicked ? setEmojiClicked(false) : setEmojiClicked(true);
  };
  // pickerRef is the div element that wraps the emoji's box

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Close emoji if clicked outside
       */
      function handleClickOutside(event) {
        if (
          ref.current &&
          !ref.current.contains(event.target) &&
          !grEmoji.current.contains(event.target)
        ) {
          setEmojiClicked(false);
        }
      }

      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  }
  useOutsideAlerter(pickerRef);

  // image Input Logic

  const imageInput = () => {
    let input = document.getElementById('imageInput');
    input.click();
  };
  const upLoadImage = async () => {
    setLoading(true);
    var formdata = new FormData();
    formdata.append('img', image);

    try {
      const res = await putRequest('chat/upload', formdata);
      if (res.status === 200) {
        setLoading(false);
        console.log(res);
      } else {
        console.log(res);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      alert(error);
      console.log(error);
    }
  };
  // image to uri
  const imageToUri = async () => {
    let input = document.getElementById('imageInput');
    if (input.files[0]) {
      const file = input.files[0];
      const type = file.type.replace('image/', '');
      Compress.imageFileResizer(
        file, // the file from input
        300, // width
        300, // height
        type, // compress format WEBP, JPEG, PNG
        20, // quality
        0, // rotation
        (uri) => {
          setImage(uri);
          // You upload logic goes here
          // console.log(uri);
          upLoadImage();
          messageToSend = { ...messageToSend, type: 'photo', image: uri };
          setMessages((h) => [...h, messageToSend]);
          // handleSubmit();
        },
        'base64' // blob or base64 default base64
      );

      // setImage(dataUrl);
    }
  };

  return (
    <>
      <Col md={12}>
        <div className="chat-header d-flex flex-row">
          <div className="d-flex justify-content-center align-items-center">
            <img
              src={chatPartner.avatar}
              alt="avatar"
              className="avatar-img-style"
              onClick={() => toggleFriend()}
            />
            <div
              className="d-flex flex-column ms-2"
              style={{ marginTop: '10px' }}
            >
              <span>{chatPartner.name}</span>
              <span className="under-chat-partner">
                {isTyping
                  ? '...is typing'
                  : chatPartner.online
                  ? 'online'
                  : chatPartner.lastSeen === 'number'
                  ? 'last seen ' + dateDiff(chatPartner.lastSeen, Date.now())
                  : 'last seen 01.01.01'}
              </span>
            </div>
          </div>
        </div>
        <div className="main-chat-view">
          {loading && (
            <Spinner
              as="span"
              animation="border"
              size="lg"
              role="status"
              aria-hidden="true"
              // className="mx-auto"
              // variant="success"
              style={{
                position: 'absolute',
                top: '10%',
                left: '66%',
                color: 'rgb(30,190,165)',
              }}
            />
          )}
          {messages &&
            messages.map((message) =>
              message.type === 'text' ? (
                <MessageBox
                  position={user._id === message.userId ? 'right' : 'left'}
                  date={message.date ? parseISO(message.date) : 'nothing'}
                  text={message.text}
                  type={message.type}
                  removeButton={true}
                  onRemoveMessageClick={() => {
                    console.log('delete');
                    socket.emit('delete-message', message._id, message.chatId);
                  }}
                  status={
                    message.status === 'received' ? 'received' : 'waiting'
                  }
                />
              ) : (
                <MessageBox
                  position={user._id === message.userId ? 'right' : 'left'}
                  date={message.date ? parseISO(message.date) : 'nothing'}
                  type="photo"
                  removeButton={true}
                  onRemoveMessageClick={() => {
                    console.log('delete');
                    socket.emit('delete-message', message._id, message.chatId);
                  }}
                  data={{
                    uri: message.image,
                    status: {
                      click: true,
                      loading: 1,
                    },
                  }}
                  text={message.text ? message.text : ''}
                  status={
                    message.status === 'received' ? 'received' : 'waiting'
                  }
                />
              )
            )}
          {emojiClicked && (
            <div ref={pickerRef}>
              <Picker
                pickerStyle={{
                  width: '30%',
                  height: '30%',
                  position: 'fixed',
                  bottom: '5rem',
                }}
                onEmojiClick={onEmojiClick}
              />
            </div>
          )}
          <div className="searching-div-main-chat">
            <FiPaperclip
              onClick={() => imageInput()}
              className="mx-1 paperClip"
            />
            <div ref={grEmoji}>
              <GrEmoji onClick={() => toggleEmoji()} className="emoji mx-1" />
            </div>

            <FormControl
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="message-input-main-chat"
              onKeyDown={(e) => {
                socket.emit('im-typing', selectedChat);
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
              onKeyUp={(e) => {
                socket.emit('i-stopped-typing', selectedChat);
              }}
            />
            <span>
              <BsFillMicFill className="voice-message-icon" />
            </span>
          </div>
        </div>
      </Col>
      <input
        style={{ display: 'none' }}
        id="imageInput"
        type={'file'}
        onChange={() => imageToUri()}
      />
    </>
  );
};
export default withRouter(MainChat);
