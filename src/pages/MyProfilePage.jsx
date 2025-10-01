import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import $ from "jquery";
import { parse, isValid, format } from "date-fns";
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

  /*
  // 工具函数：解析 timestamp
  const parseTimestamp = (ts) => {
    let date = new Date(ts);
    // 如果 new Date 失败，尝试解析 "30.9.2025, 19:22:22"
    if (isNaN(date.getTime())) {
      const match = ts.match(
        /^(\d{1,2})([./])(\d{1,2})\2(\d{4})[,\s]+(\d{1,2}):(\d{2})(?::(\d{2}))?$/
      );

      if (match) {
        const [_, d, m, y, hh, mm, ss] = match;
        date = new Date(
          parseInt(y, 10),
          parseInt(m, 10) - 1,
          parseInt(d, 10),
          parseInt(hh, 10),
          parseInt(mm, 10),
          ss ? parseInt(ss, 10) : 0
        );
      }
    }
    return isNaN(date.getTime()) ? null : date;
  };

  // 统计有新消息的活跃天数
  const activeDaysCount = React.useMemo(() => {
    const daysSet = new Set();
    userConversations.forEach((conv) => {
      conv.messages.forEach((msg) => {
        const date = parseTimestamp(msg.timestamp);
        if (date) {
          // 只保留日期部分，忽略时间
          const dayString = date.toLocaleDateString("en-CA"); // 格式 yyyy-mm-dd
          daysSet.add(dayString);
        }
      });
    });
    console.log("daysSet: ", daysSet);
    return daysSet.size;
  }, [userConversations]);
  */

  const parseTimestamp = (ts) => {
    if (!ts) return null;

    // 支持的时间格式
    const formats = [
      "d.M.yyyy, HH:mm:ss", // 30.9.2025, 19:22:22
      "dd.MM.yyyy HH:mm:ss", // 28.09.2025 17:56:39
      "dd/MM/yyyy, HH:mm:ss", // 29/09/2025, 17:39:03
      "yyyy-MM-dd HH:mm:ss", // SQL/ISO 格式
      "yyyy-MM-dd'T'HH:mm:ss", // ISO 带 T
      "yyyy/M/d HH:mm:ss", // 2025/9/30 21:03:42
      "d/M/yyyy, hh:mm:ss a", // 29/9/2025, 11:40:35 p.m.
      "M/d/yyyy, hh:mm:ss a", // 9/30/2025, 2:31:46 PM （美国格式）
    ];

    for (const fmt of formats) {
      const date = parse(ts, fmt, new Date());
      if (isValid(date)) return date;
    }

    // 如果都解析不了，返回 null
    return null;
  };

  // 统计有新消息的活跃天数
  const activeDaysCount = React.useMemo(() => {
    const daysSet = new Set();

    userConversations.forEach((conv) => {
      conv.messages.forEach((msg) => {
        const date = parseTimestamp(msg.timestamp);
        if (date) {
          // 只保留日期部分
          const dayString = format(date, "yyyy-MM-dd"); // 统一为 ISO 格式
          daysSet.add(dayString);
        }
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
