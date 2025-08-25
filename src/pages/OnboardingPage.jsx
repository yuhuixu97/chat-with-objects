import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";

import bg1_tp from "../assets/bg1_tp.png";
import bg2_faded_tp from "../assets/bg2_faded_tp.png";
import bg3_tp from "../assets/bg3_tp.png";

export default function OnboardingPage() {
  const navigate = useNavigate();

  // 第一次加载时检查 localStorage
  /*useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (hasSeenOnboarding) {
      navigate("/LoginPage"); // 已经看过，引导页就直接跳登录页
    }
  }, [navigate]);*/

  const handleFinish = () => {
    //localStorage.setItem("hasSeenOnboarding", "true"); // 记住用户已经看过
    navigate("/LoginPage"); // 跳转到登录页
  };

  return (
    <div className="onboarding-container">
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }}
        modules={[Pagination]}
      >
        {/* 第一屏 */}
        <SwiperSlide>
          <div className="onboarding-page">
            <img src={bg1_tp} alt="开屏图" />
            <div className="text-container">
              <p
                style={{
                  fontFamily: "inherit",
                  fontSize: "19px",
                  marginBottom: "0",
                  fontStyle: "italic",
                  color: "#676767ff",
                }}
              >
                "I've been by your side,
              </p>
              <p
                style={{
                  fontFamily: "inherit",
                  fontSize: "19px",
                  marginTop: "6px",
                  fontStyle: "italic",
                  color: "#676767ff",
                }}
              >
                sharing your days."
              </p>
            </div>
            <div className="button-placeholder">
              <p
                style={{
                  fontFamily: "inherit",
                  fontSize: "24px",
                  margin: "0",
                  padding: "0",
                  color: "#adadadff",
                }}
              >
                →
              </p>
            </div>
          </div>
        </SwiperSlide>

        {/* 第二屏 */}
        <SwiperSlide>
          <div className="onboarding-page">
            <img src={bg2_faded_tp} alt="开屏图" />
            <div className="text-container">
              <p
                style={{
                  fontFamily: "inherit",
                  fontSize: "19px",
                  marginBottom: "0",
                  fontStyle: "italic",
                  color: "#676767ff",
                }}
              >
                "But some of my memories
              </p>
              <p
                style={{
                  fontFamily: "inherit",
                  fontSize: "19px",
                  marginTop: "6px",
                  fontStyle: "italic",
                  color: "#676767ff",
                }}
              >
                have faded…"
              </p>
            </div>
            <div className="button-placeholder">
              <p
                style={{
                  fontFamily: "inherit",
                  fontSize: "24px",
                  margin: "0",
                  padding: "0",
                  color: "#adadadff",
                }}
              >
                →
              </p>
            </div>
          </div>
        </SwiperSlide>

        {/* 第三屏 */}
        <SwiperSlide>
          <div className="onboarding-page">
            <img src={bg3_tp} alt="开屏图" />
            <div className="text-container">
              <p
                style={{
                  fontFamily: "inherit",
                  fontSize: "19px",
                  marginBottom: "0",
                  fontStyle: "italic",
                  color: "#676767ff",
                }}
              >
                "Would you talk with me,
              </p>
              <p
                style={{
                  fontFamily: "inherit",
                  fontSize: "19px",
                  marginTop: "6px",
                  fontStyle: "italic",
                  color: "#676767ff",
                }}
              >
                and help me remember?"
              </p>
            </div>
            <div className="button-placeholder">
              <button className="start-btn" onClick={handleFinish}>
                Start
              </button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
