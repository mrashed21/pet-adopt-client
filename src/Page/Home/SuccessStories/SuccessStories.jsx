import { Card, CardBody, Typography } from "@material-tailwind/react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { useEffect } from "react";

const SuccessStories = () => {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const stories = [
    {
      title: "Bella Finds Her Forever Home",
      description:
        "Bella, a 3-year-old golden retriever, was rescued from a shelter and now lives with her loving family. She enjoys playing fetch and cuddling with her new owners.",
      image: "https://i.ibb.co.com/2FxsYHX/eric-ward-ISg37-AI2-A-s-unsplash.jpg",
    },
    {
      title: "Whiskers' New Adventure",
      description:
        "Whiskers, a playful tabby cat, found a cozy home where he spends his days exploring and snuggling with his adoptive family.",
      image: "https://i.ibb.co.com/8rBMFqG/chewy-w8-C-d0lhx-Z8-unsplash.jpg",
    },
    {
      title: "Nemo the Rescue Fish",
      description:
        "Nemo, a beautiful Betta fish, was saved from a neglectful environment and now thrives in his new aquarium.",
      image: "https://i.ibb.co.com/D8q32jQ/priscilla-du-preez-TAAh-Buh-E-9-Y-unsplash.jpg",
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Typography variant="h2" className="text-3xl lg:text-4xl font-bold">
            Success Stories
          </Typography>
          <Typography variant="lead" className="mt-2 text-lg">
            Heartwarming stories of pets finding their forever homes.
          </Typography>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              data-aos="fade-up" // AOS animation applied here
            >
              <Card className="shadow-lg">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardBody>
                  <Typography variant="h5" className="font-bold">
                    {story.title}
                  </Typography>
                  <Typography className="mt-2 text-gray-600 dark:text-gray-400">
                    {story.description}
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

export default SuccessStories;
