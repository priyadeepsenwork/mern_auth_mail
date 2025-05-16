import "./App.css";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Header from "./components/Header";

function App() {
  return (
  <section className="poppins-regular">
    <div>
      <Header />
    </div>
    <Routes>
      <Route path="/" element="Home"/>
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  </section>
);
}

export default App;
