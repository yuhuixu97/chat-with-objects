import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import $ from "jquery";
import {
  userDataModel,
  addConversation,
  initializeUser,
} from "../userDataModel";
import { getResourceId, clearResourceId } from "../resource"; // 导入设置方法

import { GoPlus } from "react-icons/go";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { AiOutlineUser } from "react-icons/ai";
import { AiFillEdit } from "react-icons/ai";
import { AiOutlineLogout } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { MdChevronRight } from "react-icons/md";

let resource_id = "";

export default function MyProfilePage() {
  const [userAvatar, setUserAvatar] = useState(null);
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [userConversations, setUserConversations] = useState([]); // 用户的所有对话数据
  const [userConversationsLength, setUserConversationsLength] = useState("");
  const [emoji, setEmoji] = useState("");

  const isList = location.pathname === "/";
  const isUser = location.pathname === "/MyProfilePage";

  useEffect(() => {
    resource_id = getResourceId(); // 页面加载时获取 resource_id
    console.log("Resource_id set: ", resource_id);
    if (!resource_id) {
      navigate("/LoginPage");
      //navigate("/OnboardingPage");
      return;
    }
    // 页面加载时执行
    getUserData();
    // emoji
    const emojiList = [
      "😊",
      "🌟",
      "🌻",
      "😎",
      "🔥",
      "🍪",
      "🎉",
      "🍎",
      "✨",
      "💡",
      "🌸",
      "☀️",
      "🎈",
      "🎶",
      "🐱",
      "🍵",
      "🤩",
      "🥳",
    ];
    const randomIndex = Math.floor(Math.random() * emojiList.length);
    setEmoji(emojiList[randomIndex]);
  }, []); // 空依赖数组表示只在组件首次挂载时运行一次

  const getUserData = (callback) => {
    $.ajax({
      url: "https://data.id.tue.nl/datasets/entity/14395/item/",
      headers: {
        api_token:
          "OVdTVGtib1plbEY2aUFGcDNpWkduK2V6R1A2NEd1endjdFkvWTc0WFJzQT0=",
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
          console.log("userDataModel: ", userDataModel);
          setUserConversations(data.conversations);
          console.log("userConversations: ", data.conversations);
          setUserConversationsLength(data.conversations.length);
          console.log("userConversations length: ", data.conversations.length);
          //callback(userDataModel.conversations);
        }
        setUserAvatar(data.user_avatar_url);
        console.log("userAvatar fetched: ", data.user_avatar_url);
      },
      error: function (e) {
        console.log("Error fetching data:", e);
      },
    });
  };

  // 统计有新消息的活跃天数
  const activeDaysCount = React.useMemo(() => {
    const daysSet = new Set();
    userConversations.forEach((conv) => {
      conv.messages.forEach((msg) => {
        const date = new Date(msg.timestamp);
        // 只保留日期部分，忽略时间
        const dayString = date.toLocaleDateString("en-CA"); // 格式 yyyy-mm-dd
        daysSet.add(dayString);
      });
    });
    console.log("daysSet: ", daysSet);
    return daysSet.size;
  }, [userConversations]);

  // 点击add chat button后的动画
  const handleButtonClick = () => {
    setClicked(true); // 添加动画 class
    setTimeout(() => {
      //navigate("/SelectingPage");
      navigate("/PromptingPage", {
        state: { prompt: "", pmtOption: "yesPrompt" },
      });
    }, 450); // 跳转延迟，和动画匹配
  };

  const handleLogout = () => {
    // 这里写退出逻辑，比如清除 token 或跳转登录页
    clearResourceId();
    //navigate("/LoginPage");
    //window.location.hash = "/OnboardingPage";
    window.location.hash = "/LoginPage";
    window.location.reload();
    console.log("User logged out");
  };

  /*const handleOnboard = () => {
    localStorage.setItem("hasSeenOnboarding", "false"); // 重置开屏页为没看过
    navigate("/OnboardingPage"); // 跳转到登录页
  };*/

  return (
    <div className="chat-list-container full-height">
      {/* 顶部导航栏 */}
      <nav className="navbar">
        <h2 className="my-profile-title" style={{ color: "#222222" }}>
          My space
        </h2>
      </nav>

      {/* 聊天列表 */}
      <div className="my-profile-page">
        <div className="my-profile-page-banner">
          <div className="my-profile-page-banner2">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                className="my-profile-photo"
                style={{ padding: "8px" }}
                onClick={() => navigate("/AvatarSelectionPage")}
              >
                <img src={userAvatar} alt="Captured" />
              </div>
              {/*
              <button
                className="my-profile-btn-avatar"
                onClick={() => navigate("/AvatarSelectionPage")}
              >
                Change avatar
              </button>*/}
            </div>
            {/*<div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "24px",
                width: "168px",
              }}
            >
              <p
                style={{
                  fontWeight: "500",
                  marginTop: "0",
                  marginBottom: "8px",
                  fontSize: "17px",
                  color: "#222222",
                }}
              >
                Chat Milestones {emoji}
              </p>
              <p
                className="criteria"
                style={{
                  color: userConversationsLength >= 8 ? "#10c04aff" : "#222222",
                }}
              >
                Objects: {userConversationsLength}
                <span style={{ color: "#bbbbbb" }}> /8</span>
              </p>
              <p
                className="criteria"
                style={{
                  color: activeDaysCount >= 24 ? "#10c04aff" : "#222222",
                }}
              >
                Days: {activeDaysCount}
                <span style={{ color: "#bbbbbb" }}> /24</span>
              </p>
            </div>*/}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "304px",
            marginTop: "4px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: "4px",
              marginBottom: "4px",
            }}
          >
            <p
              className="criteria"
              style={{
                color: userConversationsLength >= 6 ? "#10c04aff" : "#222222",
                width: "50%",
                display: "flex",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: "700",
              }}
            >
              {userConversationsLength}&nbsp;
              <span style={{ color: "#bbbbbb", fontWeight: "normal" }}>
                {" "}
                /6
              </span>
            </p>
            <p
              className="criteria"
              style={{
                color: activeDaysCount >= 14 ? "#10c04aff" : "#222222",
                width: "50%",
                display: "flex",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: "700",
              }}
            >
              {activeDaysCount}&nbsp;
              <span style={{ color: "#bbbbbb", fontWeight: "normal" }}>
                {" "}
                /14
              </span>
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <p
              className="criteria"
              style={{
                color: "#888888",
                width: "50%",
                fontSize: "14px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              Objects
            </p>
            <p
              className="criteria"
              style={{
                color: "#888888",
                width: "50%",
                fontSize: "14px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              Days
            </p>
          </div>
        </div>

        <button
          className="my-profile-btn-note"
          onClick={() =>
            navigate("/NotePage", { state: { resource_id: resource_id } })
          }
          style={{ fontSize: "18px" }}
        >
          <AiFillEdit size={22} style={{ marginRight: "8px" }} />
          <span style={{ marginLeft: "12px" }}>Write note</span>
          <MdChevronRight
            size={22}
            style={{ color: "#cbcbcbff", marginLeft: "auto" }}
          />
        </button>
        <button
          className="my-profile-btn-logout"
          onClick={() => setShowConfirm(true)}
          style={{ fontSize: "18px" }}
        >
          <MdLogout
            size={22}
            style={{ marginLeft: "2px", marginRight: "6px" }}
          />
          <span style={{ marginLeft: "12px" }}>Log out</span>
        </button>
      </div>

      {/* 确认弹窗 */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <p
              style={{
                marginTop: "8px",
                marginBottom: "24px",
                color: "#222222",
              }}
            >
              Are you sure to log out?
            </p>
            <div className="modal-buttons">
              <button onClick={handleLogout}>Log out</button>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  color: "#222",
                  WebkitAppearance: "none",
                  appearance: "none",
                  textDecoration: "none",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
