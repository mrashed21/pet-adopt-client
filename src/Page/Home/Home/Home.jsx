import { Helmet } from "react-helmet-async";
import About from "../About/About";
import Banner from "../Banner/Banner";
import CallToAction from "../CallToAction/CallToAction";
import GetInvolved from "../GetInvolved/GetInvolved";
import PetsCategory from "../PetsCategory/PetsCategory";
import SuccessStories from "../SuccessStories/SuccessStories";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Pet Adopt - Home</title>
      </Helmet>
      <Banner />
      <PetsCategory />
      <CallToAction />
      <About />
      <SuccessStories />
      <GetInvolved />{" "}
    </div>
  );
};

export default Home;
