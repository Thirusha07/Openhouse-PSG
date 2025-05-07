'use client'; // Add this directive at the top of the file


import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Department {
  name: string;
  location: string;
  image: string;
  description: string;
  capacity: number;
  booked: number;
}

const initialDepartments: Department[] = [
  {
    name: "Applied Mathematics and Computational Sciences Lab",
    location: "Stony Brook University",
    image: "/images/applied_mathematics_lab.jpg", // Replace with actual image URL
    description: "Explore mathematical modeling and computational tools.",
    capacity: 50,
    booked: 0,
  },
  {
    name: "Applied Science Lab",
    location: "Various Institutions",
    image: "/images/applied_science_lab.jpg", // Replace with actual image URL
    description: "Witness practical applications of scientific principles.",
    capacity: 60,
    booked: 0,
  },
  {
    name: "Apparel and Fashion Design Studio",
    location: "Fashion Institutes",
    image: "/images/apparel_fashion_studio.jpg", // Replace with actual image URL
    description: "Discover the creative world of fashion design and production.",
    capacity: 40,
    booked: 0,
  },
  {
    name: "Automobile Engineering Workshop",
    location: "Engineering Colleges",
    image: "/images/automobile_engineering_workshop.jpg", // Replace with actual image URL
    description: "Get hands-on with vehicle design and engineering.",
    capacity: 70,
    booked: 0,
  },
  {
    name: "Biomedical Engineering Lab",
    location: "Various Universities",
    image: "/images/biomedical_engineering_lab.jpg", // Replace with actual image URL
    description: "See how engineering innovates healthcare solutions.",
    capacity: 55,
    booked: 0,
  },
  {
    name: "Civil Engineering Structures Lab",
    location: "Engineering Schools",
    image: "/images/civil_engineering_lab.jpg", // Replace with actual image URL
    description: "Understand the principles of structural design and testing.",
    capacity: 80,
    booked: 0,
  },
  {
    name: "Computer Science & Engineering Lab",
    location: "Tech Universities",
    image: "/images/computer_science_lab.jpg", // Replace with actual image URL
    description: "Experience cutting-edge computer systems and software development.",
    capacity: 90,
    booked: 0,
  },
  {
    name: "Computer Applications Lab",
    location: "Various Institutions",
    image: "/images/computer_applications_lab.jpg", // Replace with actual image URL
    description: "Explore practical applications of computer software.",
    capacity: 100,
    booked: 0,
  },
  {
    name: "Electrical & Electronics Engineering Lab",
    location: "Engineering Colleges",
    image: "/images/electrical_engineering_lab.jpg", // Replace with actual image URL
    description: "Witness experiments in electricity, electronics, and electromagnetism.",
    capacity: 65,
    booked: 0,
  },
  {
    name: "Electronics & Communication Engineering Lab",
    location: "Tech Universities",
    image: "/images/electronics_communication_lab.jpg", // Replace with actual image URL
    description: "Discover the world of electronic devices and communication systems.",
    capacity: 75,
    booked: 0,
  },
  {
    name: "Instrumentation & Control Engineering Lab",
    location: "Engineering Schools",
    image: "/images/instrumentation_control_lab.jpg", // Replace with actual image URL
    description: "See how instruments and control systems drive industrial processes.",
    capacity: 45,
    booked: 0,
  },
  {
    name: "Mechanical Engineering Workshop",
    location: "Engineering Colleges",
    image: "/images/mechanical_engineering_workshop.jpg", // Replace with actual image URL
    description: "Engage with the design and manufacturing of mechanical systems.",
    capacity: 85,
    booked: 0,
  },
  {
    name: "Metallurgical Engineering Lab",
    location: "Engineering Schools",
    image: "/images/metallurgical_engineering_lab.jpg", // Replace with actual image URL
    description: "Study the fascinating properties and processing of metals.",
    capacity: 50,
    booked: 0,
  },
  {
    name: "Production Engineering Workshop",
    location: "Various Institutions",
    image: "/images/production_engineering_workshop.jpg", // Replace with actual image URL
    description: "Understand the intricacies of modern production processes.",
    capacity: 60,
    booked: 0,
  },
  {
    name: "Robotics & Automation Engineering Lab",
    location: "Tech Universities",
    image: "/images/robotics_automation_lab.jpg", // Replace with actual image URL
    description: "Explore the exciting field of robotics and automation technologies.",
    capacity: 70,
    booked: 0,
  },
  {
    name: "Biotechnology Lab",
    location: "Various Universities",
    image: "/images/biotechnology_lab.jpg", // Replace with actual image URL
    description: "Witness the intersection of biology and technology.",
    capacity: 55,
    booked: 0,
  },
  {
    name: "Fashion Technology Lab",
    location: "Fashion Institutes",
    image: "/images/fashion_technology_lab.jpg", // Replace with actual image URL
    description: "Discover the technological advancements in the fashion industry.",
    capacity: 40,
    booked: 0,
  },
  {
    name: "Information Technology Lab",
    location: "Tech Universities",
    image: "/images/information_technology_lab.jpg", // Replace with actual image URL
    description: "Explore the management of information systems and data.",
    capacity: 95,
    booked: 0,
  },
  {
    name: "Textile Technology Lab",
    location: "Textile Institutes",
    image: "/images/textile_technology_lab.jpg", // Replace with actual image URL
    description: "Learn about the production and processing of textiles.",
    capacity: 65,
    booked: 0,
  },
  {
    name: "Electrical & Electronics Engineering (Sandwich) Lab",
    location: "Engineering Colleges",
    image: "/images/electrical_sandwich_lab.jpg", // Replace with actual image URL
    description: "Experience practical industrial training in electrical and electronics.",
    capacity: 50,
    booked: 0,
  },
  {
    name: "Mechanical Engineering (Sandwich) Workshop",
    location: "Engineering Schools",
    image: "/images/mechanical_sandwich_workshop.jpg", // Replace with actual image URL
    description: "Engage in industry-focused mechanical engineering practices.",
    capacity: 70,
    booked: 0,
  },
  {
    name: "Production Engineering (Sandwich) Workshop",
    location: "Various Institutions",
    image: "/images/production_sandwich_workshop.jpg", // Replace with actual image URL
    description: "Get hands-on with production processes in a real-world setting.",
    capacity: 60,
    booked: 0,
  },
];

const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i);
const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' }));
const days = Array.from({ length: 31 }, (_, i) => i + 1);

export default function HomePage() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedLabForBooking, setSelectedLabForBooking] = useState<Department | null>(null);
  const [bookingFormData, setBookingFormData] = useState({
    institute: '',
    name: '',
    email: '',
    students: '',
    year: String(new Date().getFullYear()),
    month: months[new Date().getMonth()],
    day: String(new Date().getDate()),
    idProofImage: null as File | null | undefined,
  });
  const [bookingError, setBookingError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [idProofPreview, setIdProofPreview] = useState<string | null>(null);

  useEffect(() => {
    const savedDepartments = localStorage.getItem('openHouseDepartments');
    if (savedDepartments) {
      setDepartments(JSON.parse(savedDepartments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('openHouseDepartments', JSON.stringify(departments));
  }, [departments]);

  const handleInputChange = (e: any) => {
    setBookingFormData({ ...bookingFormData, [e.target.name]: e.target.value });
  };

  const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 2 * 1024 * 1024) {
      setBookingError('Image size must be less than 2MB.');
      setBookingFormData({ ...bookingFormData, idProofImage: null });
      setIdProofPreview(null);
      return;
    }
    setBookingFormData({ ...bookingFormData, idProofImage: file });
    setBookingError('');
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setIdProofPreview(null);
    }
  };

  const handleRegisterClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBookingModalOpen(false);
    setBookingFormData({
      institute: '',
      name: '',
      email: '',
      students: '',
      year: String(new Date().getFullYear()),
      month: months[new Date().getMonth()],
      day: String(new Date().getDate()),
      idProofImage: null,
    });
    setBookingError('');
    setRegistrationSuccess(false);
    setIdProofPreview(null);
  };

  const handleVerifyEmail = () => {
    alert('Verification email sent! Please check your inbox.');
  };

  const handleRegistrationSubmit = () => {
    alert('Registration submitted!');
    setIsModalOpen(false);
    setRegistrationSuccess(true);
    // You can add logic here to actually send the registration data
  };

  const handleRequestVisit = (department: Department) => {
    setSelectedLabForBooking(department);
    setBookingModalOpen(true);
    setBookingError('');
    setBookingFormData({
      ...bookingFormData,
      students: '',
      idProofImage: undefined,
      year: String(new Date().getFullYear()),
      month: months[new Date().getMonth()],
      day: String(new Date().getDate()),
    });
    setIdProofPreview(null);
  };

  const handleBookingSubmit = () => {
    if (!selectedLabForBooking) return;

    const requestedStudents = parseInt(bookingFormData.students, 10);
    if (isNaN(requestedStudents) || requestedStudents <= 0 || requestedStudents > 100) {
      setBookingError('Please enter a valid number of students (1-100).');
      return;
    }

    if (!bookingFormData.idProofImage) {
      setBookingError('Please upload a valid ID Proof image (less than 2MB).');
      return;
    }

    if (selectedLabForBooking.booked + requestedStudents > selectedLabForBooking.capacity) {
      setBookingError(`Sorry, only ${selectedLabForBooking.capacity - selectedLabForBooking.booked} slots are available for ${selectedLabForBooking.name}.`);
      return;
    }

    const selectedDate = `<span class="math-inline">\{bookingFormData\.year\}\-</span>{months.indexOf(bookingFormData.month) + 1}-${bookingFormData.day}`;
    console.log('Booking Form Data:', { ...bookingFormData, date: selectedDate }); // For demonstration

    setDepartments((prevDepartments) =>
      prevDepartments.map((dept) =>
        dept.name === selectedLabForBooking.name
          ? { ...dept, booked: dept.booked + requestedStudents }
          : dept
      )
    );

    setBookingModalOpen(false);
    alert(`Visit to ${selectedLabForBooking.name} booked for ${requestedStudents} students on ${selectedDate} with ID Proof uploaded!`);
    setBookingFormData({
      institute: '',
      name: '',
      email: '',
      students: '',
      year: String(new Date().getFullYear()),
      month: months[new Date().getMonth()],
      day: String(new Date().getDate()),
      idProofImage: undefined,
    });
    setIdProofPreview(null);
  };

  const filteredDepartments = departments.filter((dept) =>
    (dept.name.toLowerCase().includes(search.toLowerCase()) || search === '') &&
    (selectedDepartment === '' || dept.name === selectedDepartment)
  );

  return (
    <div className="h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/background.jpg')" }}>
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70"></div>
      <div className="relative z-10 p-6">
        {/* Title and Register Now */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold text-center text-white mb-6 font-attractive"
        >
          PSG Open House 2025
        </motion.h1>

        {/* Search and Filter */}
        <div className="mt-8 flex justify-center gap-4">
          <input
            type="text"
            placeholder="Search labs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 border border-gray-700 rounded-md bg-gray-800 text-white font-light"
          />
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="p-3 border border-gray-700 rounded-md bg-gray-800 text-white font-light"
          >
            <option value="">All Labs</option>
            {departments.map((dept) => (
              <option key={dept.name} value={dept.name}>{dept.name}</option>
            ))}
          </select>
        </div>

        {/* Department Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDepartments.map((dept) => (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <img src={dept.image} alt={dept.name} className="w-full h-48 object-cover rounded-md mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2 font-attractive">{dept.name}</h2>
                <p className="text-gray-400 mb-2 text-sm">{dept.location}</p>
                <p className="text-gray-300 mb-3 text-sm">{dept.description}</p>
              </div>
              <button
                onClick={() => handleRequestVisit(dept)}
                className={`bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-600 transition-colors duration-200 self-end ${dept.capacity - dept.booked <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={dept.capacity - dept.booked <= 0}
              >
                Request Visit
              </button>
            </motion.div>
          ))}
        </div>

        {/* Booking Modal */}
        {bookingModalOpen && selectedLabForBooking && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900 p-8 rounded-lg shadow-lg w-120 max-w-md"
            >
              <h2 className="text-2xl font-bold text-white mb-4 font-attractive">Request Visit to {selectedLabForBooking.name}</h2>
              <input type="text" name="institute" placeholder="Institute Name" value={bookingFormData.institute} onChange={handleInputChange} className="w-full p-3 mb-3 rounded bg-gray-800 text-white font-light" />
              <input type="text" name="name" placeholder="Your Name (Teacher/Coordinator)" value={bookingFormData.name} onChange={handleInputChange} className="w-full p-3 mb-3 rounded bg-gray-800 text-white font-light" />
              <div className="flex gap-2 mb-3">
                <input type="email" name="email" placeholder="Email" value={bookingFormData.email} onChange={handleInputChange} className="w-full p-3 rounded bg-gray-800 text-white font-light" />
                <button onClick={handleVerifyEmail} className="bg-yellow-500 text-white px-4 py-2 rounded font-semibold hover:bg-yellow-600">Verify</button>
              </div>
              <input
                type="number"
                name="students"
                placeholder="Number of Students (Max 100)"
                value={bookingFormData.students}
                onChange={handleInputChange}
                className="w-full p-3 mb-3 rounded bg-gray-800 text-white font-light"
                min="1"
                max="100"
              />
              <div className="flex gap-2 mb-3">
                <select
                  name="day"
                  value={bookingFormData.day}
                  onChange={handleInputChange}
                  className="p-3 border border-gray-700 rounded-md bg-gray-800 text-white font-light"
                >
                  {days.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select
                  name="month"
                  value={bookingFormData.month}
                  onChange={handleInputChange}
                  className="p-3 border border-gray-700 rounded-md bg-gray-800 text-white font-light"
                >
                  {months.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select
                  name="year"
                  value={bookingFormData.year}
                  onChange={handleInputChange}
                  className="p-3 border border-gray-700 rounded-md bg-gray-800 text-white font-light"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="idProofImage" className="block text-gray-300 text-sm font-bold mb-2">Upload ID Proof Image (Max 2MB)</label>
                <input
                  type="file"
                  id="idProofImage"
                  name="idProofImage"
                  accept="image/*"
                  onChange={handleIdProofChange}
                  className="w-full p-3 rounded bg-gray-800 text-white font-light"
                />
                {idProofPreview && (
                  <div className="mt-2">
                    <h4 className="text-gray-300 text-sm font-semibold">ID Proof Preview:</h4>
                    <img src={idProofPreview} alt="ID Proof Preview" className="max-w-full h-auto rounded-md" style={{ maxHeight: '100px' }} />
                  </div>
                )}
              </div>
              {bookingError && <p className="text-red-500 mb-3">{bookingError}</p>}
              <div className="flex justify-end gap-4">
                <button onClick={handleCloseModal} className="bg-red-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-red-600">Cancel</button>
                <button
                  onClick={handleBookingSubmit}
                  className="bg-green-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-600"
                  disabled={selectedLabForBooking && (isNaN(parseInt(bookingFormData.students, 10)) || parseInt(bookingFormData.students, 10) <= 0 || parseInt(bookingFormData.students, 10) > 100 || !bookingFormData.idProofImage)}
                >
                  Book Visit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
      <style jsx global>{`
        .font-attractive {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}