
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Banner = () => {
  const images = [
    "https://i.ibb.co.com/2d5gH4X/krista-mangulsone-9gz3wf-Hr65-U-unsplash.jpg",
    "https://i.ibb.co.com/k8rPk60/alvan-nee-T-0-EW-SEbs-E-unsplash.jpg",
    "https://i.ibb.co.com/cx0CxtW/matt-nelson-a-I3-EBLvcyu4-unsplash.jpg",
    "https://i.ibb.co.com/Tb7LC5h/md-hasnat-shahriar-shanto-wpud-Nq2i5ts-unsplash.jpg",
    "https://i.ibb.co.com/sgYj1Xk/ricky-davis-S5-Rwcw-BS2l-Q-unsplash.jpg",
    "https://i.ibb.co.com/Dk6RZBh/alexis-antonio-sxzcw1ioas-M-unsplash.jpg",
    "https://i.ibb.co.com/9ZPVDFK/mcgill-library-kbj-QSAZYr-Hk-unsplash.jpg",
  ];

  return (
    <div className="w-full mx-auto dark:bg-[#060617db] pb-[1px]">
      <Carousel className="">
        {images.map((image, index) => (
          <div key={index} className="w-full h-[550px]">
            <img
              className="w-full h-full object-cover"
              src={image}
              alt={`Slide ${index + 1}`}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
