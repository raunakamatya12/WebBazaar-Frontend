import Image from "next/image";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiYoutube,
  FiGithub,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-gray-300 pt-16 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Company */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">About Our Store</h3>
            <p className="text-gray-400">
              We provide the best quality products with fast delivery and
              excellent customer service. Our mission is to make your shopping
              experience enjoyable and hassle-free.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="#"
                className="text-gray-400 hover:text-[#016EB7] dark:hover:text-blue-400 transition-colors duration-300">
                <FiFacebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#016EB7] dark:hover:text-blue-400 transition-colors duration-300">
                <FiTwitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#016EB7] dark:hover:text-blue-400 transition-colors duration-300">
                <FiInstagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#016EB7] dark:hover:text-blue-400 transition-colors duration-300">
                <FiLinkedin size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#016EB7] dark:hover:text-blue-400 transition-colors duration-300">
                <FiYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#016EB7] dark:hover:text-blue-400 transition-colors duration-300">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#016EB7] dark:hover:text-blue-400 transition-colors duration-300">
                  Shop
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#016EB7] dark:hover:text-blue-400 transition-colors duration-300">
                  New Arrivals
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#016EB7] dark:hover:text-blue-400 transition-colors duration-300">
                  Best Sellers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#016EB7] dark:hover:text-blue-400 transition-colors duration-300">
                  Special Offers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#016EB7] dark:hover:text-blue-400 transition-colors duration-300">
                  My Account
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#016EB7] dark:hover:text-blue-400 transition-colors duration-300">
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#016EB7] dark:hover:text-blue-400 transition-colors duration-300">
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#016EB7] dark:hover:text-blue-400 transition-colors duration-300">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#016EB7] dark:hover:text-blue-400 transition-colors duration-300">
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#016EB7] dark:hover:text-blue-400 transition-colors duration-300">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#016EB7] dark:hover:text-blue-400 transition-colors duration-300">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <FiMapPin className="mt-1 mr-3 flex-shrink-0 text-[#016EB7] dark:text-blue-400" />
                <p className="text-gray-400">
                  Butwal
                  <br />
                 Bhairahawa
                </p>
              </div>
              <div className="flex items-center">
                <FiPhone className="mr-3 flex-shrink-0 text-[#016EB7] dark:text-blue-400" />
                <a
                  href="tel:+15551234567"
                  className="text-gray-400 hover:text-[#016EB7] dark:hover:text-blue-400 transition-colors duration-300">
                  +977 9800000003sss
                </a>
              </div>
              <div className="flex items-center">
                <FiGithub className="mr-3 flex-shrink-0 text-[#016EB7] dark:text-blue-400" />
                <a
                  href="https://github.com/raunakamatya12"
                  className="text-gray-400 hover:text-[#016EB7] dark:hover:text-blue-400 transition-colors duration-300">
                  Visit My Github
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-4">
              <h4 className="text-lg font-semibold text-white mb-3">
                Newsletter
              </h4>
              <p className="text-gray-400 mb-3">
                Subscribe for updates and special offers
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 w-full rounded-l-md focus:outline-none focus:ring-2 bg-slate-600 focus:ring-[#016EB7] text-gray-800"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#016EB7] hover:bg-[#015a9b] text-white px-4 py-2 rounded-r-md transition-colors duration-300">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          {/* <h4 className="text-lg font-semibold text-white mb-4 text-center">
            We Accept
          </h4> */}
          {/* <div className="flex flex-wrap justify-center items-center gap-4">
            <Image
              src="https://khalti.com/static/images/khalti-icon.png"
              alt="Khalti Icon"
              className="h-8"
              height={8}
              width={8}
            />
          </div> */}
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} WebBazaar. All rights
            reserved.
          </p>
          {/* <p className="mt-2">
            Designed and developed with ❤️ by Team GULUGULU
          </p> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
