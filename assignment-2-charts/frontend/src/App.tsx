import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { PrivateRoutes } from "./pages/PrivateRoute";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFounPage";
import { RecoilRoot } from "recoil";
import { ShareChartPage } from "./pages/ShareChartPage";

function App() {


  return (
    <>
      <RecoilRoot>
        <MainApp />
      </RecoilRoot>
    </>
  )
}

function MainApp() {

  return (
    <>
      <div className="min-h-screen w-full flex flex-col">
        <BrowserRouter future={{
          v7_relativeSplatPath: true,
        }}>

          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route path='/' element={<HomePage />} />
              <Route path='/share' element={<ShareChartPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/*" element={<NotFoundPage />} />
          </Routes>

        </BrowserRouter>
      </div>
    </>
  );
}

export default App
