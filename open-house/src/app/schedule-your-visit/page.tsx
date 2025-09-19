'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Schedule = {
  _id: string;
  date: string;
  capacity: number;
};

export default function ScheduleYourVisitPage() {
  const [availableSchedules, setAvailableSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  const [bookingFormData, setBookingFormData] = useState({
    institute: '',
    name: '',
    email: '',
    students: '',
    scheduleId: '',
    idProofImage: null as File | null,
    mobileNumber: '',
    proof: ''
  });

  const [idProofPreview, setIdProofPreview] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState('');
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await fetch('/api/schedule/fetch-schedule');
        const data: { schedules: Schedule[] } = await res.json();
        setAvailableSchedules(Array.isArray(data.schedules) ? data.schedules : []);
      } catch (err) {
        console.error('Failed to fetch schedules', err);
      }
    };
    fetchSchedules();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBookingFormData({ ...bookingFormData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const scheduleId = e.target.value;
    const schedule = availableSchedules.find((s) => s._id.toString() === scheduleId) || null;
    setBookingFormData((prev) => ({ ...prev, scheduleId }));
    setSelectedSchedule(schedule);
  };

  const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
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
      reader.onloadend = () => setIdProofPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setIdProofPreview(null);
    }
  };

  const handleVerifyEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailVerificationStatus('loading');
    setTimeout(() => {
      if (emailRegex.test(bookingFormData.email)) {
        setEmailVerificationStatus('success');
        setIsEmailVerified(true);
      } else {
        setEmailVerificationStatus('error');
        setIsEmailVerified(false);
      }
    }, 1000);
  };

  const handleBookingSubmit = async () => {
    if (!bookingFormData.idProofImage) return;
    if (!selectedSchedule) {
      alert('Please select a date.');
      return;
    }
    if (parseInt(bookingFormData.students) > selectedSchedule.capacity) {
      alert('Number of students exceeds the available capacity for the selected date.');
      return;
    }
    alert('Visit request submitted successfully!');
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
      studentCount <= 20 &&
      Boolean(scheduleId) &&
      Boolean(idProofImage)
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
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
            <Link href="/" className="flex items-center gap-2 bg-gradient-to-r from-blue-300 to-blue-700 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-400 hover:to-blue-800 transition-all duration-200 transform hover:scale-105">
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">Request Visit</h2>

            <input type="text" name="institute" placeholder="Institute Name / School Name" value={bookingFormData.institute} onChange={handleInputChange} className="w-full p-3 mb-3 rounded bg-gray-800 text-white font-light" />
            <input type="text" name="name" placeholder="Your Name (Teacher/Coordinator)" value={bookingFormData.name} onChange={handleInputChange} className="w-full p-3 mb-3 rounded bg-gray-800 text-white font-light" />

            <div className="flex gap-2 mb-3 items-center">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={bookingFormData.email}
                onChange={(e) => {
                  setBookingFormData({ ...bookingFormData, email: e.target.value });
                  setEmailVerificationStatus('idle');
                  setIsEmailVerified(false);
                }}
                className="w-full p-3 rounded bg-gray-800 text-white font-light"
              />
              <button onClick={handleVerifyEmail} disabled={!bookingFormData.email} className={`px-4 py-2 rounded font-semibold ${bookingFormData.email ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-gray-500 text-white cursor-not-allowed'}`}>
                Verify
              </button>
              {emailVerificationStatus === 'loading' && <span className="text-yellow-400 animate-spin">🔄</span>}
              {emailVerificationStatus === 'success' && <span className="text-green-400">✔️</span>}
              {emailVerificationStatus === 'error' && <span className="text-red-400">❌</span>}
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
              <select name="scheduleId" value={bookingFormData.scheduleId} onChange={handleDateChange} className="w-full p-3 rounded bg-gray-800 text-white font-light">
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
                <p className="text-sm text-gray-300 mt-1">Capacity: {selectedSchedule.capacity}</p>
              )}
            </div>

            <div className="mb-3">
              <label className="block text-white mb-1">Number of Students</label>
              <select
                name="students"
                value={bookingFormData.students}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-gray-800 text-white font-light"
              >
                <option value="" disabled>Select number of students</option>
                {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="idProofImage" className="block text-gray-300 text-sm font-bold mb-2">Upload ID Proof Image (Max 2MB)</label>
              <input type="file" id="idProofImage" name="idProofImage" accept="image/*" onChange={handleIdProofChange} className="w-full p-3 rounded bg-gray-800 text-white font-light" />
              {idProofPreview && (
                <div className="mt-2">
                  <h4 className="text-gray-300 text-sm font-semibold">ID Proof Preview:</h4>
                  <img src={idProofPreview} alt="ID Proof Preview" className="max-w-full h-auto rounded-md" style={{ maxHeight: '100px' }} />
                </div>
              )}
            </div>

            {bookingError && <p className="text-red-500 mb-3">{bookingError}</p>}

            <div className="flex justify-end gap-4 mt-4">
              <Link href="/" className="bg-red-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-red-600">Cancel</Link>
              <button onClick={handleBookingSubmit} className={`px-6 py-2 rounded-md font-semibold transition-colors duration-200 ${isFormValid() && isEmailVerified ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-600 text-white cursor-not-allowed'}`} disabled={!(isFormValid() && isEmailVerified)}>
                Book Visit
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx global>{`
        .font-attractive { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-weight: 600; }
      `}</style>
    </div>
  );
}
