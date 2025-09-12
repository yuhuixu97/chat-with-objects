import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoChevronLeft } from "react-icons/go";
import { userDataModel } from "../userDataModel";
import $ from "jquery";
import { HiOutlinePhoto } from "react-icons/hi2";
import { GoPlus } from "react-icons/go";

export default function NotePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resource_id } = location.state || {}; // 从 MyProfilePage 获得 resource_id
  const [note, setNote] = useState("");
  const [user, setUser] = useState("");
  const [notes, setNotes] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [images, setImages] = useState([]); // 用数组存多张图片

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

  const formatDate = (date = new Date()) => {
    const pad = (n) => String(n).padStart(2, "0");
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      " " +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes())
    );
  };

  const pushNote = (input) => {
    const newNote = {
      note: input,
      timestamp: formatDate(), // "2025-08-30 18:25" // 设置时间戳
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

  const handleSend = async () => {
    setShowConfirmation(true); // 弹窗
    // 更新数据库
    try {
      await uploadImages();
      console.log("所有图片上传完成！");
    } catch (error) {
      console.error("上传出错:", error);
    }
    pushNote(note);
    //sendData(notes);
    //navigate("/GeneratingPage", { state: { note } });
    /*setTimeout(() => {
      // 弹出窗口提醒更新完成，并延迟返回 chatPage
      navigate("/MyProfilePage");
    }, 2000); // 延迟自动跳转*/
    setTimeout(() => {
      setShowConfirmation(false); // 关闭弹窗
      //navigate(0); // 刷新当前页面（等价于 window.location.reload()）
    }, 2000);
  };

  // 上传图片（到界面）
  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    /*const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target.result; // 原始图片 DataURL
      setImages((prev) => [...prev, url]); // 加入数组
    };
    reader.readAsDataURL(file);*/

    // 保存 File 对象
    setImages((prev) => [...prev, file]);
  };

  const handleDeleteImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 上传 images 数组里的所有图片
  const uploadImages = async () => {
    for (let i = 0; i < images.length; i++) {
      //const blob = dataURLtoBlob(images[i]);
      const file = images[i];
      const now = new Date();
      const timestamp = now.toISOString().replace(/[:.]/g, "-");
      const formData = new FormData();
      const filename = `${resource_id}_image_${timestamp}.jpg`;
      formData.append("file", file, filename); // 设置文件名

      console.log(Array.from(formData.entries()));

      const response = await fetch(
        //"https://data.id.tue.nl/api/v1/datasets/media/14044", // 原来是http，改为了https
        "https://df-demo.id.tue.nl/api/v1/datasets/media/54", // df-demo
        {
          method: "POST",
          headers: {
            api_token:
              //"aDFxSEs1RnFPRkpLSk1kRzBaVWt5NE1HVmNsc3RoeXRyanU3UGJtbzNOZz0=", // DF
              "eDI0ZE5iKy9MVVArUS9Yb2lVL2JIRUhkMitEY25GV3FBM3VkaEZ5Rm9uaz0=", // df-demo
            participant_id: resource_id, // 可选
          },
          body: formData,
        }
      );

      if (!response.ok) {
        console.error(`Upload failed for image ${i}: ${response.status}`);
      } else {
        console.log(`Image ${i} uploaded successfully!`);
      }
    }
  };

  return (
    <div className="story-page full-height">
      <div className="nav-bar2">
        <button className="back-btn" onClick={() => navigate("/MyProfilePage")}>
          <GoChevronLeft size={24} />
        </button>
        <header
          className="chat-header"
          style={{ fontWeight: "bold", color: "#222222" }}
        >
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
            <h3 style={{ color: "#222222" }}>Note sent!</h3>
          </div>
        </div>
      )}
      <div className="note-page">
        <div className="note-input-area">
          <div>
            {/* 文本框部分 */}
            <textarea
              ref={textareaRef}
              className="note-input"
              type="text"
              /*placeholder="Thought, feeling, reflection, feedback..."*/
              placeholder="Anything in your mind? 🖊️"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="upload-image">
              <label htmlFor="upload-photo" className="reverse-camera-btn">
                <GoPlus
                  size={64}
                  style={{
                    color: "#d2d2d2ff",
                  }}
                />
              </label>
              <input
                type="file"
                accept="image/*"
                id="upload-photo"
                style={{ display: "none" }}
                onChange={handleUpload}
              />
              <div className="note-image-display">
                {/* 
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Uploaded"
                    className="note-image"
                    onClick={handleDeleteImage}
                  />
                )}*/}
                {images.map((img, index) => (
                  <div key={index}>
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`upload-${index}`}
                      className="note-image"
                      onClick={() => handleDeleteImage(index)}
                    />
                  </div>
                ))}
              </div>
            </div>
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
              paddingTop: "8px",
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
