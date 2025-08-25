import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {} from "react-router-dom";

// icons
import { GoChevronLeft } from "react-icons/go";
import { AiFillCamera } from "react-icons/ai";
import { GoSync } from "react-icons/go";
import { HiOutlinePhoto } from "react-icons/hi2";

export default function CameraPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [stream, setStream] = useState(null); // 用来保存摄像头流
  const [cameraActive, setCameraActive] = useState(false); // 判断摄像头是否激活
  const [facingMode, setFacingMode] = useState("environment"); // 👈 默认后置摄像头
  const location = useLocation();
  const { currentPrompt, pmtOption } = location.state || {}; // 获取传递的 prompt

  // 切换摄像头
  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    console.log("facing mode: ", facingMode);
    setCameraActive(false); // 触发重新加载摄像头
  };

  useEffect(() => {
    // 获取用户媒体设备（摄像头）
    const startVideo = async () => {
      if (!cameraActive) {
        try {
          // 先停止上一次的流
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
          }

          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: "environment" } },
          });

          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            setStream(mediaStream); // 保存流
            setCameraActive(true); // 摄像头已激活
          }
        } catch (err) {
          console.error("Error accessing the camera: ", err);
        }
      }
    };
    console.log("pmtOption: ", pmtOption);
    startVideo();

    // 清理摄像头流
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]); // 👈 facingMode 改变时重新运行

  // 拍照功能
  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth / 1.5;
      canvas.height = video.videoHeight / 1.5;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageUrl = canvas.toDataURL("image/jpeg", 0.7);
      setPhoto(imageUrl);
      setCameraActive(false); // 拍照后停止摄像头
      if (stream) {
        stream.getTracks().forEach((track) => track.stop()); // 停止摄像头流
      }
      navigate("/PhotoPage", { state: { imageUrl, currentPrompt, pmtOption } }); // 跳转到 "/PhotoPage" 页面，并传递图片 URL
    }
  };

  // 上传图片
  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // 创建一个 canvas 用于压缩
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        // 控制压缩比例（这里是宽高缩小为原来的 2/3）
        const scale = 1 / 6;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // 压缩为 JPEG 格式，质量设为 0.5
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.4);
        navigate("/PhotoPage", {
          state: { imageUrl: compressedDataUrl, currentPrompt, pmtOption },
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="camera-page full-height">
      <div className="nav-bar2" style={{ backgroundColor: "#1a1a1a" }}>
        <button
          className="back-btn"
          onClick={() => {
            let targetPage = "/SelectingPage"; // 默认值
            console.log("pmtOption: ", pmtOption);
            if (pmtOption === "yesPrompt") {
              targetPage = "/PromptingPage";
            } else if (pmtOption === "noPrompt") {
              targetPage = "/SelectingPage";
            }
            navigate(targetPage, { state: { currentPrompt, pmtOption } });
          }}
        >
          <GoChevronLeft
            size={24}
            style={{ paddingLeft: "8px", color: "#ffffff" }}
          />
        </button>
        <header className="chat-header" style={{ color: "#ffffff" }}>
          Take object photo
        </header>
      </div>
      <div>
        <p
          style={{
            color: "#eee",
            paddingLeft: "20px",
            paddingRight: "20px",
            marginTop: "8px",
            fontSize: "17px",
          }}
        >
          {currentPrompt}
        </p>
      </div>
      <div className="video-container">
        <video ref={videoRef} autoPlay playsInline></video>
      </div>

      <div className="camera-bottom-bar">
        <div className="camera-bottom-bar-item">
          {/*
          <label htmlFor="upload-photo" className="reverse-camera-btn">
            <HiOutlinePhoto size={34} />
          </label>
          <input
            type="file"
            accept="image/*"
            id="upload-photo"
            style={{ display: "none" }}
            onChange={handleUpload}
          />*/}
        </div>
        <div className="camera-bottom-bar-item">
          <button className="photo-btn" onClick={takePhoto}>
            <AiFillCamera size={30} />
          </button>
        </div>
        <div className="camera-bottom-bar-item">
          {/* 👇 切换摄像头按钮 */}
          <button onClick={toggleCamera} className="reverse-camera-btn">
            <GoSync size={32} />
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
}
