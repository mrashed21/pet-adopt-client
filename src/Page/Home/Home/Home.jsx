import About from "../About/About";
import Banner from "../Banner/Banner";
import CallToAction from "../CallToAction/CallToAction";
import PetsCategory from "../PetsCategory/PetsCategory";

const Home = () => {
  return (
    <div>
      <Banner />
      <PetsCategory />
      <CallToAction />
      <About />
    </div>
  );
};

export default Home;
