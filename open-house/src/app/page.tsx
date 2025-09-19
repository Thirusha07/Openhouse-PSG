'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Phone, Mail, Globe, Menu, X } from 'lucide-react';
import Link from 'next/link';

interface Lab {
  labName: string;
  departmentName: string;
  description: string;
  image: string;
}

export default function HomePage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);
  const [filteredLabsByDept, setFilteredLabsByDept] = useState<Record<string, Lab[]>>({});

  // Slideshow states
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/lab/fetch-lab');
        const data: { labs: Lab[] } = await res.json();
        setLabs(data.labs);

        // Extract unique departments
        const uniqueDepartments: string[] = [
          ...new Set(data.labs.map((lab) => lab.departmentName))
        ];
        setDepartments(uniqueDepartments);
      } catch (err) {
        setError("Failed to fetch labs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLabs();
  }, []);

  // Removed schedule fetching; request flow moved to /schedule-your-visit

  // Auto-play slideshow
  useEffect(() => {
    if (!isAutoPlaying || labs.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % labs.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [labs.length, isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % labs.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + labs.length) % labs.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Removed booking modal and handlers; navigation goes to /schedule-your-visit

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const filtered = labs.filter(lab => {
      const matchesDepartment = selectedDepartment ? lab.departmentName === selectedDepartment : true;
      const matchesSearch = search
        ? lab.labName.toLowerCase().includes(search.toLowerCase()) ||
        lab.description.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesDepartment && matchesSearch;
    });

    const grouped = filtered.reduce((acc: Record<string, Lab[]>, lab) => {
      if (!acc[lab.departmentName]) acc[lab.departmentName] = [];
      acc[lab.departmentName].push(lab);
      return acc;
    }, {});

    setFilteredLabsByDept(grouped);
  }, [labs, search, selectedDepartment]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 w-full bg-gradient-to-r from-cyan-200 via-blue-200 to-purple-200 bg-opacity-95 backdrop-blur-sm z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-4">
              <img
                src="/images/logo.jpg"
                alt="PSG Logo"
                className="h-16 w-16 mr-4"
              />
              <span className="text-gray-900 text-xl font-bold">PSG College of Technology</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('labs')}
                className="text-gray-900 hover:text-blue-700 transition-colors duration-200 font-semibold"
              >
                Centers of Excellence
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-gray-900 hover:text-blue-700 transition-colors duration-200 font-semibold"
              >
                About Us
              </button>
              <Link href="/schedule-your-visit" className="bg-gradient-to-r from-blue-300 to-blue-700 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-400 hover:to-blue-800 transition-all duration-200 transform hover:scale-105">
                Schedule Your Visit
              </Link>
            </div>
            <button
              className="md:hidden p-2 rounded hover:bg-white/40 text-gray-900"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gradient-to-r from-cyan-200 via-blue-200 to-purple-200 border-t border-white/40">
            <div className="px-4 py-3 space-y-3">
              <button onClick={() => { scrollToSection('labs'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-900 font-semibold">Centers of Excellence</button>
              <button onClick={() => { scrollToSection('about'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-900 font-semibold">About Us</button>
              <Link href="/schedule-your-visit" onClick={() => setMobileMenuOpen(false)} className="inline-block bg-gradient-to-r from-blue-300 to-blue-700 text-white px-6 py-2 rounded-full font-semibold">
                Schedule Your Visit
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Section 1: Hero Section (light theme to match reference) */}
      <section className="relative pt-40 pb-16 bg-gradient-to-br from-cyan-200 via-blue-200 to-purple-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-extrabold text-gray-900 text-center mb-10 tracking-tight"
          >
            PSG Tech Platinum Jubilee Celebrations
          </motion.h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: Event Title */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight sm:whitespace-nowrap">
                PSG Tech Open House
              </h2>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2">2025</h3>
              <p className="text-lg md:text-xl text-gray-700 mt-6 max-w-2xl">
                Recognizing innovation and showcasing our world-class Centers of Excellence and research.
              </p>
              <div className="mt-8">
                <Link href="/schedule-your-visit" className="inline-block bg-gradient-to-r from-blue-300 to-blue-700 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-400 hover:to-blue-800 transition-colors duration-200">
                  Schedule Your Visit
                </Link>
              </div>
            </motion.div>

            {/* Right: Milestones and Logos */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center lg:items-end text-gray-900"
            >
              <p className="text-2xl md:text-3xl font-semibold mb-6">Celebrating Milestones</p>
              <div className="flex items-center gap-8">
                <img src="/images/logo1.png" alt="75 Years Logo" className="h-28 sm:h-32 md:h-36 w-auto" />
                <img src="/images/logo2.png" alt="100 Years Logo" className="h-28 sm:h-32 md:h-36 w-auto" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Open House & College Image */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-center lg:text-left"
            >
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Open House 2025
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Experience the pinnacle of technological education at PSG College of Technology.
                Join us in celebrating 75 years of excellence, innovation, and academic distinction.
                Explore our state-of-the-art laboratories, meet our distinguished faculty, and
                witness the future of engineering education.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => scrollToSection('labs')}
                  className="bg-gradient-to-r from-blue-300 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-400 hover:to-blue-800 transition-colors duration-200"
                >
                  Explore Labs
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-300 to-blue-700 text-white hover:from-blue-400 hover:to-blue-800 transition-all duration-200"
                >
                  Learn More
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1"
            >
              <img
                src="/images/background.jpg"
                alt="PSG College Campus"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 3: Lab Images Slideshow */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our World-Class Centers of Excellence
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Step into the future with our cutting-edge Centers of Excellence and research facilities
            </p>
          </motion.div>

          {labs.length > 0 && (
            <div
              className="relative max-w-5xl mx-auto"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              {/* Main Slideshow Container */}
              <div className="relative h-96 overflow-hidden rounded-2xl shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <img
                      src={labs[currentSlide]?.image}
                      alt={labs[currentSlide]?.labName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent">
                      <div className="absolute bottom-8 left-8 right-8">
                        <motion.div
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                        >
                          <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            {labs[currentSlide]?.labName}
                          </h3>
                          <p className="text-lg md:text-xl text-gray-300 mb-2">
                            {labs[currentSlide]?.departmentName}
                          </p>
                          <p className="text-gray-400 max-w-2xl">
                            {labs[currentSlide]?.description}
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-300 to-blue-700 hover:from-blue-400 hover:to-blue-800 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm hover:scale-110"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-300 to-blue-700 hover:from-blue-400 hover:to-blue-800 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm hover:scale-110"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Slide Counter */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                  {currentSlide + 1} / {labs.length}
                </div>
              </div>

              {/* Thumbnail Navigation */}
              <div className="flex justify-center mt-6 gap-2 overflow-x-auto pb-2">
                {labs.map((lab, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${index === currentSlide
                      ? 'border-blue-500 scale-110'
                      : 'border-transparent hover:border-gray-400'
                      }`}
                  >
                    <img
                      src={lab.image}
                      alt={lab.labName}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Progress Indicators */}
              <div className="flex justify-center mt-4 gap-2">
                {labs.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-300 ${index === currentSlide
                      ? 'w-8 bg-blue-500'
                      : 'w-2 bg-gray-600 hover:bg-gray-400'
                      }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 4: Search and Lab Cards */}
      <section id="labs" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explore Our Centers of Excellence
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Discover our comprehensive range of Centers of Excellence equipped with the latest technology
            </p>
          </motion.div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
            <input
              type="text"
              placeholder="Search Centers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-6 py-4 border-2 border-gray-600 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200 text-lg"
            />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-6 py-4 border-2 border-gray-600 rounded-full bg-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors duration-200 text-lg"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

            {/* Centers Cards */}
          {Object.keys(filteredLabsByDept).length > 0 ? (
            <div className="space-y-16">
              {Object.entries(filteredLabsByDept).map(([deptName, deptLabs]) => (
                <div key={deptName}>
                  <h3 className="text-3xl font-bold text-white mb-8 text-center">{deptName}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {deptLabs.map((lab, index) => (
                      <motion.div
                        key={lab.labName}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -10 }}
                        className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                      >
                        <img
                          src={lab.image}
                          alt={lab.labName}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                          <h4 className="text-xl font-bold text-white mb-3">{lab.labName}</h4>
                          <p className="text-gray-300 leading-relaxed">{lab.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-300">No centers found. Try adjusting your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Section 5: About Us with Google Maps */}
      <section id="about" className="py-20 bg-gradient-to-br from-blue-900 to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Contact Info and Map Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-grey bg-opacity-10 backdrop-blur-sm rounded-2xl p-8"
            >
              <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <MapPin className="text-blue-400" size={32} />
                Visit Us
              </h3>
              <div className="space-y-6">
                <div className="text-lg text-gray-200">
                  <p className="font-semibold text-xl text-white mb-2">PSG College of Technology</p>
                  <p>Peelamedu, Coimbatore - 641004</p>
                  <p>Tamil Nadu, India</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-200">
                    <Phone className="text-blue-400 flex-shrink-0" size={20} />
                    <span>+91 422 257 2177</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-200">
                    <Mail className="text-blue-400 flex-shrink-0" size={20} />
                    <span>principal@psgtech.edu</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-200">
                    <Globe className="text-blue-400 flex-shrink-0" size={20} />
                    <span>www.psgtech.edu</span>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* Google Maps */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-4 h-96"
            >
              <a
                href="https://www.google.com/maps?q=PSG+College+of+Technology,+Peelamedu,+Coimbatore"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.3242388023277!2d76.99924757421032!3d11.02983005551943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859a52de83145%3A0xeff1142c5a38bcf!2sPSG%20College%20of%20Technology!5e0!3m2!1sen!2sin!4v1685264407515!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="pointer-events-none w-full h-full rounded-2xl"
                />
              </a>

            </motion.div>
          </div>
        </div>
      </section>
      {/* Booking modal removed; use /schedule-your-visit page */}
      
      <style jsx global>{`
        .font-attractive {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-weight: 600;
        }
      `}</style>
      <footer className="bg-gray-900 py-8 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 PSG College of Technology. All rights reserved. | Platinum Jubilee Celebrations
          </p>
        </div>
      </footer>

    </div>
  );
}