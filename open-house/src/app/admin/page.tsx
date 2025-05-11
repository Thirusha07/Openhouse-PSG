
'use client';

import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaBars, FaClock, FaCalendarAlt, FaPlus, FaFlask } from 'react-icons/fa';
import { FaComputer } from "react-icons/fa6";
import clsx from 'clsx';
import Image from 'next/image';

const departments = [
    "APPLIED MATHEMATICS AND COMPUTATIONAL SCIENCES",
    "APPLIED SCIENCE",
    "APPAREL AND FASHION DESIGN",
    "AUTOMOBILE ENGINEERING",
    "BIOMEDICAL ENGINEERING",
    "CIVIL ENGINEERING",
    "COMPUTER SCIENCE & ENGINEERING",
    "COMPUTER APPLICATIONS",
    "ELECTRICAL & ELECTRONICS ENGINEERING",
    "ELECTRONICS & COMMUNICATION ENGINEERING",
    "INSTRUMENTATION & CONTROL ENGINEERING",
    "MBA",
    "MECHANICAL ENGINEERING",
    "METALLURGICAL ENGINEERING",
    "PRODUCTION ENGINEERING",
    "ROBOTICS & AUTOMATION ENGINEERING",
    "BIOTECHNOLOGY",
    "FASHION TECHNOLOGY",
    "INFORMATION TECHNOLOGY",
    "TEXTILE TECHNOLOGY",
    "ELECTRICAL & ELECTRONICS ENGINEERING (SANDWICH)",
    "MECHANICAL ENGINEERING (SANDWICH)",
    "PRODUCTION ENGINEERING (SANDWICH)",
  ];

export default function AdminPage() {
    interface Schedule {
        _id: string;
        date: string;
        capacity: number;
    }

    interface EventDetails {
        _id: string;
        institutionName: string;
        representativeName: string;
        email: string;
        numberOfMembers: number;
        mobileNumber: string;
        schedule?: Schedule;
    }

    interface RequestData {
        _id: string;
        status: 'pending' | 'accepted' | 'declined';
        event: EventDetails;
    }
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [bookingRequests, setBookingRequests] = useState<RequestData[]>([]);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [activeView, setActiveView] = useState<'pending' | 'accepted' | 'schedules' | 'create-schedule' | 'add-labs' | 'view-labs'>('pending');
    const [toastMsg, setToastMsg] = useState<string>('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [loading, setLoading] = useState<boolean>(false);
    const [labForm, setLabForm] = useState({
        labName: '',
        department: '',
        description: '',
        image: null as File | null,
    });
    // New loading states for data fetching
    const [requestsLoading, setRequestsLoading] = useState(false);
    const [schedulesLoading, setSchedulesLoading] = useState(false);

    // View Labs state
    const [labs, setLabs] = useState<any[]>([]);
    const [labsLoading, setLabsLoading] = useState(false);
    const [labsError, setLabsError] = useState<string | null>(null);
    const [labSearch, setLabSearch] = useState('');
    const [labDeptFilter, setLabDeptFilter] = useState('');
    const [labDepartments, setLabDepartments] = useState<string[]>([]);
    const [filteredLabsByDept, setFilteredLabsByDept] = useState<Record<string, any[]>>({});

    //edit and delete schedule
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [scheduleToEdit, setScheduleToEdit] = useState<any>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
    // Handler for opening edit modal
    const handleEditSchedule = (schedule: any) => {
        setScheduleToEdit({ ...schedule });
        setEditModalOpen(true);
    };

    // Handler for closing edit modal
    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setScheduleToEdit(null);
    };
        // Handler for editing schedule
    const handleUpdateSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!scheduleToEdit) return;
        setEditLoading(true);
        try {
            const res = await fetch(`/api/schedule/${scheduleToEdit._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: scheduleToEdit.date,
                    capacity: scheduleToEdit.capacity,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setToastMsg('Schedule updated successfully!');
                setToastType('success');
                setEditModalOpen(false);
                // Refresh schedules
                setSchedules((prev) =>
                    prev.map((s) =>
                        s._id === scheduleToEdit._id ? { ...s, ...scheduleToEdit } : s
                    )
                );
            } else {
                setToastMsg(data.error || 'Failed to update schedule');
                setToastType('error');
            }
        } catch (err) {
            setToastMsg('Error updating schedule');
            setToastType('error');
        } finally {
            setEditLoading(false);
        }
    };

    // Handler for deleting schedule
    const handleDeleteSchedule = async (scheduleId: string) => {
        if (!window.confirm('Are you sure you want to delete this schedule?')) return;
        setDeleteLoading(scheduleId);
        try {
            const res = await fetch(`/api/schedule/${scheduleId}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok) {
                setToastMsg('Schedule deleted successfully!');
                setToastType('success');
                setSchedules((prev) => prev.filter((s) => s._id !== scheduleId));
            } else {
                setToastMsg(data.error || 'Failed to delete schedule');
                setToastType('error');
            }
        } catch (err) {
            setToastMsg('Error deleting schedule');
            setToastType('error');
        } finally {
            setDeleteLoading(null);
        }
    };


    // FIXED: handleAddLab function to properly handle FormData with App Router
    const handleAddLab = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate form inputs
        if (!labForm.labName || !labForm.department || !labForm.description) {
            setToastMsg('Please fill in all fields');
            setToastType('error');
            return;
        }

        if (!labForm.image) {
            setToastMsg('Please upload an image');
            setToastType('error');
            return;
        }

        // Set loading state
        setLoading(true);

        try {
            // Create FormData object
            const formData = new FormData();
            formData.append('labName', labForm.labName);
            formData.append('department', labForm.department);
            formData.append('description', labForm.description);
            formData.append('image', labForm.image);

            // // Log FormData contents for debugging
            // console.log("FormData keys:");
            // for (let key of formData.keys()) {
            //     console.log("- " + key);
            // }
            // console.log("Image file name:", labForm.image.name);

            // Send request - use fetch with no content-type header
            const res = await fetch('/api/lab/create-lab', {
                method: 'POST',
                body: formData,
                // Do not set Content-Type header, browser will set it with boundary
            });

            // Parse response
            const data = await res.json();

            // Check for success
            if (res.ok) {
                setToastMsg('Lab added successfully!');
                setToastType('success');
                setTimeout(() => {
                    window.location.reload();
                  }, 1000);

            } else {
                throw new Error(data.error || data.message || 'Failed to add lab');
            }
        } catch (error) {
            console.error('Error adding lab:', error);
            setToastMsg(error instanceof Error ? error.message : 'Error adding lab');
            setToastType('error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setRequestsLoading(true);
        fetch(`/api/request/fetch-request?status=${activeView}`)
            .then(res => res.json())
            .then(data => {
                console.log("Fetched data:", data); // Debug log
                setBookingRequests(data.requests || []);
            })
            .catch(err => {
                setBookingRequests([]);
                console.error('Failed to fetch:', err)
            })
            .finally(() => setRequestsLoading(false));
    }, [activeView]);


    useEffect(() => {
        if (activeView === 'schedules') {
            setSchedulesLoading(true);
            fetch('/api/schedule/fetch-schedule')
                .then(res => res.json())
                .then(data => setSchedules(data.schedules || []))
                .catch(err => {
                    setSchedules([]);
                    console.error('Failed to fetch schedules:', err)
                })
                .finally(() => setSchedulesLoading(false));
        }
    }, [activeView]);

    // View Labs: fetch labs when view-labs is active
    useEffect(() => {
        if (activeView === 'view-labs') {
            setLabsLoading(true);
            setLabsError(null);
            fetch('/api/lab/fetch-lab')
                .then(res => res.json())
                .then(data => {
                    setLabs(data.labs || []);
                    // Extract unique departments
                    const uniqueDepartments: any = [...new Set((data.labs || []).map((lab: any) => lab.departmentName))];
                    setLabDepartments(uniqueDepartments);
                })
                .catch(() => {
                    setLabs([]);
                    setLabDepartments([]);
                    setLabsError("Failed to fetch labs");
                })
                .finally(() => setLabsLoading(false));
        }
    }, [activeView]);

     // View Labs: filter and group labs
    useEffect(() => {
        if (!labs) return;
        const filtered = labs.filter((lab) => {
            const matchesDepartment = labDeptFilter ? lab.departmentName === labDeptFilter : true;
            const matchesSearch = labSearch
                ? lab.labName.toLowerCase().includes(labSearch.toLowerCase()) ||
                  lab.description.toLowerCase().includes(labSearch.toLowerCase())
                : true;
            return matchesDepartment && matchesSearch;
        });
        // Group by department
        const grouped = filtered.reduce((acc: Record<string, any[]>, lab) => {
            if (!acc[lab.departmentName]) acc[lab.departmentName] = [];
            acc[lab.departmentName].push(lab);
            return acc;
        }, {});
        setFilteredLabsByDept(grouped);
    }, [labs, labSearch, labDeptFilter]);

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

    const handleCreateSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/schedule/create-schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...scheduleData,
                capacoty: Number(scheduleData.capacity),
            }),
            });

            const data = await response.json();
            if (data.success) {
                // Handle success, show toast or message
                setToastMsg('Schedule created successfully!');
                setToastType('success');
                setActiveView('schedules'); // Return to schedule view
            } else {
                // Handle error
                setToastMsg(data.message || 'Failed to create schedule');
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
    //console.log("Booking requests:", bookingRequests);

    const sidebarWidth = sidebarOpen ? 256 : 64; // px

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            {/* Sidebar */}
            <div
                className={clsx(
                    'fixed top-0 left-0 h-full bg-gray-800 p-4 transition-all duration-300 z-30 space-y-6',
                    sidebarOpen ? 'w-64' : 'w-16'
                )}
                style={{ width: sidebarWidth}}
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
                        <FaClock className="text-lg" />
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
                        <FaEdit className="text-lg" />
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
                        <FaCalendarAlt className="text-lg" />
                        {sidebarOpen && <span>View Schedules</span>}
                    </button>
                    <button
                        onClick={() => setActiveView('add-labs')}
                        className={clsx(
                            'flex items-center gap-3 px-3 py-2 rounded-md font-semibold transition-all duration-200 text-base',
                            activeView === 'add-labs'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        )}
                    >
                        <FaFlask className="text-lg" />
                        {sidebarOpen && <span>Add Labs</span>}
                    </button>
                    <button
                        onClick={() => setActiveView('view-labs')}
                        className={clsx(
                                'flex items-center gap-3 px-3 py-2 rounded-md font-semibold transition-all duration-200 text-base',
                                activeView === 'view-labs'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            )}
                    >
                        <FaComputer className='text-lg'/>
                        {sidebarOpen && <span>View Labs</span>}
                    </button>

                </div>
            </div>
            {/* Fixed Toast Message */}
            {toastMsg && (
                <div
                    className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-3 ${toastType === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white rounded-md max-w-md w-full text-center cursor-pointer shadow-lg`}
                    style={{ maxWidth: 400 }}
                    onClick={() => setToastMsg('')}
                >
                    {toastMsg}
                </div>
            )}

            {/* Main Content */}
            <div 
               className="pl-16 transition-all duration-300 flex flex-col min-h-screen w-full"
                style={{
                    marginLeft: sidebarWidth,
                }}
            >
            
               {/* Always show header at the top and centered */}
                <div className="w-full flex justify-center mt-8 mb-4">
                    <div className="text-center">
                        <img src="/images/logo.jpg" alt="PSG Logo" className="mx-auto h-20" />
                        <h1 className="text-4xl font-bold font-attractive mt-4">Welcome, Admin!</h1>
                    </div>
                </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full">
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
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
                        <h2 className="text-2xl font-bold mb-4 text-center text-white">Event Schedules</h2>
                        {schedulesLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <span className="text-gray-400 text-lg">Loading schedules...</span>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                {schedules.length === 0 ? (
                                    <div className="flex justify-center items-center py-8">
                                        <span className="text-gray-400 text-lg">No schedules found.</span>
                                    </div>
                                ) : (
                                    <table className="min-w-full text-left border border-gray-600">
                                        <thead className="bg-gray-700">
                                            <tr>
                                                <th className="px-4 py-2 border-r border-gray-600">Date</th>
                                                <th className="px-4 py-2 border-r border-gray-600">Capacity</th>
                                                <th className="px-4 py-2">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {schedules.map((schedule) => (
                                                <tr key={schedule._id} className="border-t border-gray-600">
                                                    <td className="px-4 py-2 border-r border-gray-600">
                                                        {new Date(schedule.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-2 border-r border-gray-600">{schedule.capacity}</td>
                                                    <td className="px-4 py-2 flex gap-3">
                                                        <button
                                                            className="text-blue-400 hover:text-blue-600"
                                                            onClick={() => handleEditSchedule(schedule)}
                                                            title="Edit"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            className="text-red-400 hover:text-red-600"
                                                            onClick={() => handleDeleteSchedule(schedule._id)}
                                                            disabled={deleteLoading === schedule._id}
                                                            title="Delete"
                                                        >
                                                            {deleteLoading === schedule._id ? (
                                                                <span className="animate-spin">⏳</span>
                                                            ) : (
                                                                <FaTrash />
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                        {/* Edit Modal */}
                        {editModalOpen && scheduleToEdit && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full">
                                    <h2 className="text-xl font-bold mb-4 text-center text-white">Edit Schedule</h2>
                                    <form onSubmit={handleUpdateSchedule} className="space-y-4">
                                        <div>
                                            <label className="block text-gray-400">Event Date</label>
                                            <input
                                                type="date"
                                                value={scheduleToEdit.date?.slice(0, 10) || ''}
                                                onChange={(e) =>
                                                    setScheduleToEdit((prev: any) => ({
                                                        ...prev,
                                                        date: e.target.value,
                                                    }))
                                                }
                                                className="w-full p-2 bg-gray-700 text-white rounded-md"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400">Capacity</label>
                                            <input
                                                type="number"
                                                value={scheduleToEdit.capacity}
                                                onChange={(e) =>
                                                    setScheduleToEdit((prev: any) => ({
                                                        ...prev,
                                                        capacity: e.target.value,
                                                    }))
                                                }
                                                className="w-full p-2 bg-gray-700 text-white rounded-md"
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-center gap-4">
                                            <button
                                                type="submit"
                                                className="bg-blue-600 px-6 py-2 rounded-md text-white hover:bg-blue-700"
                                                disabled={editLoading}
                                            >
                                                {editLoading ? 'Saving...' : 'Save'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleCloseEditModal}
                                                className="bg-gray-600 px-6 py-2 rounded-md text-white hover:bg-gray-700"
                                                disabled={editLoading}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                    
                ) : activeView === 'add-labs' ? (
                    <div className="flex justify-center items-center min-h-screen">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
                            <h2 className="text-2xl font-bold mb-4 text-center text-white">Add Lab Details</h2>
                            <form
                                onSubmit={handleAddLab}
                                className="space-y-4"
                                encType="multipart/form-data"
                            >
                                <div>
                                    <label className="block text-gray-400">Lab Name</label>
                                    <input
                                        type="text"
                                        value={labForm.labName}
                                        onChange={(e) => setLabForm({ ...labForm, labName: e.target.value })}
                                        className="w-full p-2 bg-gray-700 text-white rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400">Department</label>
                                    <select
                                        value={labForm.department}
                                        onChange={(e) => setLabForm({ ...labForm, department: e.target.value })}
                                        className="w-full p-2 bg-gray-700 text-white rounded-md"
                                        required
                                    >
                                        <option value="" disabled>Select a department</option>
                                        {departments.map((dept) => (
                                            <option key={dept} value={dept}>
                                                {dept}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400">Description</label>
                                    <textarea
                                        value={labForm.description}
                                        onChange={(e) => setLabForm({ ...labForm, description: e.target.value })}
                                        className="w-full p-2 bg-gray-700 text-white rounded-md"
                                        rows={3}
                                        required
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-gray-400">Upload Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            setLabForm({ ...labForm, image: file });
                                            if (file) {
                                                console.log("Selected file:", file.name, "Size:", file.size, "Type:", file.type);
                                            }
                                        }}
                                        className="w-full p-2 bg-gray-700 text-white rounded-md"
                                        required
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <button
                                        type="submit"
                                        className={`bg-blue-600 px-6 py-2 rounded-md text-white ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                                        disabled={loading}
                                    >
                                        {loading ? 'Adding...' : 'Add Lab'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : activeView === 'view-labs' ? (
                        <div className="container mx-auto px-2">
                            <h2 className="text-2xl font-bold mb-6 text-center text-white">All Labs</h2>
                            {/* Search and Filter */}
                            <div className="mb-8 flex flex-col sm:flex-row justify-center gap-4">
                                <input
                                    type="text"
                                    placeholder="Search labs..."
                                    value={labSearch}
                                    onChange={(e) => setLabSearch(e.target.value)}
                                    className="p-3 border border-gray-700 rounded-md bg-gray-800 text-white font-light"
                                />
                                <select
                                    value={labDeptFilter}
                                    onChange={(e) => setLabDeptFilter(e.target.value)}
                                    className="p-3 border border-gray-700 rounded-md bg-gray-800 text-white font-light"
                                >
                                    <option value="">All Labs</option>
                                    {labDepartments.map((dept) => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Loading State */}
                            {labsLoading && (
                                <div className="mt-10 flex justify-center">
                                    <div className="text-white text-xl">Loading labs...</div>
                                </div>
                            )}
                            {/* Error State */}
                            {labsError && !labsLoading && (
                                <div className="mt-10 flex justify-center">
                                    <div className="text-red-500 text-xl">Error: {labsError}</div>
                                </div>
                            )}
                            {/* Department Cards */}
                            {!labsLoading && !labsError && Object.keys(filteredLabsByDept).length > 0 ? (
                                <div className="mt-10">
                                    {Object.entries(filteredLabsByDept).map(([deptName, deptLabs]) => (
                                        <div key={deptName}>
                                            <h3 className="text-white text-xl font-bold mb-4">{deptName}</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                                {deptLabs.map((lab) => (
                                                    <div
                                                        key={lab.labName}
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
                                                        <h4 className="text-lg font-semibold text-white mb-2">{lab.labName}</h4>
                                                        <p className="text-gray-300 text-sm">{lab.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : !labsLoading && !labsError && (
                                <div className="mt-10 flex justify-center">
                                    <p className="text-white text-xl">No labs found. Try adjusting your search.</p>
                                </div>
                            )}
                        </div>
                    ) : 
                    (
                        <>
                            <h2 className="text-2xl font-bold mt-8 mb-4">
                                {activeView === 'pending' && 'Pending Visit Requests'}
                                {activeView === 'accepted' && 'Accepted Visit Requests'}
                            </h2>
                            {requestsLoading ? (
                                <div className="flex justify-center items-center py-8">
                                    <span className="text-gray-400 text-lg">Loading data...</span>
                                </div>
                            ) : (
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
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
