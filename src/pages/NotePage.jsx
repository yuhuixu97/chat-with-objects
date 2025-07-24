import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoChevronLeft } from "react-icons/go";
import { userDataModel } from "../userDataModel";
import $ from "jquery";

export default function NotePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resource_id } = location.state || {}; // 从 MyProfilePage 获得 resource_id
  const [note, setNote] = useState("");
  const [user, setUser] = useState("");
  const [notes, setNotes] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    console.log("resource_id: ", resource_id);
    getUserData((user) => {
      // 给 notes 设置默认值，避免为 null
      const notes = user.notes ?? [];
      setUser(user);
      setNotes(notes);
      console.log("Set user data: ", user);
      console.log("user.notes: ", notes);
    });
  }, []);

  const textareaRef = useRef(null);
  // 弹出键盘时聚焦到textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const handleFocus = () => {
      setTimeout(() => {
        textarea.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    };
    textarea.addEventListener("focus", handleFocus);
    return () => textarea.removeEventListener("focus", handleFocus);
  }, []);

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
        callback(data);
      },
      error: function (e) {
        console.error("Error fetching data:", e);
      },
    });
  };

  const pushNote = (input) => {
    const newNote = {
      note: input,
      timestamp: new Date().toLocaleString(), // 设置时间戳
    };
    console.log("newNote:", newNote);

    // 使用回调方式保证拿到的是最新的 notes
    setNotes((prevNotes) => {
      const updatedNotes = [...prevNotes, newNote];
      console.log("Updated notes:", updatedNotes);

      // 在 state 更新回调里发送数据
      sendData(updatedNotes);
      return updatedNotes;
    });
  };

  const sendData = (updatedNotes) => {
    // 更新 user chats
    $.ajax({
      url: "https://data.id.tue.nl/datasets/entity/14395/item/",
      headers: {
        api_token:
          "OVdTVGtib1plbEY2aUFGcDNpWkduK2V6R1A2NEd1endjdFkvWTc0WFJzQT0=",
        resource_id: resource_id,
        token: "token_for_identifier",
      },
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify({
        notes: updatedNotes, // 只发送新 notes array
      }),
      success: function (response) {
        console.log("New note updated in user notes: ", updatedNotes);
        //storeConversationSeparately(newConversation);
        //if (callback) callback(); // 如果有回调，确保继续执行后续逻辑
      },
      error: function (err) {
        console.error("Error pushing new note in user notes", updatedNotes);
        console.error("Resource_id: ", resource_id);
      },
    });
  };

  const handleSend = () => {
    setShowConfirmation(true); // 弹窗
    // 更新数据库
    pushNote(note);
    //sendData(notes);
    //navigate("/GeneratingPage", { state: { note } });
    /*setTimeout(() => {
      // 弹出窗口提醒更新完成，并延迟返回 chatPage
      navigate("/MyProfilePage");
    }, 2000); // 延迟自动跳转*/
    setTimeout(() => {
      setShowConfirmation(false); // 关闭弹窗
      navigate(0); // 刷新当前页面（等价于 window.location.reload()）
    }, 2000);
  };

  return (
    <div className="story-page full-height">
      <div className="nav-bar2">
        <button className="back-btn" onClick={() => navigate("/MyProfilePage")}>
          <GoChevronLeft size={24} />
        </button>
        <header className="chat-header" style={{ fontWeight: "bold" }}>
          Note
        </header>
        <button
          className={`done-btn ${note ? "" : "disabled"}`}
          onClick={handleSend}
          style={{ right: "0px", paddingRight: "8px", paddingLeft: "8px" }}
          disabled={!note}
        >
          Send
        </button>
      </div>
      {/* 弹窗 */}
      {showConfirmation && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Note sent!</h3>
          </div>
        </div>
      )}
      <div className="note-page">
        <div className="note-input-area" style={{ paddingTop: "8px" }}>
          <div>
            {/* 
          <p
            className="storytext"
            style={{ fontWeight: "500", marginBottom: "8px" }}
          >
            Anything in your mind?
          </p>*/}
            {/* 文本框部分 */}
            <textarea
              ref={textareaRef}
              className="note-input"
              type="text"
              /*placeholder="Thought, feeling, reflection, feedback..."*/
              placeholder="Anything in your mind?"
              value={note}
              style={{ fontSize: "17px", width: "296px", height: "240px" }}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        <div className="note-history" style={{ alignItems: "center" }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              display: "flex",
              marginBottom: "16px",
              marginLeft: "16px",
              cursor: "pointer",
              background: "none",
              border: "none",
              color: "#222",
              textDecoration: "underline",
              padding: 0,
              fontSize: "14px",
              alignSelf: "flex-start",
            }}
          >
            {collapsed ? "Show Note History" : "Hide Note History"}
          </button>
          {!collapsed && (
            <div
              className="note-history-notes"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {notes
                .slice()
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((item, index) => (
                  <div
                    key={index}
                    style={{
                      paddingBottom: "8px",
                      width: "296px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        color: "#888",
                        fontSize: "14px",
                        marginBottom: "4px",
                      }}
                    >
                      {item.timestamp}
                    </div>
                    <div
                      style={{
                        wordWrap: "break-word",
                        fontSize: "16px",
                        color: "#888",
                      }}
                    >
                      {item.note}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
