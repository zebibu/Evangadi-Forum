import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Chatbot from "../Chatbot/Chatbot";

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Chatbot />
      <Footer />
    </>
  );
}

export default Layout;
