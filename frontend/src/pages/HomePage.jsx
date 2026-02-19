import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { carService } from '../services/api';
import { AnimatedCard, AnimatedButton, AnimatedContainer, PageTransition } from '../components/Animations';
import { Header, Footer } from '../components/Layout';
import { ArrowRight, Zap, Gauge, Wrench, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export const HomePage = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await carService.getAllCars();
        setFeaturedCars(response.data.slice(0, 3));
      } catch (error) {
        console.error('Failed to load cars:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  return (
    <PageTransition>
      <div>
      <section className="relative min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden flex items-center">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-16 md:py-20 relative z-10">
          <AnimatedContainer>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              TOP SPEED
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 mb-6 sm:mb-8 max-w-2xl">
              Premium automotive platform for modifications and customization
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 sm:mb-16">
              <Link
                to="/cars"
                className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm sm:text-base md:text-lg transition inline-flex items-center justify-center gap-2"
              >
                Explore Cars
                <ArrowRight size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </Link>
            </div>
          </AnimatedContainer>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-12 sm:mt-16 md:mt-20">
            {[
              {
                icon: Zap,
                title: 'Real-Time Performance',
                description: 'Live data from actual automotive APIs',
              },
              {
                icon: Wrench,
                title: 'Full Customization',
                description: 'Configure wheels, exhaust, body kits and more',
              },
              {
                icon: Settings,
                title: 'Best Car Modification Service',
                description: 'Customize and personalize your vehicle with our expert service',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 sm:p-5 md:p-6 hover:border-gray-700 transition"
              >
                <feature.icon className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-red-600 mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-12 sm:py-16 md:py-20 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <AnimatedContainer>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">Featured Vehicles</h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-400 mb-8 sm:mb-12">
              Discover the finest automobiles in our catalog
            </p>
          </AnimatedContainer>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-gray-700 border-t-red-600 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCars.map((car, idx) => (
                <AnimatedCard key={car._id} delay={idx * 0.1}>
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 flex items-center justify-center">
                    {car.imageUrl ? (
                      <img
                        src={car.imageUrl}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Wrench className="w-12 h-12 text-gray-600" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {car.brand} {car.model}
                  </h3>
                  <div className="flex justify-between mb-4 text-sm">
                    <div>
                      <p className="text-gray-400">Horsepower</p>
                      <p className="text-red-600 font-bold">{car.horsepower} HP</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Top Speed</p>
                      <p className="text-blue-600 font-bold">{car.topSpeed} km/h</p>
                    </div>
                  </div>
                  <Link
                    to={`/car-detail?carId=${car._id}`}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition text-center block"
                  >
                    Customize Now
                  </Link>
                </AnimatedCard>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-gradient-to-r from-gray-900 via-black to-gray-900 py-20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Ready to Customize?</h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
            Start building your dream vehicle with our interactive configurator
          </p>
          <Link
            to="/cars"
            className="inline-block px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition"
          >
            Browse All Cars
          </Link>
        </div>
      </section>
      </div>

      <Footer />
    </PageTransition>
  );
};
