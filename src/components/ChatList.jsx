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
const getData = (resource_id, callback) => {
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
      console.error("resource_id: ", resource_id);
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
  const chatsEndRef = useRef(null);

  useEffect(() => {
    resource_id = getResourceId(); // 进来先get resource id，默认是开发者账户 P001，所以会有问题。
    console.log("resource_id: ", resource_id);
    if (!resource_id) {
      navigate("/LoginPage");
      //navigate("/OnboardingPage");
      console.log("returning to login page");
      return;
    }
    //const id = getResourceId();
    //setResourceId(id);
    //console.log("resource_id: ", id);

    getData(resource_id, (conversations) => {
      setChats(conversations); // 更新聊天列表，这是 user 层面的 conversations
      console.log("Chat set: ", conversations);
    });
  }, []);

  useEffect(() => {
    if (highlightId != null) {
      setTimeout(() => {
        chatsEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100); // 延迟一点时间，等 DOM 渲染完
    }
  }, [highlightId, chats]);

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
      navigate("/PromptingPage", {
        state: { prompt: "", pmtOption: "yesPrompt" },
      });
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

  // timestamp
  const formatTimestamp = (ts) => {
    if (!ts) return "";
    const date = new Date(ts);
    const now = new Date();

    // 去掉时分秒，只比较年月日
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (dateOnly.getTime() === today.getTime()) {
      // 今天 → 只显示时分
      return (
        "Today " +
        date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    } else if (dateOnly.getTime() === yesterday.getTime()) {
      // 昨天 → 显示 yesterday + 时分
      return (
        "Yesterday " +
        date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    } else {
      // 更早 → 显示日期
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  return (
    <div className="chat-list-container full-height">
      {/* 顶部导航栏 */}
      <nav className="navbar">
        <h2 className="chat-list-title">ObChat!</h2>
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
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between", // 两端对齐
                      alignItems: "center",
                    }}
                  >
                    <div className="chat-title">{chat.object_name}</div>
                    <div className="chat-info-timestamp">
                      {chat.messages && chat.messages.length > 0
                        ? formatTimestamp(
                            chat.messages[chat.messages.length - 1].timestamp
                          )
                        : ""}
                    </div>
                  </div>
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
              paddingTop: "80px",
              color: "#d2d2d2",
            }}
          >
            <AiOutlineComment size={72} />
            <p
              style={{
                color: "#bbb",
                textAlign: "center",
                fontSize: "17px",
              }}
            >
              No chat with object yet.
            </p>
            <p
              style={{
                fontSize: "17px",
                color: "#bbb",
                textAlign: "center",
                paddingTop: "16px",
              }}
            >
              Click the "+" button
              <br /> to create a new chat
              <br />↓
            </p>
          </div>
        )}
        <div ref={chatsEndRef} style={{ paddingBottom: "80px" }} />
        {/* 滚动锚点 */}
      </div>
      <div className="bottom-navbar">
        {/* 固定底部的 New Chat 按钮 */}
        <div className="bottom-nav-item" onClick={() => navigate("/")}>
          <AiOutlineUnorderedList
            size={28}
            color={isList ? "#fe9071" : "#222"}
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
          <AiOutlineUser size={28} color={isUser ? "#fe9071" : "#222"} />
        </div>
      </div>
    </div>
  );
}

//onClick={sendData}
//onClick={() => navigate("/PromptingPage")}
