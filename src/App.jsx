import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import CreateSmoothie from "./pages/CreateSmoothie";
import EditSmoothie from "./pages/EditSmoothie";
import Header from "./components/Header";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateSmoothie />} />
      <Route path="/:id" element={<EditSmoothie />} />
    </Routes>
  );
}
