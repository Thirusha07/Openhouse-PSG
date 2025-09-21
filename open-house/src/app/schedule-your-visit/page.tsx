'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Schedule = {
  _id: string;
  date: string;
  capacity: number;
};

export default function ScheduleYourVisitPage() {
  const router = useRouter();
  const [availableSchedules, setAvailableSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  const initialFormState = {
    institute: '',
    name: '',
    email: '',
    students: '',
    scheduleId: '',
    idProof: null as File | null,
    studentList: null as File | null,
    mobileNumber: '',
  };

  const [bookingFormData, setBookingFormData] = useState(initialFormState);

  const [bookingError, setBookingError] = useState('');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
    const currentStudents = parseInt(bookingFormData.students, 10);

    if (schedule && !isNaN(currentStudents) && currentStudents > schedule.capacity) {
      setBookingFormData((prev) => ({ ...prev, scheduleId, students: '' }));
    } else {
      setBookingFormData((prev) => ({ ...prev, scheduleId }));
    }
    setSelectedSchedule(schedule);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    const file = files?.[0] || null;

    if (file && file.size > 2 * 1024 * 1024) { // 2MB limit
      setBookingError(`File ${file.name} exceeds 2MB size limit.`);
      setBookingFormData(prev => ({ ...prev, [name]: null }));
      return;
    }

    setBookingFormData(prev => ({ ...prev, [name]: file }));
    setBookingError('');
  };

  const resetForm = () => {
    setBookingFormData(initialFormState);
    setSelectedSchedule(null);
    setBookingError('');
  };

  const handleBookingSubmit = async () => {
    if (!isFormValid()) {
      setBookingError('Please fill out all required fields correctly.');
      return;
    }

    setBookingStatus('loading');
    setBookingError('');

    const formData = new FormData();
    formData.append('institutionName', bookingFormData.institute);
    formData.append('representativeName', bookingFormData.name);
    formData.append('email', bookingFormData.email);
    formData.append('mobileNumber', bookingFormData.mobileNumber);
    formData.append('numberOfMembers', bookingFormData.students);
    formData.append('scheduleId', bookingFormData.scheduleId);
    if (bookingFormData.idProof) {
      formData.append('idProof', bookingFormData.idProof);
    }
    if (bookingFormData.studentList) {
      formData.append('studentList', bookingFormData.studentList);
    }

    try {
      const res = await fetch('/api/request/create-request', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setBookingStatus('success');
        resetForm();
        setShowSuccessModal(true);
      } else {
        throw new Error(data.error || 'Failed to submit booking request.');
      }
    } catch (err: any) {
      setBookingStatus('error');
      setBookingError(err.message);
    } finally {
      setBookingStatus('idle');
    }
  };

  const isFormValid = () => {
    const { institute, name, email, mobileNumber, students, scheduleId, idProof, studentList } = bookingFormData;
    const studentCount = parseInt(students, 10);
    return (
      institute.trim() &&
      name.trim() &&
      /^\S+@\S+\.\S+$/.test(email.trim()) &&
      mobileNumber.trim().length === 10 &&
      !isNaN(studentCount) &&
      studentCount > 0 &&
      (!selectedSchedule || studentCount <= selectedSchedule.capacity) &&
      Boolean(scheduleId) &&
      Boolean(idProof) &&
      Boolean(studentList)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 via-blue-300 to-purple-300">
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-black/50 backdrop-blur-lg p-8 rounded-2xl border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Request Visit</h2>

            <fieldset className="space-y-3">
              <input type="text" name="institute" placeholder="Institute Name / School Name" value={bookingFormData.institute} onChange={handleInputChange} className="w-full p-3 rounded bg-gray-800 text-white font-light" />
              <input type="text" name="name" placeholder="Your Name (Teacher/Coordinator)" value={bookingFormData.name} onChange={handleInputChange} className="w-full p-3 rounded bg-gray-800 text-white font-light" />
              <input type="email" name="email" placeholder="Email" value={bookingFormData.email} onChange={handleInputChange} className="w-full p-3 rounded bg-gray-800 text-white font-light" />
              <input type="tel" name="mobileNumber" placeholder="Mobile Number" value={bookingFormData.mobileNumber} onChange={handleInputChange} className="w-full p-3 rounded bg-gray-800 text-white font-light" pattern="[0-9]{10}" maxLength={10} required />

              <div>
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
                <p className="text-sm text-gray-300 mt-1">Available Seats: {selectedSchedule.capacity}</p>
              )}
            </div>

              <div>
                <label className="block text-white mb-1">Number of Students</label>
              <select
                name="students"
                value={bookingFormData.students}
                onChange={handleInputChange}
                  className="w-full p-3 rounded bg-gray-800 text-white font-light"
              >
                <option value="" disabled>Select number of students</option>
                {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num} disabled={selectedSchedule ? num > selectedSchedule.capacity : false}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="idProof" className="block text-gray-300 text-sm font-bold mb-2">
                  Upload ID Proof (PDF, Max 2MB)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="idProof"
                    name="idProof"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  <div className="flex items-center justify-center w-full p-3 rounded bg-gray-800 text-white font-light border-2 border-dashed border-gray-600 hover:border-blue-500 transition-colors">
                    <FileText className="w-6 h-6 mr-2 text-gray-400" />
                    <span>{bookingFormData.idProof ? bookingFormData.idProof.name : 'Choose a file'}</span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="studentList" className="block text-gray-300 text-sm font-bold mb-2">
                  Upload Student List (PDF, Max 2MB)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="studentList"
                    name="studentList"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  <div className="flex items-center justify-center w-full p-3 rounded bg-gray-800 text-white font-light border-2 border-dashed border-gray-600 hover:border-blue-500 transition-colors">
                    <FileText className="w-6 h-6 mr-2 text-gray-400" />
                    <span>{bookingFormData.studentList ? bookingFormData.studentList.name : 'Choose a file'}</span>
                  </div>
                </div>
              </div>
            </div>
            </fieldset>

            {bookingError && <p className="text-red-500 mb-3">{bookingError}</p>}

            <div className="flex justify-end gap-4 mt-4">
              <Link href="/" className="bg-red-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-red-600">Cancel</Link>
              <button
                onClick={handleBookingSubmit}
                className={`px-6 py-2 rounded-md font-semibold transition-colors duration-200 ${isFormValid() ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-600 text-white cursor-not-allowed'}`}
                disabled={!isFormValid() || bookingStatus === 'loading'}
              >
                {bookingStatus === 'loading' ? 'Booking...' : 'Book Visit'}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 p-8 rounded-lg shadow-2xl text-center max-w-sm mx-auto"
          >
            <h3 className="text-2xl font-bold text-green-400 mb-4">Success!</h3>
            <p className="text-gray-300 mb-6">
              Your visit request has been submitted. You will receive an email with the details you provided. Please check your inbox.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-green-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-600 transition-colors w-full"
            >
              OK
            </button>
          </motion.div>
        </div>
      )}

      <style jsx global>{`
        .font-attractive { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-weight: 600; }
      `}</style>
    </div>
  );
}
