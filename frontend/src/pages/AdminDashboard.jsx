import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { carService, modificationService } from '../services/api';
import { AnimatedCard, PageTransition } from '../components/Animations';
import { Header, Footer } from '../components/Layout';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  DollarSign,
  Car as CarIcon,
  Settings as SettingsIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [modifications, setModifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cars');
  const [showAddCarForm, setShowAddCarForm] = useState(false);
  const [editingCarId, setEditingCarId] = useState(null);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [priceEditingCarId, setPriceEditingCarId] = useState(null);
  const [priceValue, setPriceValue] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    horsepower: 0,
    torque: 0,
    fuelType: 'Petrol',
    drivetrain: 'RWD',
    acceleration: 10,
    topSpeed: 200,
    category: 'Sedan',
    price: 0,
    description: '',
    imageUrl: '',
    engine: {
      displacement: 0,
      cylinders: 0,
      type: 'V6',
    },
    isVisible: true,
  });

  // Verify admin access
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const ADMIN_EMAIL = 'belalmohamedyousry@gmail.com';
    const isAdmin =
      user.role === 'admin' ||
      (user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());

    if (!isAdmin) {
      navigate('/home');
      return;
    }

    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const carsRes = await carService.getAllCarsIncludingHidden();
      setCars(Array.isArray(carsRes.data) ? carsRes.data : []);
      const modsRes = await modificationService.getModifications();
      setModifications(Array.isArray(modsRes.data) ? modsRes.data : []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setCars([]);
      setModifications([]);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const resetFormData = () => {
    setFormData({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      horsepower: 0,
      torque: 0,
      fuelType: 'Petrol',
      drivetrain: 'RWD',
      acceleration: 10,
      topSpeed: 200,
      category: 'Sedan',
      price: 0,
      description: '',
      imageUrl: '',
      engine: {
        displacement: 0,
        cylinders: 0,
        type: 'V6',
      },
      isVisible: true,
    });
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      if (editingCarId) {
        await carService.updateCar(editingCarId, formData);
        showSuccess('Car updated successfully!');
        setEditingCarId(null);
      } else {
        await carService.createCar(formData);
        showSuccess('Car added successfully!');
      }
      resetFormData();
      setShowAddCarForm(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save car:', error);
      alert('Error saving car: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEditCar = (car) => {
    setFormData(car);
    setEditingCarId(car._id);
    setShowAddCarForm(true);
    window.scrollTo(0, 0);
  };

  const handleCancelEdit = () => {
    resetFormData();
    setEditingCarId(null);
    setShowAddCarForm(false);
  };

  const handlePriceEdit = (car) => {
    setPriceEditingCarId(car._id);
    setPriceValue(car.price || 0);
    setShowPriceModal(true);
  };

  const handleSavePrice = async () => {
    try {
      const carToUpdate = cars.find((c) => c._id === priceEditingCarId);
      await carService.updateCar(priceEditingCarId, {
        ...carToUpdate,
        price: parseFloat(priceValue),
      });
      showSuccess('Price updated successfully!');
      setShowPriceModal(false);
      setPriceEditingCarId(null);
      setPriceValue('');
      fetchData();
    } catch (error) {
      console.error('Failed to update price:', error);
      alert('Error updating price: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleToggleVisibility = async (carId, currentVisibility) => {
    try {
      const car = cars.find((c) => c._id === carId);
      await carService.updateCar(carId, { ...car, isVisible: !currentVisibility });
      showSuccess(
        `Car ${!currentVisibility ? 'shown' : 'hidden'} successfully!`
      );
      fetchData();
    } catch (error) {
      console.error('Failed to update car:', error);
    }
  };

  const handleDeleteCar = async (carId) => {
    if (!confirm('Are you sure you want to delete this car? This action cannot be undone.'))
      return;
    try {
      await carService.deleteCar(carId);
      showSuccess('Car deleted successfully!');
      fetchData();
    } catch (error) {
      console.error('Failed to delete car:', error);
      alert('Error deleting car: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <PageTransition>
      <div>
        <Header
          title="Admin Dashboard"
          subtitle="Manage your showroom inventory and pricing"
        />

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-900/20 border border-green-600 text-green-400 rounded-lg text-sm sm:text-base"
            >
              ✓ {successMessage}
            </motion.div>
          )}

          {loading ? (
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gray-700 border-t-red-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading inventory...</p>
            </div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 border-b border-gray-800 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('cars')}
                  className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base font-semibold border-b-2 transition whitespace-nowrap ${
                    activeTab === 'cars'
                      ? 'border-red-600 text-white'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <CarIcon className="inline mr-1 sm:mr-2" size={16} />
                  <span className="hidden sm:inline">Inventory ({cars.length})</span>
                  <span className="sm:hidden">Cars</span>
                </button>
                <button
                  onClick={() => setActiveTab('pricing')}
                  className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base font-semibold border-b-2 transition whitespace-nowrap ${
                    activeTab === 'pricing'
                      ? 'border-red-600 text-white'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <DollarSign className="inline mr-1 sm:mr-2" size={16} />
                  <span className="hidden sm:inline">Pricing</span>
                  <span className="sm:hidden">Price</span>
                </button>
                <button
                  onClick={() => setActiveTab('modifications')}
                  className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base font-semibold border-b-2 transition whitespace-nowrap ${
                    activeTab === 'modifications'
                      ? 'border-red-600 text-white'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <SettingsIcon className="inline mr-1 sm:mr-2" size={16} />
                  <span className="hidden sm:inline">Modifications</span>
                  <span className="sm:hidden">Mods</span>
                </button>
              </div>

              {/* CARS TAB */}
              {activeTab === 'cars' && (
                <div>
                  <button
                    onClick={() => {
                      resetFormData();
                      setEditingCarId(null);
                      setShowAddCarForm(!showAddCarForm);
                    }}
                    className="mb-6 sm:mb-8 px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold flex items-center gap-1 sm:gap-2 transition w-full sm:w-auto justify-center sm:justify-start"
                  >
                    <Plus size={18} />
                    <span className="hidden sm:inline">{showAddCarForm ? 'Cancel' : 'Add New Car'}</span>
                    <span className="sm:hidden">{showAddCarForm ? 'Cancel' : 'Add'}</span>
                  </button>

                  {/* Add/Edit Car Form */}
                  {showAddCarForm && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8"
                    >
                      <h3 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                        {editingCarId ? 'Edit Car' : 'Add New Car'}
                      </h3>
                      <form onSubmit={handleAddCar} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                        {/* Brand */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Brand *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., BMW, Tesla, Nissan"
                            value={formData.brand}
                            onChange={(e) =>
                              setFormData({ ...formData, brand: e.target.value })
                            }
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition"
                            required
                          />
                        </div>

                        {/* Model */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Model *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., M340i, Model 3, 370Z"
                            value={formData.model}
                            onChange={(e) =>
                              setFormData({ ...formData, model: e.target.value })
                            }
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition"
                            required
                          />
                        </div>

                        {/* Year */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Year *
                          </label>
                          <input
                            type="number"
                            placeholder="2024"
                            value={formData.year}
                            onChange={(e) =>
                              setFormData({ ...formData, year: parseInt(e.target.value) })
                            }
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition"
                            required
                          />
                        </div>

                        {/* Price */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Price (AED)
                          </label>
                          <input
                            type="number"
                            placeholder="0"
                            value={formData.price}
                            onChange={(e) =>
                              setFormData({ ...formData, price: parseInt(e.target.value) })
                            }
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition"
                          />
                        </div>

                        {/* Horsepower */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Horsepower *
                          </label>
                          <input
                            type="number"
                            placeholder="350"
                            value={formData.horsepower}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                horsepower: parseInt(e.target.value),
                              })
                            }
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition"
                            required
                          />
                        </div>

                        {/* Torque */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Torque (Nm) *
                          </label>
                          <input
                            type="number"
                            placeholder="500"
                            value={formData.torque}
                            onChange={(e) =>
                              setFormData({ ...formData, torque: parseInt(e.target.value) })
                            }
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition"
                            required
                          />
                        </div>

                        {/* 0-100 Acceleration */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            0-100 km/h (seconds) *
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            placeholder="5.5"
                            value={formData.acceleration}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                acceleration: parseFloat(e.target.value),
                              })
                            }
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition"
                            required
                          />
                        </div>

                        {/* Top Speed */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Top Speed (km/h) *
                          </label>
                          <input
                            type="number"
                            placeholder="250"
                            value={formData.topSpeed}
                            onChange={(e) =>
                              setFormData({ ...formData, topSpeed: parseInt(e.target.value) })
                            }
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition"
                            required
                          />
                        </div>

                        {/* Fuel Type */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Fuel Type *
                          </label>
                          <select
                            value={formData.fuelType}
                            onChange={(e) =>
                              setFormData({ ...formData, fuelType: e.target.value })
                            }
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-600 focus:outline-none transition"
                            required
                          >
                            <option>Petrol</option>
                            <option>Diesel</option>
                            <option>Hybrid</option>
                            <option>Electric</option>
                          </select>
                        </div>

                        {/* Drivetrain */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Drivetrain *
                          </label>
                          <select
                            value={formData.drivetrain}
                            onChange={(e) =>
                              setFormData({ ...formData, drivetrain: e.target.value })
                            }
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-600 focus:outline-none transition"
                            required
                          >
                            <option>RWD</option>
                            <option>FWD</option>
                            <option>AWD</option>
                            <option>4WD</option>
                          </select>
                        </div>

                        {/* Category */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Category *
                          </label>
                          <select
                            value={formData.category}
                            onChange={(e) =>
                              setFormData({ ...formData, category: e.target.value })
                            }
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-600 focus:outline-none transition"
                            required
                          >
                            <option>Sedan</option>
                            <option>SUV</option>
                            <option>Sports</option>
                            <option>Hatchback</option>
                            <option>Coupe</option>
                            <option>Truck</option>
                          </select>
                        </div>

                        {/* Engine Displacement */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Engine Displacement (cc) *
                          </label>
                          <input
                            type="number"
                            placeholder="3000"
                            value={formData.engine.displacement}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                engine: {
                                  ...formData.engine,
                                  displacement: parseInt(e.target.value),
                                },
                              })
                            }
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition"
                            required
                          />
                        </div>

                        {/* Engine Cylinders */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Cylinders *
                          </label>
                          <input
                            type="number"
                            placeholder="6"
                            value={formData.engine.cylinders}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                engine: {
                                  ...formData.engine,
                                  cylinders: parseInt(e.target.value),
                                },
                              })
                            }
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition"
                            required
                          />
                        </div>

                        {/* Engine Type */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Engine Type
                          </label>
                          <input
                            type="text"
                            placeholder="V6, V8, I4, etc."
                            value={formData.engine.type}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                engine: {
                                  ...formData.engine,
                                  type: e.target.value,
                                },
                              })
                            }
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition"
                          />
                        </div>

                        {/* Image URL */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Image URL
                          </label>
                          <input
                            type="url"
                            placeholder="https://example.com/car-image.jpg"
                            value={formData.imageUrl}
                            onChange={(e) =>
                              setFormData({ ...formData, imageUrl: e.target.value })
                            }
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition"
                          />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Description
                          </label>
                          <textarea
                            placeholder="Enter car description..."
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({ ...formData, description: e.target.value })
                            }
                            rows="4"
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition resize-none"
                          />
                        </div>

                        {/* Visibility */}
                        <div className="md:col-span-2">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.isVisible}
                              onChange={(e) =>
                                setFormData({ ...formData, isVisible: e.target.checked })
                              }
                              className="w-5 h-5 rounded accent-red-600"
                            />
                            <span className="text-white font-semibold">
                              Visible on Public Website
                            </span>
                          </label>
                        </div>

                        {/* Form Actions */}
                        <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 sm:gap-4">
                          <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2 sm:py-3 text-sm sm:text-base rounded-lg font-semibold transition flex items-center justify-center gap-1 sm:gap-2"
                          >
                            <Save size={16} className="sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">{editingCarId ? 'Update Car' : 'Add Car'}</span>
                            <span className="sm:hidden">{editingCarId ? 'Update' : 'Add'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 sm:py-3 text-sm sm:text-base rounded-lg font-semibold transition flex items-center justify-center gap-1 sm:gap-2"
                          >
                            <X size={16} className="sm:w-5 sm:h-5" />
                            Cancel
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* Cars List */}
                  <div className="space-y-4">
                    {cars.length === 0 ? (
                      <div className="text-center py-12 bg-gray-900/50 border border-gray-800 rounded-lg">
                        <CarIcon size={48} className="mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400 text-lg">No cars in inventory yet.</p>
                        <p className="text-gray-500 text-sm mt-2">
                          Add your first car to get started!
                        </p>
                      </div>
                    ) : (
                      cars.map((car) => (
                        <AnimatedCard key={car._id}>
                          <div className="flex flex-col gap-3 sm:gap-4">
                            <div className="flex-1">
                              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">
                                {car.brand} {car.model}
                              </h3>
                              <p className="text-gray-400 text-xs sm:text-sm mb-3">
                                {car.year} | {car.horsepower} HP | {car.topSpeed} km/h |{' '}
                                {car.category}
                              </p>
                              {car.price > 0 && (
                                <p className="text-red-400 font-semibold mb-3 text-sm sm:text-base">
                                  AED {car.price.toLocaleString()}
                                </p>
                              )}
                              <div className="flex gap-2 flex-wrap">
                                <span className="px-2 sm:px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-full">
                                  {car.fuelType}
                                </span>
                                <span className="px-2 sm:px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-full">
                                  {car.drivetrain}
                                </span>
                                {car.isVisible ? (
                                  <span className="px-2 sm:px-3 py-1 bg-green-900/30 border border-green-600 text-green-400 text-xs rounded-full flex items-center gap-1">
                                    <Eye size={12} />
                                    <span className="hidden sm:inline">Visible</span>
                                  </span>
                                ) : (
                                  <span className="px-2 sm:px-3 py-1 bg-gray-800 border border-gray-700 text-gray-400 text-xs rounded-full flex items-center gap-1">
                                    <EyeOff size={12} />
                                    <span className="hidden sm:inline">Hidden</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 flex-wrap w-full">
                              <button
                                onClick={() => handlePriceEdit(car)}
                                className="flex-1 min-w-12 px-2 sm:px-4 py-2 bg-green-900/30 hover:bg-green-800/50 text-green-400 rounded-lg transition flex items-center justify-center gap-1 text-xs sm:text-sm"
                                title="Edit Price"
                              >
                                <DollarSign size={14} />
                                <span className="hidden sm:inline">Price</span>
                              </button>
                              <button
                                onClick={() => handleEditCar(car)}
                                className="flex-1 min-w-12 px-2 sm:px-4 py-2 bg-blue-900/30 hover:bg-blue-800/50 text-blue-400 rounded-lg transition flex items-center justify-center gap-1 text-xs sm:text-sm"
                                title="Edit Car"
                              >
                                <Edit size={14} />
                                <span className="hidden sm:inline">Edit</span>
                              </button>
                              <button
                                onClick={() =>
                                  handleToggleVisibility(car._id, car.isVisible)
                                }
                                className="flex-1 min-w-12 px-2 sm:px-4 py-2 bg-yellow-900/30 hover:bg-yellow-800/50 text-yellow-400 rounded-lg transition flex items-center justify-center gap-1 text-xs sm:text-sm"
                                title="Toggle Visibility"
                              >
                                {car.isVisible ? (
                                  <EyeOff size={14} />
                                ) : (
                                  <Eye size={14} />
                                )}
                                <span className="hidden sm:inline">{car.isVisible ? 'Hide' : 'Show'}</span>
                              </button>
                              <button
                                onClick={() => handleDeleteCar(car._id)}
                                className="flex-1 min-w-12 px-2 sm:px-4 py-2 bg-red-900/30 hover:bg-red-800/50 text-red-400 rounded-lg transition flex items-center justify-center gap-1 text-xs sm:text-sm"
                                title="Delete Car"
                              >
                                <Trash2 size={14} />
                                <span className="hidden sm:inline">Delete</span>
                              </button>
                            </div>
                          </div>
                        </AnimatedCard>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* PRICING TAB */}
              {activeTab === 'pricing' && (
                <div>
                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 sm:p-6 mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-xl font-bold text-white mb-2">
                      Price Management
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400">
                      Click the price button on any car in the Inventory tab, or use the quick
                      pricing table below.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {cars.length === 0 ? (
                      <div className="text-center py-12 bg-gray-900/50 border border-gray-800 rounded-lg">
                        <DollarSign size={40} className="mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400 text-sm sm:text-lg">No cars available for pricing.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm sm:text-base">
                          <thead>
                            <tr className="border-b border-gray-800">
                              <th className="text-left py-2 sm:py-4 px-2 sm:px-4 text-gray-300 font-semibold text-xs sm:text-sm">
                                Car
                              </th>
                              <th className="text-left py-2 sm:py-4 px-2 sm:px-4 text-gray-300 font-semibold text-xs sm:text-sm">
                                Category
                              </th>
                              <th className="text-right py-2 sm:py-4 px-2 sm:px-4 text-gray-300 font-semibold text-xs sm:text-sm">
                                Price
                              </th>
                              <th className="text-center py-2 sm:py-4 px-2 sm:px-4 text-gray-300 font-semibold text-xs sm:text-sm">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {cars.map((car) => (
                              <tr
                                key={car._id}
                                className="border-b border-gray-800 hover:bg-gray-900/50 transition"
                              >
                                <td className="py-2 sm:py-4 px-2 sm:px-4 text-white text-xs sm:text-sm">
                                  {car.brand} {car.model}
                                </td>
                                <td className="py-2 sm:py-4 px-2 sm:px-4 text-gray-400 text-xs sm:text-sm">{car.category}</td>
                                <td className="py-2 sm:py-4 px-2 sm:px-4 text-right text-xs sm:text-sm">
                                  <span
                                    className={
                                      car.price > 0
                                        ? 'text-red-400 font-semibold'
                                        : 'text-gray-500'
                                    }
                                  >
                                    {car.price > 0
                                      ? `AED ${car.price.toLocaleString()}`
                                      : 'Not set'}
                                  </span>
                                </td>
                                <td className="py-2 sm:py-4 px-2 sm:px-4 text-center">
                                  <button
                                    onClick={() => handlePriceEdit(car)}
                                    className="px-2 sm:px-4 py-1 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs sm:text-sm font-semibold transition"
                                  >
                                    Edit
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MODIFICATIONS TAB */}
              {activeTab === 'modifications' && (
                <div>
                  <button className="mb-8 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    <Plus size={20} />
                    Add Modification Type
                  </button>

                  <div className="space-y-4">
                    {modifications.length === 0 ? (
                      <div className="text-center py-12 bg-gray-900/50 border border-gray-800 rounded-lg">
                        <SettingsIcon size={48} className="mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400 text-lg">
                          No modifications available yet.
                        </p>
                      </div>
                    ) : (
                      modifications.map((mod) => (
                        <AnimatedCard key={mod._id}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-white">{mod.name}</h3>
                              <p className="text-gray-400 text-sm mb-2">
                                Type: {mod.type} | {mod.horsepower || 0} HP gain
                                {mod.torqueBoost && ` | ${mod.torqueBoost} Nm torque`}
                              </p>
                              <p className="text-gray-500 text-sm">{mod.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <button className="p-2 bg-blue-900/30 hover:bg-blue-800/50 text-blue-400 rounded-lg transition">
                                <Edit size={18} />
                              </button>
                              <button className="p-2 bg-red-900/30 hover:bg-red-800/50 text-red-400 rounded-lg transition">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </AnimatedCard>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Price Edit Modal */}
        {showPriceModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-8 max-w-sm w-full"
            >
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-4">Edit Price</h3>
              <div className="mb-6">
                <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                  Price (AED)
                </label>
                <input
                  type="number"
                  value={priceValue}
                  onChange={(e) => setPriceValue(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition text-sm sm:text-base"
                  placeholder="Enter price"
                  min="0"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleSavePrice}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowPriceModal(false);
                    setPriceEditingCarId(null);
                    setPriceValue('');
                  }}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <Footer />
      </div>
    </PageTransition>
  );
};
