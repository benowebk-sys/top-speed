import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { carService } from '../services/api';
import { Header, Footer } from '../components/Layout';
import { Navigation } from '../components/Navigation';
import { PageTransition } from '../components/Animations';
import { Zap, Gauge, Fuel, Wrench, ArrowLeft, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';

export const CarDetailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const carId = searchParams.get('carId');
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
    }).format(price);
  };

  // بيانات افتراضية
  const DEFAULT_CARS = [
    {
      _id: 'default_0',
      brand: 'BMW',
      model: 'M440i xDrive',
      year: 2024,
      engine: {
        displacement: 2998,
        cylinders: 6,
        type: 'Turbocharged Inline-6',
      },
      horsepower: 503,
      torque: 479,
      fuelType: 'Petrol',
      acceleration: 4.2,
      topSpeed: 250,
      drivetrain: 'AWD',
      category: 'Sedan',
      price: 3500000,
      imageUrl: '/images/cars/bmw-m440i.jpg',
      description: 'Latest generation M440i with advanced tech',
    },
    {
      _id: 'default_1',
      brand: 'Mercedes-Benz',
      model: 'AMG C43',
      year: 2024,
      engine: {
        displacement: 1991,
        cylinders: 4,
        type: 'Turbocharged Hybrid I4',
      },
      horsepower: 402,
      torque: 500,
      fuelType: 'Petrol',
      acceleration: 4.2,
      topSpeed: 280,
      drivetrain: 'AWD',
      category: 'Sedan',
      price: 3800000,
      imageUrl: '/images/cars/mercedes-c43.jpg',
      description: 'New generation AMG C43 with hybrid power',
    },
    {
      _id: 'default_2',
      brand: 'Audi',
      model: 'RS7 Avant',
      year: 2024,
      engine: {
        displacement: 3996,
        cylinders: 8,
        type: 'Turbocharged V8',
      },
      horsepower: 661,
      torque: 626,
      fuelType: 'Petrol',
      acceleration: 3.3,
      topSpeed: 305,
      drivetrain: 'AWD',
      category: 'Sedan',
      price: 5500000,
      imageUrl: '/images/cars/audi-rs7.jpg',
      description: 'Latest RS7 Avant with enhanced power output',
    },
    {
      _id: 'default_3',
      brand: 'Porsche',
      model: '911 Turbo S',
      year: 2024,
      engine: {
        displacement: 3746,
        cylinders: 6,
        type: 'Turbocharged Flat-6',
      },
      horsepower: 640,
      torque: 590,
      fuelType: 'Petrol',
      acceleration: 2.6,
      topSpeed: 330,
      drivetrain: 'AWD',
      category: 'Sports',
      price: 9500000,
      imageUrl: '/images/cars/porsche-911-turbo.jpg',
      description: '2024 911 Turbo S with next-gen tech',
    },
    {
      _id: 'default_4',
      brand: 'Lamborghini',
      model: 'Revuelto',
      year: 2024,
      engine: {
        displacement: 5996,
        cylinders: 12,
        type: 'Hybrid V12',
      },
      horsepower: 1001,
      torque: 986,
      fuelType: 'Hybrid',
      acceleration: 2.5,
      topSpeed: 350,
      drivetrain: 'AWD',
      category: 'Sports',
      price: 25000000,
      imageUrl: '/images/cars/lamborghini-revuelto.jpg',
      description: 'Lamborghini flagship hybrid supercar',
    },
    {
      _id: 'default_5',
      brand: 'Ferrari',
      model: '812 Superfast',
      year: 2024,
      engine: {
        displacement: 6496,
        cylinders: 12,
        type: 'Naturally Aspirated V12',
      },
      horsepower: 789,
      torque: 718,
      fuelType: 'Petrol',
      acceleration: 2.9,
      topSpeed: 320,
      drivetrain: 'RWD',
      category: 'Sports',
      price: 20000000,
      imageUrl: '/images/cars/ferrari-812.jpg',
      description: 'Ferrari 812 Superfast with V12 power',
    },
    {
      _id: 'default_6',
      brand: 'Tesla',
      model: 'Model S Plaid 2024',
      year: 2024,
      engine: {
        displacement: 0,
        cylinders: 0,
        type: 'Electric Triple Motor',
      },
      horsepower: 1080,
      torque: 1420,
      fuelType: 'Electric',
      acceleration: 1.89,
      topSpeed: 330,
      drivetrain: 'AWD',
      category: 'Sedan',
      price: 5000000,
      imageUrl: '/images/cars/tesla-model-s-2024.jpg',
      description: 'Refreshed Model S Plaid with improved performance',
    },
    {
      _id: 'default_7',
      brand: 'McLaren',
      model: 'Artura',
      year: 2024,
      engine: {
        displacement: 3994,
        cylinders: 8,
        type: 'Hybrid V8',
      },
      horsepower: 680,
      torque: 720,
      fuelType: 'Hybrid',
      acceleration: 2.8,
      topSpeed: 330,
      drivetrain: 'RWD',
      category: 'Sports',
      price: 16000000,
      imageUrl: '/images/cars/mclaren-artura.jpg',
      description: 'McLaren hybrid supercar with groundbreaking tech',
    },
    {
      _id: 'default_8',
      brand: 'Bentley',
      model: 'Continental Speed',
      year: 2024,
      engine: {
        displacement: 5950,
        cylinders: 12,
        type: 'Twin-Turbocharged W12',
      },
      horsepower: 667,
      torque: 738,
      fuelType: 'Petrol',
      acceleration: 3.5,
      topSpeed: 335,
      drivetrain: 'AWD',
      category: 'Coupe',
      price: 13000000,
      imageUrl: '/images/cars/bentley-speed.jpg',
      description: 'Latest Bentley Continental Speed with ultimate luxury',
    },
    {
      _id: 'default_9',
      brand: 'Bugatti',
      model: 'Bolide',
      year: 2024,
      engine: {
        displacement: 7993,
        cylinders: 16,
        type: 'Quad-Turbocharged W16',
      },
      horsepower: 1600,
      torque: 1200,
      fuelType: 'Petrol',
      acceleration: 2.17,
      topSpeed: 500,
      drivetrain: 'AWD',
      category: 'Sports',
      price: 150000000,
      imageUrl: '/images/cars/bugatti-bolide.jpg',
      description: 'Bugatti Bolide - fastest hypercar ever created',
    },
    {
      _id: 'default_10',
      brand: 'Rolls-Royce',
      model: 'Ghost Black Badge',
      year: 2024,
      engine: {
        displacement: 5950,
        cylinders: 12,
        type: 'Twin-Turbocharged V12',
      },
      horsepower: 593,
      torque: 664,
      fuelType: 'Petrol',
      acceleration: 4.6,
      topSpeed: 250,
      drivetrain: 'AWD',
      category: 'Sedan',
      price: 15000000,
      imageUrl: '/images/cars/rolls-royce-ghost-bb.jpg',
      description: 'Rolls-Royce Ghost Black Badge with exclusive styling',
    },
    {
      _id: 'default_11',
      brand: 'Jaguar',
      model: 'F-Type 2025',
      year: 2025,
      engine: {
        displacement: 2997,
        cylinders: 6,
        type: 'Turbocharged Inline-6',
      },
      horsepower: 575,
      torque: 531,
      fuelType: 'Petrol',
      acceleration: 3.5,
      topSpeed: 305,
      drivetrain: 'RWD',
      category: 'Sports',
      price: 4500000,
      imageUrl: '/images/cars/jaguar-f-type-2025.jpg',
      description: 'New generation Jaguar F-Type with modern design',
    },
    {
      _id: 'default_12',
      brand: 'Dodge',
      model: 'Charger Daytona',
      year: 2024,
      engine: {
        displacement: 0,
        cylinders: 0,
        type: 'Electric Dual Motor',
      },
      horsepower: 670,
      torque: 740,
      fuelType: 'Electric',
      acceleration: 3.3,
      topSpeed: 300,
      drivetrain: 'AWD',
      category: 'Coupe',
      price: 4200000,
      imageUrl: '/images/cars/dodge-charger-daytona.jpg',
      description: 'New Dodge Charger Daytona EV muscle car',
    },
    {
      _id: 'default_13',
      brand: 'Chevrolet',
      model: 'Corvette E-Ray',
      year: 2024,
      engine: {
        displacement: 5498,
        cylinders: 8,
        type: 'Hybrid V8',
      },
      horsepower: 655,
      torque: 667,
      fuelType: 'Hybrid',
      acceleration: 2.5,
      topSpeed: 330,
      drivetrain: 'AWD',
      category: 'Sports',
      price: 5500000,
      imageUrl: '/images/cars/corvette-e-ray.jpg',
      description: 'Chevrolet Corvette E-Ray hybrid supercar',
    },
  ];

  useEffect(() => {
    const fetchCar = async () => {
      try {
        if (!carId) {
          setError('No car ID provided');
          setLoading(false);
          return;
        }

        // محاولة جلب من API أولاً
        try {
          const response = await carService.getCarById(carId);
          setCar(response.data.car);
        } catch (apiErr) {
          // إذا فشل، استخدم البيانات الافتراضية
          const defaultCar = DEFAULT_CARS.find(c => c._id === carId);
          if (defaultCar) {
            setCar(defaultCar);
          } else {
            setError('Car not found');
          }
        }
      } catch (err) {
        setError('Failed to load car details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  if (loading) {
    return (
      <PageTransition>
        <Navigation />
        <div className="text-center py-12 sm:py-16 md:py-24">
          <div className="w-10 sm:w-12 h-10 sm:h-12 border-4 border-gray-700 border-t-red-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs sm:text-sm md:text-base text-gray-400 mt-3 sm:mt-4">Loading car details...</p>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  if (error || !car) {
    return (
      <PageTransition>
        <Navigation />
        <div className="text-center py-12 sm:py-16 md:py-24">
          <p className="text-sm sm:text-base md:text-lg text-red-600 font-semibold">{error || 'Car not found'}</p>
          <button
            onClick={() => navigate('/cars')}
            className="mt-4 sm:mt-6 px-3 sm:px-6 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm md:text-base rounded-lg font-semibold transition"
          >
            Back to Cars
          </button>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div>
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-12">
        {/* زر العودة */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/cars')}
          className="flex items-center gap-2 text-xs sm:text-sm md:text-base text-red-600 hover:text-red-500 mb-4 sm:mb-6 md:mb-8 font-semibold transition"
        >
          <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
          Back to Cars
        </motion.button>

      <div className="flex justify-center">
        <div className="max-w-2xl w-full flex flex-col items-center">
          {/* الصورة */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xs md:max-w-sm h-48 sm:h-56 md:h-64 lg:h-80 bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden flex items-center justify-center mb-4 sm:mb-6 md:mb-8 w-full"
          >
            {car.imageUrl ? (
              <img
                src={car.imageUrl}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center">
                <Wrench className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 text-gray-600" />
              </div>
            )}
          </motion.div>

          {/* التفاصيل */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            {/* الرأس */}
            <div className="mb-4 sm:mb-6 md:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-1 sm:mb-2">
                {car.brand} {car.model}
              </h1>
              <p className="text-lg sm:text-2xl text-red-600 font-semibold mb-2 sm:mb-4">
                {formatPrice(car.price) || 'N/A'}
              </p>
              <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-3 sm:mb-4">{car.description}</p>
              <div className="flex gap-2 sm:gap-4">
                <span className="px-2 sm:px-4 py-1 sm:py-2 bg-red-600 text-white text-xs sm:text-sm md:text-base rounded-lg font-semibold">
                  {car.year}
                </span>
                <span className="px-2 sm:px-4 py-1 sm:py-2 bg-gray-800 text-gray-300 text-xs sm:text-sm md:text-base rounded-lg font-semibold">
                  {car.category}
                </span>
              </div>
            </div>

            {/* مواصفات الأداء */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
              <div className="bg-gray-900 rounded-lg p-2 sm:p-3 md:p-4 border border-gray-800">
                <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-red-600 mb-1" />
                <p className="text-xs text-gray-400">Horsepower</p>
                <p className="text-base sm:text-xl md:text-2xl text-white font-bold">{car.horsepower} HP</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-2 sm:p-3 md:p-4 border border-gray-800">
                <Droplets className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 mb-1" />
                <p className="text-xs text-gray-400">Torque</p>
                <p className="text-base sm:text-xl md:text-2xl text-white font-bold">{car.torque} Nm</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-2 sm:p-3 md:p-4 border border-gray-800">
                <Gauge className="w-4 sm:w-5 h-4 sm:h-5 text-orange-600 mb-1" />
                <p className="text-xs text-gray-400">0-100 km/h</p>
                <p className="text-base sm:text-xl md:text-2xl text-white font-bold">{typeof car.acceleration === 'number' ? car.acceleration.toFixed(1) : (parseFloat(car.acceleration) || 0).toFixed(1)}s</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-2 sm:p-3 md:p-4 border border-gray-800">
                <Fuel className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 mb-1" />
                <p className="text-xs text-gray-400">Top Speed</p>
                <p className="text-base sm:text-xl md:text-2xl text-white font-bold">{car.topSpeed} km/h</p>
              </div>
            </div>

            {/* تفاصيل المحرك */}
            <div className="bg-gray-900 rounded-lg p-3 sm:p-4 md:p-6 border border-gray-800 mb-4 sm:mb-6 md:mb-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <Wrench className="w-4 sm:w-5 h-4 sm:h-5 text-red-600" />
                Engine Details
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                <div>
                  <p className="text-xs text-gray-400">Engine Type</p>
                  <p className="text-xs sm:text-sm text-white font-semibold">{car.engine.type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Cylinders</p>
                  <p className="text-xs sm:text-sm text-white font-semibold">{car.engine.cylinders} Cyl</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Displacement</p>
                  <p className="text-xs sm:text-sm text-white font-semibold">{car.engine.displacement} cc</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Fuel Type</p>
                  <p className="text-xs sm:text-sm text-white font-semibold">{car.fuelType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Drivetrain</p>
                  <p className="text-xs sm:text-sm text-white font-semibold">{car.drivetrain}</p>
                </div>
              </div>
            </div>

            {/* أزرار */}
            <div className="grid grid-cols-1 gap-2 sm:gap-3 md:gap-4">
              <button 
                onClick={() => {
                  const params = new URLSearchParams({
                    brand: car.brand,
                    model: car.model,
                    year: car.year,
                    price: car.price,
                    horsepower: car.horsepower,
                    torque: car.torque,
                    topSpeed: car.topSpeed,
                    acceleration: car.acceleration,
                    fuelType: car.fuelType,
                    engineType: car.engine.type,
                    cylinders: car.engine.cylinders,
                    drivetrain: car.drivetrain,
                    imageUrl: car.imageUrl,
                  });
                  navigate(`/purchase?${params.toString()}`);
                }}
                className="bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 text-xs sm:text-base md:text-lg rounded-lg font-semibold transition"
              >
                Buy Now
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      </div>
      </div>

      <Footer />
    </PageTransition>
  );
};
