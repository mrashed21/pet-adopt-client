import { Button, Typography } from "@material-tailwind/react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { useEffect } from "react";

const GetInvolved = () => {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
      <div className="w-11/12 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          data-aos="fade-up"
          className="mb-10"
        >
          <Typography variant="h2" className="text-3xl lg:text-4xl font-bold">
            Get Involved
          </Typography>
          <Typography variant="lead" className="mt-2 text-lg">
            Support our mission to save and care for pets in need.
          </Typography>
        </motion.div>
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            data-aos="zoom-in"
            className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg"
          >
            <Typography variant="h5" className="font-bold">
              Donate
            </Typography>
            <Typography className="mt-2 text-gray-600 dark:text-gray-300">
              Your donations help us provide food, shelter, and medical care for
              rescued pets.
            </Typography>
            <Button color="blue" size="lg" className="mt-4">
              Donate Now
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            data-aos="zoom-in"
            className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg"
          >
            <Typography variant="h5" className="font-bold">
              Volunteer
            </Typography>
            <Typography className="mt-2 text-gray-600 dark:text-gray-300">
              Join our team and make a difference in the lives of pets waiting
              for homes.
            </Typography>
            <Button color="green" size="lg" className="mt-4">
              Join Us
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            data-aos="zoom-in"
            className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg"
          >
            <Typography variant="h5" className="font-bold">
              Foster
            </Typography>
            <Typography className="mt-2 text-gray-600 dark:text-gray-300">
              Provide temporary care for pets in need and help them transition
              to their new homes.
            </Typography>
            <Button color="red" size="lg" className="mt-4">
              Become a Foster
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GetInvolved;
