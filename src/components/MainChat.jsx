import { Col } from "react-bootstrap";
import "./styles/MainChat.css";
import { AiOutlineSearch } from "react-icons/ai";
import { BsFillMicFill } from "react-icons/bs";
import { FormControl } from "react-bootstrap";
import "react-chat-elements/dist/main.css";
import { MessageList } from "react-chat-elements";
import { LoginContext } from "./GlobalState";
import { useContext, useEffect } from "react";
import { getRequest } from "../lib/axios";
import { useState } from "react";
import parseISO from "date-fns/parseISO";
import { socket } from "../App";
import { dateDiff, gotoBottom, scrollToTop } from "../lib/helper";
import { GrEmoji } from "react-icons/gr";
import Picker from "emoji-picker-react";
import ChatItem from "./ChatItem";

const MainChat = () => {
  const [newMessage, setNewMessage] = useState("");
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [emojiClicked, setEmojiClicked] = useState(false);
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
  } = useContext(LoginContext);

  const getChatDetails = async () => {
    if (selectedChat) {
      try {
        const res = await getRequest(`chat/${selectedChat}`);
        if ((res.status = 200)) {
          setMessages(res.data.history);
          gotoBottom(".main-chat-view");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const messageToSend = {
    text: newMessage,
    chatId: selectedChat,
    userId: user._id,
    date: new Date().toISOString(),
  };

  const handleSubmit = () => {
    socket.emit("send-message", messageToSend, selectedChat);
    setMessages((h) => [...h, messageToSend]);
    setNewMessage("");
    gotoBottom(".main-chat-view");
  };

  useEffect(() => {
    getChatDetails();
  }, [selectedChat]);

  useEffect(() => {
    socket.on("receive-message", (message) => {
      if (message.chatId !== selectedChat) {
        setNewMessages((m) => {
          return [...m, message.chatId];
        });
      } else {
        console.log(message);
        setMessages((h) => [...h, message]);
      }
    });
    socket.on("message-delivered", (check) => {
      console.log("message-delivered", check);
    });
    socket.on("is-typing", (chatId) => {
      if (chatId === selectedChat) {
        setIsTyping(true);
      }
    });
    socket.on("stopped-typing", (chatId) => {
      if (chatId === selectedChat) {
        setIsTyping(false);
      }
    });
    socket.on("logged-out", (chatId) => {
      if (chatId !== selectedChat) {
        setChatPartner((cp) => {
          return { ...cp, online: false, lastSeen: new Date().toISOString() };
        });
      }
    });
    socket.on("logged-in", (chatId) => {
      if (chatId === selectedChat) {
        setChatPartner((cp) => {
          return { ...cp, online: true };
        });
      }
    });
  }, []);

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
          <ChatItem
            avatar={"https://facebook.github.io/react/img/logo.svg"}
            alt={"Reactjs"}
            title={"Facebook"}
            subtitle={"What are you doing?"}
            date={new Date()}
            unread={0}
          />
          <MessageList
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
          />

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
            <div ref={grEmoji}>
              <GrEmoji onClick={() => toggleEmoji()} className='emoji' />
            </div>
            <span>
              <AiOutlineSearch className='magnify-glass-main-chat' />
            </span>{" "}
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
    </>
  );
};
export default MainChat;
