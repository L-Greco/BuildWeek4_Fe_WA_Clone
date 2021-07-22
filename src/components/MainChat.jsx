import { Col, Form, Row } from "react-bootstrap";
import "./styles/MainChat.css";
import { FormControl } from "react-bootstrap";
import "react-chat-elements/dist/main.css";
import { MessageList } from "react-chat-elements";
import { LoginContext } from "./GlobalState";
import { useContext, useEffect, useState, useRef } from "react";
import { getRequest } from "../lib/axios";
import parseISO from "date-fns/parseISO";
import { socket } from "../App";
import { gotoBottom, scrollToTop } from "../lib/helper";
import Picker from "emoji-picker-react";
// Icons
import { GrEmoji } from "react-icons/gr";
import { FiPaperclip } from "react-icons/fi";
import { AiOutlineSearch } from "react-icons/ai";
import { BsFillMicFill } from "react-icons/bs";

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
  } = useContext(LoginContext);

  const getChatDetails = async () => {
    if (selectedChat) {
      try {
        const res = await getRequest(`chat/${selectedChat}`);
        if ((res.status = 200)) {
          setMessages(res.data.history);
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
    date: new Date(),
  };

  const handleSubmit = () => {
    socket.emit("send-message", messageToSend, selectedChat);
    setMessages((h) => [...h, messageToSend]);
    gotoBottom(".main-chat-view");
    setNewMessage("");
  };

  useEffect(() => {
    getChatDetails();
    gotoBottom(".main-chat-view");
    scrollToTop();
  }, [selectedChat]);

  useEffect(() => {
    socket.on("receive-message", (message) => {
      setMessages((h) => [...h, message]);
      gotoBottom(".main-chat-view");
    });
    socket.on("is-typing", () => {
      setIsTyping(true);
      console.log("the person is typing...");
    });
    socket.on("stopped-typing", () => {
      setIsTyping(false);
      console.log("the person is typing...");
    });
  }, [setMessages]);

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
        <div className="chat-header d-flex flex-row">
          {" "}
          <img
            src={chatPartner.avatar}
            alt="avatar"
            className="avatar-img-style"
          />
          <div className="d-flex flex-column">
            <span>{chatPartner.name}</span>
            <span>
              {isTyping
                ? "...is typing"
                : chatPartner.online
                ? "online"
                : "last seen"}
            </span>
          </div>
        </div>
        <div className="main-chat-view">
          <MessageList
            id="message-list"
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
          <div className="searching-div-main-chat">
            <div ref={grEmoji}>
              <GrEmoji onClick={() => toggleEmoji()} className="emoji" />
            </div>
            <FormControl
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="message-input-main-chat"
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
              <BsFillMicFill className="voice-message-icon" />
            </span>
          </div>
        </div>
      </Col>
    </>
  );
};
export default MainChat;
