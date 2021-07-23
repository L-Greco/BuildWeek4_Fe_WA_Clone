import { Col } from "react-bootstrap";
import "./styles/MainChat.css";
import { FormControl } from "react-bootstrap";
import "react-chat-elements/dist/main.css";
import { MessageList, MessageBox } from "react-chat-elements";
import { LoginContext } from "./GlobalState";
import { useContext, useEffect, useRef } from "react";
import { getRequest } from "../lib/axios";
import { useState } from "react";
import parseISO from "date-fns/parseISO";
import Compress from "react-image-file-resizer";
import { dateDiff, gotoBottom } from "../lib/helper";
import { GrEmoji } from "react-icons/gr";
import { FiPaperclip } from "react-icons/fi";
import { BsFillMicFill, BsCheck, BsCheckAll } from "react-icons/bs";
import Picker from "emoji-picker-react";
import ChatItem from "./ChatItem";
import { SocketContext } from "../socket";
import { useCallback } from "react";

const MainChat = () => {
  const [newMessage, setNewMessage] = useState("");
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [emojiClicked, setEmojiClicked] = useState(false);
  const [image, setImage] = useState("");
  const [delivered, setDelivered] = useState(true);
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
  } = useContext(LoginContext);
  const socket = useContext(SocketContext);

  const getChatDetails = useCallback(async () => {
    if (selectedChat) {
      try {
        const res = await getRequest(`chat/${selectedChat}`);
        if ((res.status = 200)) {
          setMessages(res.data.history);
          gotoBottom(".main-chat-view");
        }
      } catch (error) {
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

  const messageToSend = {
    text: newMessage,
    chatId: selectedChat,
    userId: user._id,
    date: new Date().toISOString(),
  };

  const handleSubmit = () => {
    socket.emit("send-message", messageToSend, selectedChat);
    setDelivered(false);
    setMessages((h) => [...h, messageToSend]);
    setNewMessage("");
    gotoBottom(".main-chat-view");
  };

  useEffect(() => {
    getChatDetails();
  }, [selectedChat, getChatDetails]);

  const handleReceivedMessage = useCallback(
    (message) => {
      if (message.chatId !== selectedChat) {
        setNewMessages((m) => {
          return [...m, message.chatId];
        });
      }
    },
    [selectedChat, setNewMessages]
  );

  const handleIsTyping = useCallback(
    (chatId) => {
      if (chatId === selectedChat) {
        setIsTyping(true);
      }
    },
    [selectedChat, setIsTyping]
  );
  const handleMessageDelivered = useCallback((check) => {
    setDelivered(true);
  }, []);
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
    [selectedChat, setChatPartner]
  );

  const handleLogin = useCallback(
    (chatId) => {
      if (chatId === selectedChat) {
        setChatPartner((cp) => {
          return { ...cp, online: true };
        });
      }
    },
    [selectedChat, setChatPartner]
  );

  useEffect(() => {
    socket.on("receive-message", handleReceivedMessage);
    socket.on("is-typing", handleIsTyping);
    socket.on("message-delivered", handleMessageDelivered);
    socket.on("stopped-typing", handledStopTyping);
    socket.on("logged-out", handleLogout);
    socket.on("logged-in", handleLogin);
  }, [selectedChat]);

  // Emoji Logic from here

  // Setting Emoji to messsage
  const onEmojiClick = (event, emojiObject) => {
    setNewMessage(newMessage + emojiObject.emoji);
  };

  const toggleEmoji = () => {
    emojiClicked ? setEmojiClicked(false) : setEmojiClicked(true);
  };
  // pickerRef is the div element that wraps the emoji's box
  const pickerRef = useRef(null);
  const grEmoji = useRef(null);

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
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  useOutsideAlerter(pickerRef);

  // image Input Logic

  const imageInput = () => {
    let input = document.getElementById("imageInput");
    input.click();
  };
  // image to uri
  const imageToUri = async () => {
    let input = document.getElementById("imageInput");
    if (input.files[0]) {
      const file = input.files[0];
      const type = file.type.replace("image/", "");
      // console.log(type);
      // let dataUrl = await new Promise((resolve) => {
      //   let reader = new FileReader();
      //   reader.onload = () => resolve(reader.result);
      //   reader.readAsDataURL(file);
      // });
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
          console.log(uri);
        },
        "base64" // blob or base64 default base64
      );
      // setImage(dataUrl);
    }
  };

  return (
    <>
      <Col md={12}>
        <div className='chat-header d-flex flex-row'>
          <div className='d-flex justify-content-center align-items-center'>
            <img
              src={chatPartner.avatar}
              alt='avatar'
              className='avatar-img-style'
            />
            <div
              className='d-flex flex-column ms-2'
              style={{ marginTop: "10px" }}>
              <span>{chatPartner.name}</span>
              <span>
                {isTyping
                  ? "...is typing"
                  : chatPartner.online
                  ? "online"
                  : "last seen " + dateDiff(chatPartner.lastSeen, Date.now())}
              </span>
            </div>
          </div>
        </div>
        <div className='main-chat-view'>
          {/* workin MessageList */}
          {/* {messages &&
              messages
                .map((message) => {
                  return {
                    ...message,
                    position: user._id === message.userId ? "right" : "left",
                    date: message.date ? parseISO(message.date) : "nothing",
                  };
                })
                .reverse()} */}
          {messages &&
            messages.map((message) => {
              return (
                <MessageBox
                  id={message._id}
                  position={user._id === message.userId ? "right" : "left"}
                  type={message.type}
                  text={message.text}
                  removeButton={true}
                  onRemoveMessageClick={() => console.log("remove")}
                  onContextMenu={() => console.log("context")}
                  date={message.date ? parseISO(message.date) : "nothing"}
                  status={delivered ? "received" : "waiting"}
                />
              );
            })}
          {/* <MessageList
            className='background-message'
            id='message-list'
            lockable={true}
            dataSource={
              messages &&
              messages
                .map((message) => {
                  return {
                    ...message,
                    position: user._id === message.userId ? "right" : "left",
                    date: message.date ? parseISO(message.date) : "nothing",
                  };
                })
                .reverse()
            }
          /> */}
          {/* Testing MessageList */}
          {/* // {image && (
          //   <MessageBox
          //     id="message-list"
          //     position={`left`}
          //     type={`photo`}
          //     data={{
          //       uri: image,
          //       // uri: "https://cdn.pixabay.com/photo/2015/06/19/23/45/flowers-815412_960_720.jpg",
          //       status: {
          //         click: true,
          //         loading: 1,
          //       },
          //     }}
          //   />
          // )} */}
          {emojiClicked && (
            <div ref={pickerRef}>
              <Picker
                pickerStyle={{
                  width: "30%",
                  height: "30%",
                  position: "fixed",
                  bottom: "5rem",
                }}
                onEmojiClick={onEmojiClick}
              />
            </div>
          )}
          <div className='searching-div-main-chat'>
            <FiPaperclip
              onClick={() => imageInput()}
              className='mx-1 paperClip'
            />
            <div ref={grEmoji}>
              <GrEmoji onClick={() => toggleEmoji()} className='emoji mx-1' />
            </div>

            <FormControl
              type='text'
              placeholder='Type your message...'
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className='message-input-main-chat'
              onKeyDown={(e) => {
                socket.emit("im-typing", selectedChat);
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              onKeyUp={(e) => {
                socket.emit("i-stopped-typing", selectedChat);
              }}
            />
            <span>
              <BsFillMicFill className='voice-message-icon' />
            </span>
          </div>
        </div>
      </Col>
      <input
        style={{ display: "none" }}
        id='imageInput'
        type={"file"}
        onChange={() => imageToUri()}
      />
    </>
  );
};
export default MainChat;
