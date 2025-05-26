//import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage";
import SelectingPage from "./pages/SelectingPage";
import PromptingPage from "./pages/PromptingPage";
import CameraPage from "./pages/CameraPage";
import PhotoPage from "./pages/PhotoPage";
import StoryInputPage from "./pages/StoryInputPage";
import GeneratingPage from "./pages/GeneratingPage";
import GeneratedPage from "./pages/GeneratedPage";
import AvatarSelectionPage from "./pages/AvatarSelectionPage";
import MyProfilePage from "./pages/MyProfilePage";
import LoginPage from "./pages/LoginPage";

// 所有页面跳转都要在这里注册一下
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat/:conversation_id" element={<ChatPage />} />
        <Route path="/SelectingPage" element={<SelectingPage />} />
        <Route path="/PromptingPage" element={<PromptingPage />} />
        <Route path="/CameraPage" element={<CameraPage />} />
        <Route path="/PhotoPage" element={<PhotoPage />} />
        <Route path="/StoryInputPage" element={<StoryInputPage />} />
        <Route path="/GeneratingPage" element={<GeneratingPage />} />
        <Route path="/GeneratedPage" element={<GeneratedPage />} />
        <Route path="/AvatarSelectionPage" element={<AvatarSelectionPage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/MyProfilePage" element={<MyProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
