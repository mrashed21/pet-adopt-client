
import { Typography } from "@material-tailwind/react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-gray-200 py-10">
      <div className="w-11/12 mx-auto px-4">
        {/* Brand Section */}
        <div className="text-center mb-8">
          <Typography variant="h5" className="font-bold mb-4">
            Pet Adoption
          </Typography>
          <Typography className="text-lg mb-4">
            A platform dedicated to finding loving homes for pets in need.
          </Typography>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
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
          <div className="text-center">
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
          <div className="">
            <Typography className="font-semibold mb-2 text-center">Follow Us</Typography>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-xl hover:text-blue-500 transition">
                <FaFacebookF />
              </a>
              <a href="#" className="text-xl hover:text-blue-500 transition">
                <FaTwitter />
              </a>
              <a href="#" className="text-xl hover:text-blue-500 transition">
                <FaInstagram />
              </a>
              <a href="#" className="text-xl hover:text-blue-500 transition">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center mt-8 border-t border-gray-700 pt-4">
          <Typography className="text-sm">
            &copy; {new Date().getFullYear()} Pet Adoption. All rights reserved.
          </Typography>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
