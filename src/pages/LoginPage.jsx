import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import $ from "jquery";
import {
  createNewUser,
  userDataModel,
  fetchUserData,
  addConversation,
  initializeUser,
} from "../userDataModel";
import { setResourceId } from "../resource"; // 导入设置方法

let resource_id = "uac633de71b774f31"; // my developer resource_id
const api_key = "OVdTVGtib1plbEY2aUFGcDNpWkduK2V6R1A2NEd1endjdFkvWTc0WFJzQT0=";
let matchingTable = [];

// fetch conversations
const getData = () => {
  $.ajax({
    url: "https://data.id.tue.nl/datasets/entity/14395/item/",
    headers: {
      api_token: api_key,
      resource_id: resource_id, // my developer resource_id
      token: "token_for_identifier",
    },
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      console.log("Fetched developer data:", data);
      if (data.parameter1) {
        // 确定键值对存在，并赋值到matchingTable
        matchingTable = data.parameter1;
        console.log("matchingTable: ", matchingTable);
      }
    },
    error: function (e) {
      console.log("Error fetching developer data:", e);
    },
  });
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [vcode, setVcode] = useState(""); // 存储用户输入的 user name
  const [pid, setPid] = useState(""); // 存储用户输入的 participant id
  const [loginHint, setLoginHint] = useState(""); // Login状态消息

  useEffect(() => {
    getData();
  }, []);

  const handleLogin = () => {
    // 登录验证：假设验证成功的条件是 vcode 和 pId 都非空
    if (vcode.trim() && pid.trim()) {
      const expectedVcode = matchingTable.find(
        (entry) => entry.Pid === pid.trim()
      );
      console.log(pid, vcode, expectedVcode);
      // 登录成功：pId 和 vcode 都匹配
      if (expectedVcode && expectedVcode.Vcode === vcode.trim()) {
        setResourceId(expectedVcode.resource_id); // 重新设置全局变量，在resource.js里
        setLoginHint("Login successfully. Welcome!"); // 验证成功显示消息

        //去数据库查询，如果没有这个resource_id下的user，则创建一个
        fetchUserData(expectedVcode.resource_id, (data) => {
          console.log("fetchUserData callback data:", data);
          // 你可以在这里调用 setState 或其他逻辑
        });

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);
      } else {
        setLoginHint("Login failed. Please retry.");
      }
    } else {
      setLoginHint("Please enter both ID and code.");
    }
  };

  // 清空提示消息
  const handleInputChange = () => {
    if (loginHint) {
      setLoginHint(""); // 用户修改输入框时清空消息
    }
  };

  return (
    <div className="chat-list-container full-height">
      <div className="my-profile-page">
        <h1
          className="login-title"
          style={{ fontSize: "28px", padding: "64px", fontStyle: "italic" }}
        >
          ObChat!
        </h1>
        <div className="text-n-input">
          <p
            className="storytext"
            style={{
              fontSize: "17px",
              fontWeight: "500",
              paddingBottom: "8px",
              marginLeft: "8px",
            }}
          >
            Participant ID
          </p>
          {/* 文本框部分 */}
          <input
            className="name-input"
            type="text"
            placeholder='A 4-digit ID like "P001"'
            rows="1"
            cols="32"
            value={pid}
            onChange={(e) => {
              setPid(e.target.value);
              handleInputChange(); // 清空提示消息
            }}
          />
        </div>
        <div className="text-n-input">
          <p
            className="storytext"
            style={{
              fontSize: "17px",
              fontWeight: "500",
              paddingTop: "24px",
              paddingBottom: "8px",
              marginLeft: "8px",
            }}
          >
            Verification code
          </p>
          {/* 文本框部分 */}
          <input
            className="name-input"
            type="text"
            placeholder='A 6-digit number like "ABC123"'
            rows="1"
            cols="32"
            value={vcode}
            onChange={(e) => {
              setVcode(e.target.value);
              handleInputChange(); // 清空提示消息
            }}
          />
        </div>
        <p
          id="login-hint"
          style={{
            fontSize: "16px",
            height: "24px",
            marginTop: "24px",
            marginBottom: "8px",
            color:
              loginHint === "Login successfully. Welcome!"
                ? "#0eb546"
                : "#ff4d4f", // 成功绿色，失败红色
          }}
        >
          {loginHint}
        </p>
        <button
          disabled={!vcode.trim() || !pid.trim()}
          className={`login-button ${
            vcode.trim() && pid.trim() ? "active" : "disabled"
          }`}
          onClick={handleLogin}
          style={{ height: "52px", fontSize: "20px" }}
        >
          Log in
        </button>
      </div>
    </div>
  );
}
