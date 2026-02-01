import { Outlet } from "react-router-dom";
import GlobalFooter from "../components/global/GlobalFooter";
import GlobalNav from "../components/global/GlobalNav";
import "./NavLayout.css";

function DefaultLayout() {
  return (
    <>
      <GlobalNav />
      <main>
        <Outlet />
      </main>
      <GlobalFooter />
    </>
  );
}

export default DefaultLayout;
