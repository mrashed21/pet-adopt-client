import { Card, CardBody, Typography } from "@material-tailwind/react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { useEffect } from "react";
const categories = [
  { name: "Cats", img: "https://i.ibb.co.com/NZk0ctZ/cat.jpg" },
  { name: "Dogs", img: "https://i.ibb.co.com/5MpR4X2/dog.jpg" },
  { name: "Rabbits", img: "https://i.ibb.co.com/GsT0KJK/Rabbits.jpg" },
  { name: "Fish", img: "https://i.ibb.co.com/zVz9MJT/fish.jpg" },
  { name: "Birds", img: "https://i.ibb.co.com/hRHk4CZ/Birds.jpg" },
  { name: "Reptiles", img: "https://i.ibb.co.com/LvtFrYF/Reptiles.jpg" },
];

const PetsCategory = () => {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <section className="py-10 bg-gray-200 dark:bg-[#292933]">
      <div className="w-11/12 mx-auto px-4">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Typography
            variant="h2"
            className="text-3xl font-bold dark:text-white"
            data-aos="fade-up"
          >
            Pets Categories
          </Typography>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
              viewport={{ once: true }}
              className="transition-transform"
            >
              <Card
                className="hover:shadow-lg transition-shadow duration-300 dark:bg-[#303030] dark:border-2"
                data-aos="fade-up"
              >
                <CardBody className="flex flex-col items-center text-center p-3">
                  <img
                    src={category.img}
                    alt={`${category.name} image`}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <Typography
                    variant="h5"
                    className="font-medium dark:text-white"
                  >
                    {category.name}
                  </Typography>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PetsCategory;
