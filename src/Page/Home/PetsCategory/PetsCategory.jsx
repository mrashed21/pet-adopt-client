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

const animationVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const PetsCategory = () => {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <section className="py-10 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={animationVariants}
          className="text-center mb-8"
        >
          <Typography
            variant="h2"
            color="blue-gray"
            className="text-3xl font-bold"
            data-aos="fade-up"
          >
            Pets Categories
          </Typography>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{
                scale: 1.1,
                boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
              }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className="hover:shadow-lg transition-shadow duration-300 "
                data-aos="zoom-in"
              >
                <CardBody className="flex flex-col items-center text-center p-3">
                  <img
                    src={category.img}
                    alt={category.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className="font-medium"
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
