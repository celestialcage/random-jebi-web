import { BrowserRouter, Route, Routes } from "react-router-dom";
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
