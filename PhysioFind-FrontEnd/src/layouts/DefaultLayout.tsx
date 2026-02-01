import GlobalFooter from "../components/global/GlobalFooter";
import GlobalNav from "../components/global/GlobalNav";
import "./DefaultLayout.css";

function DefaultLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <GlobalNav />
      <main>{children}</main>
      <GlobalFooter />
    </>
  );
}

export default DefaultLayout;
