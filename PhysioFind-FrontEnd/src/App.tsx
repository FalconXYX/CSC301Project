import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./assets/css/global.css";

import Home from "./pages/Home";
import NavLayout from "./layouts/NavLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages with nav layout */}
        <Route path="/" element={<NavLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
