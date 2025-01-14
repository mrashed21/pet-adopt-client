import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

const Banner = () => {
  return (
    <>
      <Carousel>
        <div className="w-full h-[550px]">
          <img
            className="w-full h-full"
            src="https://i.ibb.co.com/FDgm7Sn/River-Adventuresssf.jpg"
          />
        </div>
        <div className="w-full h-[550px]">
          <img
            className="w-full h-full"
            src="https://i.ibb.co.com/qmNGC3J/Camping-Retreatswe.jpg"
          />
        </div>
        <div className="w-full h-[550px]">
          <img
            className="w-full h-full"
            src="https://i.ibb.co.com/xGkvrk8/Camping-Retreats.jpg"
          />
        </div>
        <div className="w-full h-[550px]">
          <img
            className="w-full h-full"
            src="https://i.ibb.co.com/FbNVHtb/Sri-Lankan-Mangrove-Adventure.jpg"
          />
        </div>
        <div className="w-full h-[550px]">
          <img
            className="w-full h-full"
            src="https://i.ibb.co.com/wY5gCC6/Redwood-Forest-Hike.jpg"
          />
        </div>
        <div className="w-full h-[550px]">
          <img
            className="w-full h-full"
            src="https://i.ibb.co.com/KyWChdK/Lake-District-Camping-Getaway.jpg"
          />
        </div>
        <div className="w-full h-[550px]">
          <img
            className="w-full h-full"
            src="https://i.ibb.co.com/F38sYdy/Patagonia-Glacial-Camping-Retreat.jpg"
          />
        </div>
        <div className="w-full h-[550px]">
          <img
            className="w-full h-full"
            src="https://i.ibb.co.com/LR6YQPr/Daintree-Rainforest-Adventure.jpg"
          />
        </div>
      </Carousel>
    </>
  );
};

export default Banner;
