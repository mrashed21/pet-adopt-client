import About from "../About/About";
import Banner from "../Banner/Banner";
import CallToAction from "../CallToAction/CallToAction";
import PetsCategory from "../PetsCategory/PetsCategory";
import SuccessStories from "../SuccessStories/SuccessStories";

const Home = () => {
  return (
    <div>
      <Banner />
      <PetsCategory />
      <CallToAction />
      <About />
      <SuccessStories />
    </div>
  );
};

export default Home;
