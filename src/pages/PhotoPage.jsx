import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// icons
import { GoChevronLeft } from "react-icons/go";

const api_key_AI =
  "df-aGlQOG1TcDVnRVZOS0FCRHVVOCtxZlBGVHFCeW1zV3l2V2tGTWhVc3RIVT0=";

const greetings = [
  "Well shot!",
  "Nice snap!",
  "Great photo!",
  "Lovely pic!",
  "Looks great!",
  "Beautiful!",
  "Stunning!",
  "Awesome pic!",
  "Good photo!",
];

// 将 base64 格式的 imageUrl 转换为 file
/*function base64ToFile(base64String, filename = "image.jpg") {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}*/

// 将 base64 格式的 imageUrl 转换为 bolbURL
/*function base64ToBlobUrl(base64) {
  const byteString = atob(base64.split(",")[1]);
  const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });
  return URL.createObjectURL(blob); // 返回 blob URL
}*/

const getLocalAIResponse = (imageURL, promptToAI) => {
  //const fileImage = base64ToFile(imageURL);
  // console.log("fileImage: ", fileImage);
  //console.log("imageURL: ", imageURL);
  //const blobUrl = base64ToBlobUrl(imageURL);
  //console.log("bolbUrl: ", blobUrl);

  return new Promise((resolve, reject) => {
    // 调用 localAI API
    foundry.imageToText({
      api_token: api_key_AI,
      server: "https://data.id.tue.nl",
      //model: "fireball-meta-llama-3.2-8b-instruct-agent-003-128k-code-dpo",
      model: "llava-llama-3-8b-v1_1",
      prompt: promptToAI,
      image: imageURL,
      temperature: 0.2,
      maxTokens: 100,
      logging: true,
      //loadingElementSelector: "#loading-indicator",
      resultElementSelector: "#result-container-objectEnvironment",
    });
    // 确保 result-container 元素存在
    const resultContainer = document.querySelector(
      "#result-container-objectEnvironment"
    );
    if (!resultContainer) {
      console.error("Error: #result-container-objectEnvironment not found.");
      return reject("Element #result-container-objectEnvironment not found.");
    }

    // 清空 result-container 内容，防止旧的结果叠加
    resultContainer.innerHTML = "";

    // 使用 MutationObserver 来监听 result-container 中的变化
    const observer = new MutationObserver(() => {
      const resultText = resultContainer.innerHTML; // 获取元素内容
      if (resultText) {
        console.log("Fetched AI-extracted object environment:", resultText);
        // 停止观察
        observer.disconnect();
        resolve(resultText); // 返回响应文本
      }
    });

    // 配置 MutationObserver，观察内容变化
    observer.observe(resultContainer, { childList: true, subtree: true });
  });
};

const extractObjectEnvironment = async (imageUrl) => {
  // 调用 photo-to-text
  const promptToAI =
    "Describe the objects and environment in the image in 30 words.";

  try {
    const text = await getLocalAIResponse(imageUrl, promptToAI); // 使用 await
    console.log("Photo-to-text result: ", text);
    return text;
  } catch (err) {
    console.error("Error integrating object facts:", err);
  }
};

export default function PhotoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { imageUrl, currentPrompt, pmtOption } = location.state || {}; // 从 `location.state` 获取传递的图片 URL
  const [objectEnvironment, setObjectEnvironment] = useState("");

  console.log("pmtOption in PhotoPage: ", pmtOption);

  const randomIndex = Math.floor(Math.random() * greetings.length);
  const greeting = greetings[randomIndex];

  // 调用 photo-to-text，并赋值给 objectEnvironment
  /*useEffect(() => {
    if (imageUrl) {
      //console.log("imageUrl: ", imageUrl);
      extractObjectEnvironment(imageUrl).then((text) => {
        setObjectEnvironment(text);
      });
    }
  }, [imageUrl]);*/

  const handleNext = async () => {
    if (imageUrl) {
      const text = await extractObjectEnvironment(imageUrl);
      // setObjectEnvironment(text); // 如果你还需要保存状态的话
      navigate("/StoryInputPage", {
        state: { imageUrl, currentPrompt, pmtOption, objectEnvironment: text },
      });
    } else {
      navigate("/StoryInputPage", {
        state: { imageUrl, currentPrompt, pmtOption, objectEnvironment: null },
      });
    }
  };

  return (
    <div
      className="camera-page full-height"
      style={{ backgroundColor: "#f5f5f5" }}
    >
      <div className="nav-bar2" style={{ backgroundColor: "#f5f5f5" }}>
        <button
          className="back-btn"
          onClick={() =>
            navigate("/CameraPage", { state: { currentPrompt, pmtOption } })
          }
        >
          <GoChevronLeft size={24} />
        </button>
        <button className="done-btn" onClick={handleNext}>
          Next
        </button>
      </div>

      <h3
        style={{
          fontSize: "22px",
          marginBottom: "12px",
          marginTop: "16px",
          color: "#222222",
        }}
      >
        Photo of the object
      </h3>
      <div>
        <p
          style={{
            width: "calc(100vw - 48px)",
            marginTop: "0",
            marginBottom: "24px",
            fontSize: "18px",
            color: "#222222",
          }}
        >
          {currentPrompt}
        </p>
      </div>
      {imageUrl ? (
        <div
          className="captured-photo-area"
          style={{ width: "248px", height: "248px" }}
        >
          <div
            className="photo-display-round"
            style={{
              width: "232px",
              height: "232px",
              //outline: "12px solid #fff",
              boxShadow:
                "0 0 0 12px #fff, 0px 32px 54px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <img
              src={imageUrl}
              alt="Captured"
              style={{ width: "248px", height: "248px" }}
            />
          </div>
        </div>
      ) : (
        <p>No photo available.</p>
      )}
      <h3
        style={{
          fontSize: "20px",
          fontWeight: "500",
          marginBottom: "12px",
          color: "#222222",
        }}
      >
        {greeting}
      </h3>
      {/* AI 返回文本容器（result-container） */}
      <div
        id="result-container-objectEnvironment"
        style={{ display: "none" }}
      ></div>
    </div>
  );
}
