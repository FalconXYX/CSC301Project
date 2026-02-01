import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./assets/css/global.css";

import Home from "./pages/Home";
import NavLayout from "./layouts/NavLayout";
import FindProvider from "./pages/patients/FindProvider";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages with nav layout */}
        <Route path="/" element={<NavLayout />}>
          <Route index element={<Home />} />
          <Route path="find-provider" element={<FindProvider />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
