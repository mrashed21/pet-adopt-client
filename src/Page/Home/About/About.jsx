/* eslint-disable react/no-unescaped-entities */
import { Typography } from "@material-tailwind/react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { useEffect } from "react";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="w-11/12 mx-auto px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <Typography variant="h2" className="text-3xl lg:text-4xl font-bold">
            About Us
          </Typography>
          <Typography variant="lead" className="mt-2 text-lg">
            Learn more about our mission and how we make a difference.
          </Typography>
        </motion.div>

        {/* Content Section */}
        <div className="flex flex-col lg:flex-row items-center lg:space-x-8">
          {/* Image */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 mb-8 lg:mb-0"
          >
            <img
              src="https://i.ibb.co.com/kmQMJfX/nathan-hanna-7hx-C83-Qcuwo-unsplash.jpg"
              alt="Helping Pets"
              className="rounded-lg shadow-lg h-96"
              data-aos="fade-right"
            />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 text-center lg:text-left space-y-6"
          >
            <Typography variant="h5" className="text-xl font-semibold">
              How Our Website Works
            </Typography>
            <Typography className="text-gray-700 dark:text-gray-300">
              Our platform connects people looking to adopt pets with shelters
              and foster homes. Browse through categories of pets, view their
              profiles, and find your perfect companion. Whether it's a cat,
              dog, rabbit, or fish, we make the adoption process easy and
              transparent.
            </Typography>
            <Typography variant="h5" className="text-xl font-semibold">
              Why This Website Was Made
            </Typography>
            <Typography className="text-gray-700 dark:text-gray-300">
              Every pet deserves a loving home. This website was created to
              bring awareness to the plight of abandoned animals and provide a
              platform where they can find their forever families. Together, we
              can give them a better life.
            </Typography>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
