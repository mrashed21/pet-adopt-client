import { Button, Typography } from "@material-tailwind/react";
import "aos/dist/aos.css";
import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-gray-200 py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8" data-aos="fade-up">
          <Typography variant="h5" className="font-bold mb-4">
            Pet Adoption
          </Typography>
          <Typography className="text-lg mb-4">
            A platform dedicated to finding loving homes for pets in need.
          </Typography>
          <div className="flex justify-center space-x-6">
            <Button
              color="light-blue"
              icon={<FaFacebookF />}
              size="sm"
              className="p-2 rounded-full"
            />
            <Button
              color="light-blue"
              icon={<FaTwitter />}
              size="sm"
              className="p-2 rounded-full"
            />
            <Button
              color="light-blue"
              icon={<FaInstagram />}
              size="sm"
              className="p-2 rounded-full"
            />
            <Button
              color="light-blue"
              icon={<FaLinkedinIn />}
              size="sm"
              className="p-2 rounded-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center" data-aos="fade-up">
            <Typography className="font-semibold mb-2">Quick Links</Typography>
            <ul className="space-y-2">
              <li>
                <a href="/home" className="hover:text-blue-500">
                  Home
                </a>
              </li>
              <li>
                <a href="/pets" className="hover:text-blue-500">
                  Pet Listing
                </a>
              </li>
              <li>
                <a href="/donation" className="hover:text-blue-500">
                  Donation Campaigns
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-blue-500">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div className="text-center" data-aos="fade-up" data-aos-delay="200">
            <Typography className="font-semibold mb-2">Support</Typography>
            <ul className="space-y-2">
              <li>
                <a href="/faq" className="hover:text-blue-500">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-blue-500">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-blue-500">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div className="text-center" data-aos="fade-up" data-aos-delay="400">
            <Typography className="font-semibold mb-2">Newsletter</Typography>
            <Typography className="mb-4">
              Stay updated with the latest news and adoption stories.
            </Typography>
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 w-2/3 rounded-md mb-4 border border-gray-600 bg-gray-700 text-gray-200"
            />
            <Button color="blue" size="sm">
              Subscribe
            </Button>
          </div>
        </div>

        <div className="text-center" data-aos="fade-up" data-aos-delay="600">
          <Typography className="text-sm">
            &copy; {new Date().getFullYear()} Pet Adoption. All rights reserved.
          </Typography>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
