import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, NavigationType } from "react-router-dom";
import $ from "jquery";
import covDataModel from "../covDataModel";
import {
  userDataModel,
  addConversation,
  initializeUser,
} from "../userDataModel";
import { getResourceId } from "../resource"; // 导入设置方法

import matchingTable from "../matchingTable";
// icons
import { GoPlus } from "react-icons/go";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineComment } from "react-icons/ai";

// update a value in the datamodel
//const updatedData = { ...userDataModel, conversation_id: "hi" };

let resource_id = "";
const api_key = "OVdTVGtib1plbEY2aUFGcDNpWkduK2V6R1A2NEd1endjdFkvWTc0WFJzQT0=";

const sendData = () => {
  $.ajax({
    url: "https://data.id.tue.nl/datasets/entity/14395/item/",
    headers: {
      api_token: api_key,
      resource_id: resource_id,
      token: "token_for_identifier",
    },
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify({ updatedData }),
    //data: JSON.stringify({ parameter1: matchingTable }), // 这是专门用来更新matchingTable的，不常用
    success: function (data) {
      console.log(data);
    },
    error: function (e) {
      console.log(e);
    },
  });
};

// fetch conversations
const getData = (callback) => {
  $.ajax({
    url: "https://data.id.tue.nl/datasets/entity/14395/item/",
    headers: {
      api_token: api_key,
      resource_id: resource_id,
      token: "token_for_identifier",
    },
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      console.log("Fetched user data:", data);
      // 假设 API 返回的数据格式如下：
      // { conversations: [{ conversation_id: "123", object_name: "Cup", avatar_url: "..." }, {...}] }
      if (data.conversations) {
        userDataModel.conversations = data.conversations;
        callback(userDataModel.conversations);
        //console.log("userDataModel: ", userDataModel);
      }
    },
    error: function (e) {
      console.error("Error fetching data:", e);
    },
  });
};

//userDataModel.conversations;

export default function ChatList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [chats, setChats] = useState([...userDataModel.conversations]);
  const [clicked, setClicked] = useState(false);
  const highlightIdFromNav = location.state?.highlightId;
  const [highlightId, setHighlightId] = useState(highlightIdFromNav);
  //const [resource_id, setResourceId] = useState(""); // 设置resource_id

  useEffect(() => {
    resource_id = getResourceId();
    console.log("resource_id: ", resource_id);
    //const id = getResourceId();
    //setResourceId(id);
    //console.log("resource_id: ", id);

    getData((conversations) => {
      setChats(conversations); // 更新聊天列表，这是 user 层面的 conversations
      console.log("Chat set: ", conversations);
    });
  }, []);

  useEffect(() => {
    // 页面初始加载后清空 location.state
    if (highlightIdFromNav) {
      window.history.replaceState({}, document.title);
    }
  }, [highlightIdFromNav]);

  const isList = location.pathname === "/";
  const isUser = location.pathname === "/MyProfilePage";

  // 点击add chat button后的动画
  const handleButtonClick = () => {
    setClicked(true); // 添加动画 class
    //sendData(); // 这是专门用来更新matchingTable的，不常用
    setTimeout(() => {
      //navigate("/SelectingPage");
      navigate("/SelectingPage");
    }, 450); // 跳转延迟，和动画匹配
  };

  const handleChatClick = (chat) => {
    navigate(`/chat/${chat.conversation_id}`, {
      state: {
        objectName: chat.object_name,
        imageUrl: chat.image_url,
        resource_id: resource_id, // 将resource_id传入chatPage
      },
    });
    setHighlightId(null); // 清除高亮
    console.log("Chat clicked: ", chat.conversation_id);
    console.log("User avatar clicked: ", chat.user_avatar_url);
  };

  return (
    <div className="chat-list-container full-height">
      {/* 顶部导航栏 */}
      <nav className="navbar">
        <h2 className="chat-list-title">ObChat</h2>
      </nav>

      {/* 聊天列表 */}
      <div className="chat-list">
        {chats.length > 0 ? (
          chats.map((chat) => {
            const isHighlighted = chat.conversation_id === highlightId;
            return (
              <div
                key={chat.conversation_id}
                className={`chat-card ${isHighlighted ? "highlighted" : ""}`}
                onClick={() => handleChatClick(chat)}
              >
                <div className="chat-avatar">
                  {chat.avatar_url ? (
                    <img
                      src={chat.avatar_url}
                      alt={chat.object_name}
                      className="avatar-img"
                    />
                  ) : (
                    chat.object_name.charAt(0)
                  )}
                </div>
                <div className="chat-info">
                  <div className="chat-title">{chat.object_name}</div>
                  <div className="chat-preview">
                    {chat.messages && chat.messages.length > 0
                      ? chat.messages[chat.messages.length - 1].content
                      : ""}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center", // 横向居中
              paddingTop: "128px",
            }}
          >
            <AiOutlineComment size={72} style={{ opacity: 0.2 }} />
            <p style={{ opacity: 0.35, textAlign: "center" }}>
              No chat with object yet.
            </p>
            <p
              style={{
                fontSize: "14px",
                opacity: 0.35,
                textAlign: "center",
                paddingTop: "144px",
              }}
            >
              Click the "+" button
              <br /> to create a new chat
              <br />↓
            </p>
          </div>
        )}
      </div>
      <div className="bottom-navbar">
        {/* 固定底部的 New Chat 按钮 */}
        <div className="bottom-nav-item" onClick={() => navigate("/")}>
          <AiOutlineUnorderedList
            size={24}
            color={isList ? "orange" : "black"}
          />
        </div>
        <div className="bottom-nav-item">
          <button
            className={`add-chat-btn ${clicked ? "clicked" : ""}`}
            onClick={handleButtonClick}
          >
            <GoPlus size={32} />
          </button>
        </div>
        <div
          className="bottom-nav-item"
          onClick={() => navigate("/MyProfilePage")}
        >
          <AiOutlineUser size={24} color={isUser ? "orange" : "black"} />
        </div>
      </div>
    </div>
  );
}

//onClick={sendData}
//onClick={() => navigate("/PromptingPage")}
