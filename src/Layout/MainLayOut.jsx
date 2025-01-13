import { Outlet } from "react-router-dom";
import Footer from "../Common/Footer/Footer";
import Navbar from "../Common/Navbar/Navbar";

const MainLayOut = () => {
  return (
    <>
      <section>
        <Navbar />
      </section>
      <main>
        <Outlet />
      </main>
      <section>
        <Footer />
      </section>
    </>
  );
};

export default MainLayOut;
