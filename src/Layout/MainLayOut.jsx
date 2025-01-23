import { HelmetProvider } from "react-helmet-async";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Footer from "../Common/Footer/Footer";
import Navbar from "../Common/Navbar/Navbar";

const MainLayOut = () => {
  return (
    <>
      <div className=" bg-gray-400 dark:bg-[#292933] ">
        <HelmetProvider>
          <header className="sticky top-0 left-0 right-0 z-50">
            <div className="max-w-screen-2xl mx-auto">
              <Navbar />
            </div>
          </header>
          <main>
            <Outlet />
          </main>
          <section>
            <Footer />
          </section>
          <ToastContainer />
        </HelmetProvider>
      </div>
    </>
  );
};

export default MainLayOut;
