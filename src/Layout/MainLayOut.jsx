import { Outlet } from "react-router-dom";
import Footer from "../Common/Footer/Footer";
import Navbar from "../Common/Navbar/Navbar";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";

const MainLayOut = () => {
  return (
    <>
     <HelmetProvider>
      <section>
        <Navbar />
      </section>
      <main>
        <Outlet />
      </main>
      <section>
        <Footer />
      </section>
      <ToastContainer />
      </HelmetProvider>
    </>
  );
};

export default MainLayOut;
