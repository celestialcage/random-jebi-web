import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./components/common/MainLayout";
import MainPage from "./pages/MainPage";
import GamePage from "./pages/GamePage";
import YesOrNoPage from "./pages/YesOrNoPage";
import LuckyDrawPage from "./pages/LuckyDrawPage";
import JebiPage from "./pages/JebiPage";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {/* 사용자가 / 로 접속하면 브라우저 주소창을 /main으로 강제 전환 */}
          <Route path="/" element={<Navigate to="/main" replace />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/game" element={<GamePage />}>
            <Route path="/game/yes-or-no" element={<YesOrNoPage />} />
            <Route path="/game/lucky-draw" element={<LuckyDrawPage />} />
            <Route path="/game/jebi" element={<JebiPage />} />
            <Route path="/game/custom" element={<div>커스텀 모드 🪄</div>} />
          </Route>
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
