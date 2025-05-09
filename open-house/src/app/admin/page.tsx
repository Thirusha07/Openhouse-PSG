'use client';

import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaBars, FaClock, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import clsx from 'clsx';

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookingRequests, setBookingRequests] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<'pending' | 'accepted' | 'schedules' | 'create-schedule'>('pending');
  const [toastMsg, setToastMsg] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  


  useEffect(() => {
    fetch(`/api/request/fetch-request?status=${activeView}`)
      .then(res => res.json())
      .then(data => {
        console.log("Fetched data:", data); // Debug log
        setBookingRequests(data.requests || []);
      })
      .catch(err => console.error('Failed to fetch:', err));
  }, [activeView]);
  

  useEffect(() => {
    if (activeView === 'schedules') {
      fetch('/api/schedule/fetch-schedule')
        .then(res => res.json())
        .then(data => setSchedules(data.schedules || []))
        .catch(err => console.error('Failed to fetch schedules:', err));
    }
  }, [activeView]);

  const handleEmailNotification = async (request: any, status: 'accepted' | 'declined') => {
    try {
      const res = await fetch('/api/mail/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: request.event.email,
          status,
          institutionName: request.event.institutionName,
          representativeName: request.event.representativeName,
          date: request.event.schedule?.date || new Date().toISOString(),
          numberOfMembers: request.event.numberOfMembers,
        })
      });

      const result = await res.json();
      if (res.ok) {
        setToastType('success');
        setToastMsg(`Email ${status === 'accepted' ? 'sent for approval' : 'sent for rejection'}`);
        return true;
      } else {
        setToastType('error');
        setToastMsg('Failed to send email');
        return false;
      }
    } catch (err) {
      console.error('Failed to send email:', err);
      setToastType('error');
      setToastMsg('Error while sending email');
      return false;
    }
  };

  const updateRequestStatus = async (requestId: string, eventId: string, status: 'accepted' | 'declined') => {
    try {
      const res = await fetch(`/api/request/change-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, eventId, status })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
    } catch (error) {
      console.error('Failed to update DB status:', error);
    }
  };

  const handleDecision = async (requestId: string, decision: 'accepted' | 'declined') => {
    const request = bookingRequests.find(req => req._id === requestId);
    if (!request) return;

    const emailSent = await handleEmailNotification(request, decision);
    if (emailSent) {
      await updateRequestStatus(requestId, request.event._id, decision);
      setBookingRequests(prevRequests =>
        prevRequests.map(req =>
          req._id === requestId ? { ...req, status: decision } : req
        )
      );
    }
  };

  const [scheduleData, setScheduleData] = useState({
    date: '',
    capacity: '',
  });

  const handleCreateSchedule = async () => {

    try {
      const response = await fetch('/api/schedule/create-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      });
  
      const data = await response.json();
      if (data.success) {
        // Handle success, show toast or message
        setToastMsg('Schedule created successfully!');
        setToastType('success');
        setActiveView('schedules'); // Return to schedule view
      } else {
        // Handle error
        setToastMsg('Failed to create schedule');
        setToastType('error');
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
      setToastMsg('Error creating schedule');
      setToastType('error');
    }
  };

  const filteredRequests = bookingRequests.filter(
    r => r.status?.toLowerCase() === activeView
  );
  console.log("Booking requests:", bookingRequests);

  
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div
        className={clsx(
          'bg-gray-800 p-4 transition-all duration-300 z-10 space-y-6',
          sidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        <button
          className="text-white mb-4 text-xl"
          onClick={() => setSidebarOpen(prev => !prev)}
        >
          <FaBars />
        </button>
        <div className="flex flex-col space-y-4">
            <button
            onClick={() => setActiveView('pending')}
            className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-md font-semibold transition-all duration-200 text-base',
                activeView === 'pending'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              )}
            >
                <FaClock className="text-lg"/>
                {sidebarOpen && <span>Pending</span>}

            </button>
            <button
                onClick={() => setActiveView('accepted')}
                className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-md font-semibold transition-all duration-200 text-base',
                activeView === 'accepted'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                )}
            >
                <FaEdit className="text-lg"/>
                {sidebarOpen && <span>Accepted</span>}
            </button>
            <button
            onClick={() => setActiveView('create-schedule')}
            className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-md font-semibold transition-all duration-200 text-base',
                activeView === 'create-schedule'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            )}
            >
            <FaPlus className="text-lg" />
            {sidebarOpen && <span>Create Schedule</span>}
            </button>

            <button
                onClick={() => setActiveView('schedules')}
                className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-md font-semibold transition-all duration-200 text-base',
                activeView === 'schedules'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                )}
            >
                <FaCalendarAlt className="text-lg"/>
                {sidebarOpen && <span>Schedules</span>}
          </button>
        
        </div>
      </div>

      {/* Main Content */}
<div className="flex-1 p-4">
  {toastMsg && (
    <div className={`mb-4 p-3 ${toastType === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white rounded-md max-w-md mx-auto text-center`}>
      {toastMsg}
    </div>
  )}
  <div className="text-center">
    <img src="/images/logo.jpg" alt="PSG Logo" className="mx-auto h-20" />
    <h1 className="text-4xl font-bold font-attractive mt-4">Welcome, Admin!</h1>
  </div>

  {activeView === 'create-schedule' ? (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Create Event Schedule</h2>

        <form onSubmit={handleCreateSchedule} className="space-y-4">
          <div>
            <label className="block text-gray-400">Event Date</label>
            <input
              type="date"
              value={scheduleData.date}
              onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
              className="w-full p-2 bg-gray-700 text-white rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400">Capacity</label>
            <input
              type="number"
              value={scheduleData.capacity}
              onChange={(e) => setScheduleData({ ...scheduleData, capacity: e.target.value })}
              className="w-full p-2 bg-gray-700 text-white rounded-md"
              required
            />
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="bg-green-600 px-6 py-2 rounded-md text-white hover:bg-green-700"
            >
              Create Schedule
            </button>
            <button
              type="button"
              onClick={() => setActiveView('schedules')}
              className="bg-gray-600 px-6 py-2 rounded-md text-white hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : activeView === 'schedules' ? (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Event Schedules</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border border-gray-600">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 border-r border-gray-600">Date</th>
              <th className="px-4 py-2">Capacity</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule._id} className="border-t border-gray-600">
                <td className="px-4 py-2 border-r border-gray-600">
                  {new Date(schedule.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{schedule.capacity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <>
      <h2 className="text-2xl font-bold mt-8 mb-4">
        {activeView === 'pending' && 'Pending Visit Requests'}
        {activeView === 'accepted' && 'Accepted Visit Requests'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequests.length === 0 ? (
          <p className="text-gray-400">No {activeView} requests found.</p>
        ) : (
          filteredRequests.map(request => (
            <div key={request._id} className="bg-gray-800 p-4 rounded-md shadow-md relative">
              <div className="absolute top-3 right-3">
                {request.status === 'pending' && <FaClock className="text-yellow-400" />}
                {request.status === 'accepted' && (
                  <span className="text-green-400 font-semibold text-sm">Accepted</span>
                )}
              </div>
              <p>
                <span className="text-gray-400">Institution:</span>{' '}
                <span className="text-white font-light">{request.event?.institutionName}</span>
              </p>
              <p>
                <span className="text-gray-400">Representative:</span>{' '}
                <span className="text-white font-light">{request.event?.representativeName}</span>
              </p>
              <p>
                <span className="text-gray-400">Email:</span>{' '}
                <span className="text-white font-light">{request.event?.email}</span>
              </p>
              <p>
                <span className="text-gray-400">Students:</span>{' '}
                <span className="text-white font-light">{request.event?.numberOfMembers}</span>
              </p>
              <p>
                <span className="text-gray-400">Mobile:</span>{' '}
                <span className="text-white font-light">{request.event?.mobileNumber}</span>
              </p>
              {request.status === 'accepted' && request.event?.schedule?.date && (
                <p>
                  <span className="text-gray-400">Scheduled Date:</span>{' '}
                  <span className="text-white font-light">
                    {new Date(request.event.schedule.date).toLocaleDateString()}
                  </span>
                </p>
              )}
              <div className="mt-4 flex gap-2">
                {request.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleDecision(request._id, 'accepted')}
                      className="bg-green-600 px-3 py-1 rounded-md text-sm hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecision(request._id, 'declined')}
                      className="bg-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-700"
                    >
                      Decline
                    </button>
                  </>
                ) : (
                  <span className="text-sm text-green-400 font-semibold">Approved</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )}
</div>
    </div>
  );
}