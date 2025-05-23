
// 'use client'; // Add this directive at the top of the file

// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';

// interface Lab {
//   labName: string;
//   departmentName: string;
//   description: string;
//   image: string;
// }

// type Schedule = {
//   _id: string;
//   date: string;
//   capacity: number;
// };


// export default function HomePage() {
//   const [labs, setLabs] = useState<Lab[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [search, setSearch] = useState('');
//   const [selectedDepartment, setSelectedDepartment] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [bookingModalOpen, setBookingModalOpen] = useState(false);
//   const [bookingFormData, setBookingFormData] = useState({
//     institute: '',
//     name: '',
//     email: '',
//     students: '',
//     scheduleId: "",
//     idProofImage: null as File | null | undefined,
//     mobileNumber: '',
//     proof: ''
//   });

//   const [availableSchedules, setAvailableSchedules] = useState<Schedule[]>([]);
//   const [bookingError, setBookingError] = useState('');
//   const [departments, setDepartments] = useState<string[]>([]);
//   const [registrationSuccess, setRegistrationSuccess] = useState(false);
//   const [filteredLabsByDept, setFilteredLabsByDept] = useState<Record<string, Lab[]>>({});
//   const [idProofPreview, setIdProofPreview] = useState<string | null>(null);
//   const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
//   const [emailVerificationStatus, setEmailVerificationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
//   const [isEmailVerified, setIsEmailVerified] = useState(false);


//   // Fetch labs from API
//   useEffect(() => {
//     const fetchLabs = async () => {
//       try {
//         setIsLoading(true);
//         const res = await fetch('/api/lab/fetch-lab');
//         const data: { labs: Lab[] } = await res.json();
//         setLabs(data.labs);

//         // Extract unique departments
//         const uniqueDepartments: string[] = [
//         ...new Set(data.labs.map((lab) => lab.departmentName))
//       ];
//         setDepartments(uniqueDepartments);
//       } catch (err) {
//         setError("Failed to fetch labs");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchLabs();
//   }, []);


//   useEffect(() => {
//     const fetchSchedules = async () => {
//       try {
//         const res = await fetch('/api/schedule/fetch-schedule');
//         const data: { schedules: Schedule[] } = await res.json();
//         setAvailableSchedules(Array.isArray(data.schedules) ? data.schedules : []);
//       } catch (err) {
//         console.error("Failed to fetch schedules", err);
//       }
//     };
//     fetchSchedules();
//   }, []);


//   const handleInputChange = (e: any) => {
//     setBookingFormData({ ...bookingFormData, [e.target.name]: e.target.value });
//   };

//   const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const scheduleId = e.target.value;
//     const schedule = availableSchedules.find((s) => s._id.toString() === scheduleId) || null;
//     setBookingFormData((prev) => ({ ...prev, scheduleId }));
//     setSelectedSchedule(schedule);
//   };

//   const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file && file.size > 2 * 1024 * 1024) {
//       setBookingError('Image size must be less than 2MB.');
//       setBookingFormData({ ...bookingFormData, idProofImage: null });
//       setIdProofPreview(null);
//       return;
//     }
//     setBookingFormData({ ...bookingFormData, idProofImage: file });
//     setBookingError('');
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setIdProofPreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     } else {
//       setIdProofPreview(null);
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setBookingModalOpen(false);
//     setBookingFormData({
//       institute: '',
//       name: '',
//       email: '',
//       students: '',
//       scheduleId: '',
//       idProofImage: null,
//       mobileNumber: '',
//       proof: ''
//     });
//     setBookingError('');
//     setRegistrationSuccess(false);
//     setIdProofPreview(null);
//   };

//   const handleVerifyEmail = () => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     setEmailVerificationStatus("loading");

//     setTimeout(() => {
//       if (emailRegex.test(bookingFormData.email)) {
//         setEmailVerificationStatus("success");
//         setIsEmailVerified(true);
//       } else {
//         setEmailVerificationStatus("error");
//         setIsEmailVerified(false);
//       }
//     }, 1000); // simulate async check delay
//   };

//   const handleRequestVisit = () => {
//     setBookingModalOpen(true);
//     setBookingError('');
//     setBookingFormData({
//       ...bookingFormData,
//       students: '',
//       idProofImage: undefined,
//       scheduleId: ''
//     });
//     setIdProofPreview(null);
//   };

//   const handleBookingSubmit = async () => {
//     if (!bookingFormData.idProofImage) return;

//     if (!selectedSchedule) {
//       alert("Please select a date.");
//       return;
//     }

//     if (parseInt(bookingFormData.students) > selectedSchedule.capacity) {
//       alert("Number of students exceeds the available capacity for the selected date.");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("email", bookingFormData.email);
//       formData.append("institutionName", bookingFormData.institute);
//       formData.append("scheduleId", bookingFormData.scheduleId);
//       formData.append("numberOfMembers", bookingFormData.students);
//       formData.append("representativeName", bookingFormData.name);
//       formData.append("mobileNumber", bookingFormData.mobileNumber);
//       formData.append("proof", bookingFormData.idProofImage); // File object

//       const res = await fetch("/api/request/create-request", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await res.json();

//       if (res.ok) {
//         alert("Visit request submitted successfully!");
//         handleCloseModal();
//       } else {
//         throw new Error(result.error || "Failed to submit request");
//       }
//     } catch (err: any) {
//       console.error("Submit Error:", err);
//       setBookingError(err.message || "An unexpected error occurred.");
//     }
//   };

//   const isFormValid = () => {
//     const {
//       institute,
//       name,
//       email,
//       mobileNumber,
//       students,
//       scheduleId,
//       idProofImage,
//     } = bookingFormData;

//     const studentCount = parseInt(students, 10);

//     return (
//       institute.trim() &&
//       name.trim() &&
//       email.trim() &&
//       mobileNumber.trim().length === 10 &&
//       !isNaN(studentCount) &&
//       studentCount > 0 &&
//       studentCount <= 100 &&
//       scheduleId &&
//       idProofImage
//     );
//   };

//   useEffect(() => {
//     const filtered = labs.filter(lab => {
//       const matchesDepartment = selectedDepartment ? lab.departmentName === selectedDepartment : true;
//       const matchesSearch = search
//         ? lab.labName.toLowerCase().includes(search.toLowerCase()) ||
//         lab.description.toLowerCase().includes(search.toLowerCase())
//         : true;
//       return matchesDepartment && matchesSearch;
//     });

//     // Group by department
//     const grouped = filtered.reduce((acc: Record<string, Lab[]>, lab) => {
//       if (!acc[lab.departmentName]) acc[lab.departmentName] = [];
//       acc[lab.departmentName].push(lab);
//       return acc;
//     }, {});

//     setFilteredLabsByDept(grouped);
//   }, [labs, search, selectedDepartment]);



//   return (
//     <div className="h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/background.jpg')" }}>
//       <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70"></div>
//       <div className="relative z-10 p-6">
//         <div className="flex flex-col items-center justify-center mb-6">
//           <motion.h1
//             initial={{ opacity: 0, y: -50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-white font-bold text-center mb-6 font-attractive"
//           >
//             <div className="flex items-center justify-center">
//               <img
//                 src="/images/logo.jpg"
//                 alt="PSG Logo"
//                 className="h-20 mr-4"
//               />
//               <span className="text-5xl">PSG College of Technology</span>
//               <br />
//               <br />
//             </div>
//             <span className="text-4xl">Platinum Jubilee Celebrations</span>
//             <br />
//             <br />
//             <span className="text-3xl">PSG Open House 2025</span>
//             <br />
//             <br />
//             <button
//               onClick={() => handleRequestVisit()}
//               className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-600 transition-colors duration-200 self-end"
//             >
//               Request Visit
//             </button>
//           </motion.h1>
//         </div>

//         <div className="mt-6 w-full">
//           <img src="/images/background.jpg"
//             alt="Background Below Search"
//             className="w-full h-auto shadow-md"
//             style={{ maxHeight: '500px' }}
//           />
//         </div>

//         {/* Search and Filter */}
//         <div className="mt-8 flex justify-center gap-4">
//           <input
//             type="text"
//             placeholder="Search labs..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="p-3 border border-gray-700 rounded-md bg-gray-800 text-white font-light"
//           />
//           <select
//             value={selectedDepartment}
//             onChange={(e) => setSelectedDepartment(e.target.value)}
//             className="p-3 border border-gray-700 rounded-md bg-gray-800 text-white font-light"
//           >
//             <option value="">All Labs</option>
//             {departments.map((dept) => (
//               <option key={dept} value={dept}>{dept}</option>
//             ))}
//           </select>
//         </div>

//         {/* Loading State */}
//         {isLoading && (
//           <div className="mt-10 flex justify-center">
//             <div className="text-white text-xl">Loading labs...</div>
//           </div>
//         )}

//         {/* Error State */}
//         {error && !isLoading && (
//           <div className="mt-10 flex justify-center">
//             <div className="text-red-500 text-xl">Error: {error}</div>
//           </div>
//         )}


//         {/* Department Cards */}
//         {!isLoading && !error && Object.keys(filteredLabsByDept).length > 0 ? (
//           <div className="mt-10">
//             {Object.entries(filteredLabsByDept).map(([deptName, deptLabs]) => (
//               <div key={deptName}>
//                 <h2 className="text-white text-2xl font-bold mb-4">{deptName}</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {deptLabs.map((lab) => (
//                     <motion.div
//                       key={lab.labName}
//                       initial={{ opacity: 0, scale: 0.9 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       transition={{ duration: 0.4 }}
//                       className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg flex flex-col justify-between"
//                     >
//                       <img
//                         src={lab.image || "/images/default_lab.jpg"}
//                         alt={lab.labName}
//                         className="w-full h-48 object-cover rounded-md mb-4"
//                         onError={(e) => {
//                           const target = e.target as HTMLImageElement;
//                           target.onerror = null;
//                           target.src = "/images/default_lab.jpg";
//                         }}
//                       />
//                       <h3 className="text-xl font-semibold text-white mb-2">{lab.labName}</h3>
//                       <p className="text-gray-300 text-sm">{lab.description}</p>
//                     </motion.div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : !isLoading && !error && (
//           <div className="mt-10 flex justify-center">
//             <p className="text-white text-xl">No labs found. Try adjusting your search.</p>
//           </div>
//         )}


//         {/* Booking Modal */}
//         {bookingModalOpen && (
//           <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
//             <motion.div
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="bg-gray-900 p-8 rounded-lg shadow-lg w-120 max-w-md max-h-[90vh] overflow-y-auto"
//             >
//               <h2 className="text-2xl font-bold text-white mb-4 font-attractive">Request Visit </h2>
//               <input type="text" name="institute" placeholder="Institute Name" value={bookingFormData.institute} onChange={handleInputChange} className="w-full p-3 mb-3 rounded bg-gray-800 text-white font-light" />
//               <input type="text" name="name" placeholder="Your Name (Teacher/Coordinator)" value={bookingFormData.name} onChange={handleInputChange} className="w-full p-3 mb-3 rounded bg-gray-800 text-white font-light" />
//               <div className="flex gap-2 mb-3 items-center">
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Email"
//                   value={bookingFormData.email}
//                   onChange={(e) => {
//                     setBookingFormData({ ...bookingFormData, email: e.target.value });
//                     setEmailVerificationStatus("idle"); // reset status on change
//                     setIsEmailVerified(false);
//                   }}
//                   className="w-full p-3 rounded bg-gray-800 text-white font-light"
//                 />
//                 <button
//                   onClick={handleVerifyEmail}
//                   disabled={!bookingFormData.email}
//                   className={`px-4 py-2 rounded font-semibold ${bookingFormData.email
//                       ? "bg-yellow-500 text-white hover:bg-yellow-600"
//                       : "bg-gray-500 text-white cursor-not-allowed"
//                     }`}
//                 >
//                   Verify
//                 </button>
//                 {emailVerificationStatus === "loading" && <span className="text-yellow-400 animate-spin">🔄</span>}
//                 {emailVerificationStatus === "success" && <span className="text-green-400">✔️</span>}
//                 {emailVerificationStatus === "error" && <span className="text-red-400">❌</span>}
//               </div>
//               <input
//                 type="tel"
//                 name="mobileNumber"
//                 placeholder="Mobile Number"
//                 value={bookingFormData.mobileNumber}
//                 onChange={handleInputChange}
//                 className="w-full p-3 mb-3 rounded bg-gray-800 text-white font-light"
//                 pattern="[0-9]{10}"
//                 maxLength={10}
//                 required
//               />
//               <div className="mb-3">
//                 <label className="block text-white mb-1">Select a Visit Date</label>
//                 <select
//                   name="scheduleId"
//                   value={bookingFormData.scheduleId}
//                   onChange={handleDateChange}
//                   className="w-full p-3 rounded bg-gray-800 text-white font-light"
//                 >
//                   <option value="">Select a date</option>
//                   {Array.isArray(availableSchedules) && availableSchedules.length > 0 ? (
//                     availableSchedules.map((schedule) => (
//                       <option key={schedule._id} value={schedule._id}>
//                         {new Date(schedule.date).toLocaleDateString()}
//                       </option>
//                     ))
//                   ) : (
//                     <option disabled>Loading available dates...</option>
//                   )}
//                 </select>
//                 {selectedSchedule && (
//                   <p className="text-sm text-gray-300 mt-1">
//                     Capacity: {selectedSchedule.capacity}
//                   </p>
//                 )}
//               </div>
//               <input
//                 type="number"
//                 name="students"
//                 placeholder="Number of Students (Max 100)"
//                 value={bookingFormData.students}
//                 onChange={handleInputChange}
//                 className="w-full p-3 mb-3 rounded bg-gray-800 text-white font-light"
//                 min="1"
//                 max="100"
//               />
//               <div>
//                 <label htmlFor="idProofImage" className="block text-gray-300 text-sm font-bold mb-2">Upload ID Proof Image (Max 2MB)</label>
//                 <input
//                   type="file"
//                   id="idProofImage"
//                   name="idProofImage"
//                   accept="image/*"
//                   onChange={handleIdProofChange}
//                   className="w-full p-3 rounded bg-gray-800 text-white font-light"
//                 />
//                 {idProofPreview && (
//                   <div className="mt-2">
//                     <h4 className="text-gray-300 text-sm font-semibold">ID Proof Preview:</h4>
//                     <img src={idProofPreview} alt="ID Proof Preview" className="max-w-full h-auto rounded-md" style={{ maxHeight: '100px' }} />
//                   </div>
//                 )}
//               </div>
//               {bookingError && <p className="text-red-500 mb-3">{bookingError}</p>}
//               <div className="flex justify-end gap-4">
//                 <button onClick={handleCloseModal} className="bg-red-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-red-600">Cancel</button>
//                 <button
//                   onClick={handleBookingSubmit}
//                   className={`px-6 py-2 rounded-md font-semibold transition-colors duration-200 ${isFormValid() && isEmailVerified
//                       ? "bg-green-500 text-white hover:bg-green-600"
//                       : "bg-gray-600 text-white cursor-not-allowed"
//                     }`}
//                   disabled={!(isFormValid() && isEmailVerified)}
//                 >
//                   Book Visit
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </div>
//       <style jsx global>{`
//         .font-attractive {
//           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//           font-weight: 600;
//         }
//       `}</style>
//     </div>
//   );
// }





'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Phone, Mail, Globe } from 'lucide-react';

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
  const [filteredLabsByDept, setFilteredLabsByDept] = useState<Record<string, Lab[]>>({});
  const [idProofPreview, setIdProofPreview] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Slideshow states
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

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
    }, 1000);
  };

  const handleRequestVisit = () => {
    console.log("Visit button clicked");
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

    // Mock submission
    alert("Visit request submitted successfully!");
    handleCloseModal();
  };

  const isFormValid = () => {
    const { institute, name, email, mobileNumber, students, scheduleId, idProofImage } = bookingFormData;
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
    <div className="min-h-screen bg-gray-900">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900 bg-opacity-95 backdrop-blur-sm z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img
                src="/images/logo.jpg"
                alt="PSG Logo"
                className="h-15 w-15  mr-4"
              />
              <span className="text-white text-xl font-bold">PSG College of Technology</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('labs')}
                className="text-white hover:text-blue-400 transition-colors duration-200 font-semibold"
              >
                Labs
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-white hover:text-blue-400 transition-colors duration-200 font-semibold"
              >
                About Us
              </button>
              <button
                onClick={() => handleRequestVisit()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                Register Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Section 1: Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-6"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              PSG Open House
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              2025
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Platinum Jubilee Celebrations - Discover Innovation, Excellence, and the Future
            </p>
            <motion.button
              onClick={handleRequestVisit}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-4 rounded-full text-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-2xl"
            >
              Schedule Your Visit
            </motion.button>
          </motion.div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
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
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                >
                  Explore Labs
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200"
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
              Our World-Class Facilities
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Step into the future with our cutting-edge laboratories and research facilities
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm hover:scale-110"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm hover:scale-110"
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
              Explore Our Laboratories
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Discover our comprehensive range of laboratories equipped with the latest technology
            </p>
          </motion.div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
            <input
              type="text"
              placeholder="Search labs..."
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

          {/* Lab Cards */}
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
              <p className="text-xl text-gray-300">No labs found. Try adjusting your search.</p>
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
                    <span>info@psgtech.edu</span>
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