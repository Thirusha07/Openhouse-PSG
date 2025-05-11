
'use client'; // Add this directive at the top of the file

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Lab {
  labName: string;
  departmentName: string;
  description: string;
  image: string;
}

type Schedule = {
  _id: string;
  date: string;
  capacity: number;
};


export default function HomePage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    institute: '',
    name: '',
    email: '',
    students: '',
    scheduleId: "",
    idProofImage: null as File | null | undefined,
    mobileNumber: '',
    proof: ''
  });

  const [availableSchedules, setAvailableSchedules] = useState<Schedule[]>([]);
  const [bookingError, setBookingError] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [filteredLabsByDept, setFilteredLabsByDept] = useState<Record<string, Lab[]>>({});
  const [idProofPreview, setIdProofPreview] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isEmailVerified, setIsEmailVerified] = useState(false);


  // Fetch labs from API
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


  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await fetch('/api/schedule/fetch-schedule');
        const data: { schedules: Schedule[] } = await res.json();
        setAvailableSchedules(Array.isArray(data.schedules) ? data.schedules : []);
      } catch (err) {
        console.error("Failed to fetch schedules", err);
      }
    };
    fetchSchedules();
  }, []);


  const handleInputChange = (e: any) => {
    setBookingFormData({ ...bookingFormData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const scheduleId = e.target.value;
    const schedule = availableSchedules.find((s) => s._id.toString() === scheduleId) || null;
    setBookingFormData((prev) => ({ ...prev, scheduleId }));
    setSelectedSchedule(schedule);
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBookingModalOpen(false);
    setBookingFormData({
      institute: '',
      name: '',
      email: '',
      students: '',
      scheduleId: '',
      idProofImage: null,
      mobileNumber: '',
      proof: ''
    });
    setBookingError('');
    setRegistrationSuccess(false);
    setIdProofPreview(null);
  };

  const handleVerifyEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setEmailVerificationStatus("loading");

    setTimeout(() => {
      if (emailRegex.test(bookingFormData.email)) {
        setEmailVerificationStatus("success");
        setIsEmailVerified(true);
      } else {
        setEmailVerificationStatus("error");
        setIsEmailVerified(false);
      }
    }, 1000); // simulate async check delay
  };

  const handleRequestVisit = () => {
    setBookingModalOpen(true);
    setBookingError('');
    setBookingFormData({
      ...bookingFormData,
      students: '',
      idProofImage: undefined,
      scheduleId: ''
    });
    setIdProofPreview(null);
  };

  const handleBookingSubmit = async () => {
    if (!bookingFormData.idProofImage) return;

    if (!selectedSchedule) {
      alert("Please select a date.");
      return;
    }

    if (parseInt(bookingFormData.students) > selectedSchedule.capacity) {
      alert("Number of students exceeds the available capacity for the selected date.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", bookingFormData.email);
      formData.append("institutionName", bookingFormData.institute);
      formData.append("scheduleId", bookingFormData.scheduleId);
      formData.append("numberOfMembers", bookingFormData.students);
      formData.append("representativeName", bookingFormData.name);
      formData.append("mobileNumber", bookingFormData.mobileNumber);
      formData.append("proof", bookingFormData.idProofImage); // File object

      const res = await fetch("/api/request/create-request", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        alert("Visit request submitted successfully!");
        handleCloseModal();
      } else {
        throw new Error(result.error || "Failed to submit request");
      }
    } catch (err: any) {
      console.error("Submit Error:", err);
      setBookingError(err.message || "An unexpected error occurred.");
    }
  };

  const isFormValid = () => {
    const {
      institute,
      name,
      email,
      mobileNumber,
      students,
      scheduleId,
      idProofImage,
    } = bookingFormData;

    const studentCount = parseInt(students, 10);

    return (
      institute.trim() &&
      name.trim() &&
      email.trim() &&
      mobileNumber.trim().length === 10 &&
      !isNaN(studentCount) &&
      studentCount > 0 &&
      studentCount <= 100 &&
      scheduleId &&
      idProofImage
    );
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

    // Group by department
    const grouped = filtered.reduce((acc: Record<string, Lab[]>, lab) => {
      if (!acc[lab.departmentName]) acc[lab.departmentName] = [];
      acc[lab.departmentName].push(lab);
      return acc;
    }, {});

    setFilteredLabsByDept(grouped);
  }, [labs, search, selectedDepartment]);



  return (
    <div className="h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/background.jpg')" }}>
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70"></div>
      <div className="relative z-10 p-6">
        <div className="flex flex-col items-center justify-center mb-6">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white font-bold text-center mb-6 font-attractive"
          >
            <div className="flex items-center justify-center">
              <img
                src="/images/logo.jpg"
                alt="PSG Logo"
                className="h-20 mr-4"
              />
              <span className="text-5xl">PSG College of Technology</span>
              <br />
              <br />
            </div>
            <span className="text-4xl">Platinum Jubilee Celebrations</span>
            <br />
            <br />
            <span className="text-3xl">PSG Open House 2025</span>
            <br />
            <br />
            <button
              onClick={() => handleRequestVisit()}
              className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-600 transition-colors duration-200 self-end"
            >
              Request Visit
            </button>
          </motion.h1>
        </div>

        <div className="mt-6 w-full">
          <img src="/images/background.jpg"
            alt="Background Below Search"
            className="w-full h-auto shadow-md"
            style={{ maxHeight: '500px' }}
          />
        </div>

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
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-10 flex justify-center">
            <div className="text-white text-xl">Loading labs...</div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="mt-10 flex justify-center">
            <div className="text-red-500 text-xl">Error: {error}</div>
          </div>
        )}
        

        {/* Department Cards */}
        {!isLoading && !error && Object.keys(filteredLabsByDept).length > 0 ? (
          <div className="mt-10">
            {Object.entries(filteredLabsByDept).map(([deptName, deptLabs]) => (
              <div key={deptName}>
                <h2 className="text-white text-2xl font-bold mb-4">{deptName}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {deptLabs.map((lab) => (
                    <motion.div
                      key={lab.labName}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg flex flex-col justify-between"
                    >
                      <img
                        src={lab.image || "/images/default_lab.jpg"}
                        alt={lab.labName}
                        className="w-full h-48 object-cover rounded-md mb-4"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "/images/default_lab.jpg";
                        }}
                      />
                      <h3 className="text-xl font-semibold text-white mb-2">{lab.labName}</h3>
                      <p className="text-gray-300 text-sm">{lab.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : !isLoading && !error && (
          <div className="mt-10 flex justify-center">
            <p className="text-white text-xl">No labs found. Try adjusting your search.</p>
          </div>
        )}


        {/* Booking Modal */}
        {bookingModalOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900 p-8 rounded-lg shadow-lg w-120 max-w-md max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-white mb-4 font-attractive">Request Visit </h2>
              <input type="text" name="institute" placeholder="Institute Name" value={bookingFormData.institute} onChange={handleInputChange} className="w-full p-3 mb-3 rounded bg-gray-800 text-white font-light" />
              <input type="text" name="name" placeholder="Your Name (Teacher/Coordinator)" value={bookingFormData.name} onChange={handleInputChange} className="w-full p-3 mb-3 rounded bg-gray-800 text-white font-light" />
              <div className="flex gap-2 mb-3 items-center">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={bookingFormData.email}
                  onChange={(e) => {
                    setBookingFormData({ ...bookingFormData, email: e.target.value });
                    setEmailVerificationStatus("idle"); // reset status on change
                    setIsEmailVerified(false);
                  }}
                  className="w-full p-3 rounded bg-gray-800 text-white font-light"
                />
                <button
                  onClick={handleVerifyEmail}
                  disabled={!bookingFormData.email}
                  className={`px-4 py-2 rounded font-semibold ${bookingFormData.email
                      ? "bg-yellow-500 text-white hover:bg-yellow-600"
                      : "bg-gray-500 text-white cursor-not-allowed"
                    }`}
                >
                  Verify
                </button>
                {emailVerificationStatus === "loading" && <span className="text-yellow-400 animate-spin">🔄</span>}
                {emailVerificationStatus === "success" && <span className="text-green-400">✔️</span>}
                {emailVerificationStatus === "error" && <span className="text-red-400">❌</span>}
              </div>
              <input
                type="tel"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={bookingFormData.mobileNumber}
                onChange={handleInputChange}
                className="w-full p-3 mb-3 rounded bg-gray-800 text-white font-light"
                pattern="[0-9]{10}"
                maxLength={10}
                required
              />
              <div className="mb-3">
                <label className="block text-white mb-1">Select a Visit Date</label>
                <select
                  name="scheduleId"
                  value={bookingFormData.scheduleId}
                  onChange={handleDateChange}
                  className="w-full p-3 rounded bg-gray-800 text-white font-light"
                >
                  <option value="">Select a date</option>
                  {Array.isArray(availableSchedules) && availableSchedules.length > 0 ? (
                    availableSchedules.map((schedule) => (
                      <option key={schedule._id} value={schedule._id}>
                        {new Date(schedule.date).toLocaleDateString()}
                      </option>
                    ))
                  ) : (
                    <option disabled>Loading available dates...</option>
                  )}
                </select>
                {selectedSchedule && (
                  <p className="text-sm text-gray-300 mt-1">
                    Capacity: {selectedSchedule.capacity}
                  </p>
                )}
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
                  className={`px-6 py-2 rounded-md font-semibold transition-colors duration-200 ${isFormValid() && isEmailVerified
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-600 text-white cursor-not-allowed"
                    }`}
                  disabled={!(isFormValid() && isEmailVerified)}
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