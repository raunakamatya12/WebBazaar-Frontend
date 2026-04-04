import BestProduct from "@/components/home/BestProduct";
import FeaturesSection from "@/components/home/Features";
import Footer from "@/components/home/Footer";
import HomePageSLider from "@/components/home/Slider";
import Link from "next/link";
import PopularProducts from "@/components/home/PopularProducts";
import PersonalizedRecommendations from "@/components/products/PersonalizedRecommendations";
import { CONTACT_ROUTE, PRODUCTS_ROUTE } from "@/constants/routes";
import config from "@/config";
import ChatBox from "@/components/chat/ChatBox";

const HomePage = () => {
  console.log(config.apiUrl);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <HomePageSLider />
      <FeaturesSection />
      <PopularProducts />
      <div className="container mx-auto px-6">
        <PersonalizedRecommendations />
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-[#016EB7] dark:bg-blue-900 transition-colors duration-300">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to experience the best??
          </h2>
          <p className="text-blue-100 dark:text-blue-200 max-w-2xl mx-auto text-lg mb-8">
            Join thousands of satisfied customers who trust our products every
            day.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href={PRODUCTS_ROUTE}
              className="bg-white text-[#016EB7] hover:bg-gray-100 font-semibold py-3 px-8 rounded-full transition duration-300">
              Shop Now
            </Link>
            <Link
              href={CONTACT_ROUTE}
              className="border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-full transition duration-300">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <BestProduct />
      <ChatBox className='relative bottom-6 right-6 w-[360px] max-h-[80vh] bg-white rounded-xl shadow-xl border flex flex-col z-50'/>
      <Footer />
    </div>
  );
};

export default HomePage;
