/* eslint-disable react/no-unescaped-entities */
import { Button, Typography } from "@material-tailwind/react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { useEffect } from "react";

const CallToAction = () => {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <section className="relative py-20 dark:bg-[#303030]">
      <div className="w-11/12 mx-auto px-4 flex flex-col lg:flex-row items-center justify-between space-y-8 gap-8 lg:space-y-0">
        {/* Inspirational Image */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2"
        >
          <img
            src="https://i.ibb.co.com/qBw3xG8/petindenger1.jpg"
            alt="Adopt a Pet"
            className="rounded-lg shadow-lg h-96"
            data-aos="fade-right"
          />
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 text-center lg:text-left space-y-6"
        >
          <Typography
            variant="h2"
            className="text-3xl lg:text-4xl font-bold dark:text-white"
            data-aos="fade-up"
          >
            Adopt, Don't Shop!
          </Typography>
          <Typography
            variant="lead"
            className="text-lg lg:text-xl dark:text-white"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Give a loving home to a pet in need and experience unconditional
            love and companionship. Together, we can make a difference in their
            lives.
          </Typography>
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center lg:justify-start"
          >
            <Button
              color="blue-gray"
              size="lg"
              className="font-bold shadow-lg hover:shadow-xl"
              data-aos="zoom-in"
              data-aos-delay="400"
            >
              Start Your Journey
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
