'use client';

import { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import HomePage from '../page';

interface Department {
    id: string;
    name: string;
    deptName: string; // Renamed from location
    image: string;
    description: string; // Single-line description
    capacity: number;
    booked: number;
    foundedDate: string;
}

interface BookingRequest {
    id: string;
    labId: string;
    institute: string;
    name: string;
    email: string;
    students: number;
    date: string;
    status: 'pending' | 'accepted' | 'declined';
}

interface EventSlot {
    id: string;
    labId: string;
    date: string;
    capacity: number;
}

const initialDepartments: Omit<Department, 'id'>[] = [
    {
        name: "Applied Mathematics and Computational Sciences Lab",
        deptName: "Stony Brook University",
        image: "/images/applied_mathematics_lab.jpg",
        description: "Explore mathematical modeling and computational tools.",
        capacity: 50,
        booked: 0,
        foundedDate: '',
    },
    {
        name: "Applied Science Lab",
        deptName: "Various Institutions",
        image: "/images/applied_science_lab.jpg",
        description: "Witness practical applications of scientific principles.",
        capacity: 60,
        booked: 0,
        foundedDate: '',
    },
    {
        name: "Apparel and Fashion Design Studio",
        deptName: "Fashion Institutes",
        image: "/images/apparel_fashion_studio.jpg",
        description: "Discover the creative world of fashion design and production.",
        capacity: 40,
        booked: 0,
        foundedDate: '',
    },
    {
        name: "Automobile Engineering Workshop",
        deptName: "Engineering Colleges",
        image: "/images/automobile_engineering_workshop.jpg",
        description: "Get hands-on with vehicle design and engineering.",
        capacity: 70,
        booked: 0,
        foundedDate: '',
    },
    {
        name: "Biomedical Engineering Lab",
        deptName: "Various Universities",
        image: "/images/biomedical_engineering_lab.jpg",
        description: "See how engineering innovates healthcare solutions.",
        capacity: 55,
        booked: 0,
        foundedDate: '',
    },
    {
        name: "Civil Engineering Structures Lab",
        deptName: "Engineering Schools",
        image: "/images/civil_engineering_lab.jpg",
        description: "Understand the principles of structural design and testing.",
        capacity: 80,
        booked: 0,
        foundedDate: '',
    },
    {
        name: "Computer Science & Engineering Lab",
        deptName: "Tech Universities",
        image: "/images/computer_science_lab.jpg",
        description: "Experience cutting-edge computer systems and software development.",
        capacity: 90,
        booked: 0,
        foundedDate: '',
    },
    {
        name: "Computer Applications Lab",
        deptName: "Various Institutions",
        image: "/images/computer_applications_lab.jpg",
        description: "Explore practical applications of computer software.",
        capacity: 100,
        booked: 0,
        foundedDate: '',
    },
    {
        name: "Electrical & Electronics Engineering Lab",
        deptName: "Engineering Colleges",
        image: "/images/electrical_engineering_lab.jpg",
        description: "Witness experiments in electricity, electronics, and electromagnetism.",
        capacity: 65,
        booked: 0,
        foundedDate: '',
    },
    {
        name: "Electronics & Communication Engineering Lab",
        deptName: "Tech Universities",
        image: "/images/electronics_communication_lab.jpg",
        description: "Discover the world of electronic devices and communication systems.",
        capacity: 75,
        booked: 0,
        foundedDate: '',
    },
    {
        name: "Instrumentation & Control Engineering Lab",
        deptName: "Engineering Schools",
        image: "/images/instrumentation_control_lab.jpg",
        description: "See how instruments and control systems drive industrial processes.",
        capacity: 45,
        booked: 0,
        foundedDate: '',
    },
    {
        name: "Mechanical Engineering Workshop",
        deptName: "Engineering Colleges",
        image: "/images/mechanical_engineering_workshop.jpg",
        description: "Engage with the design and manufacturing of mechanical systems.",
        capacity: 85,
        booked: 0,
        foundedDate: '',
    },
    {
        name: "Metallurgical Engineering Lab",
        deptName: "Engineering Schools",
        image: "/images/metallurgical_engineering_lab.jpg",
        description: "Study the fascinating properties and processing of metals.",
        capacity: 50,
        booked: 0,
        foundedDate: '',
    },
    {
        name: "Production Engineering Workshop",
        deptName: "Various Institutions",
        image: "/images/production_engineering_workshop.jpg",
        description: "Understand the intricacies of modern production processes.",
        capacity: 60,
        booked: 0,
        foundedDate: '',
    },
    {
        name: "Robotics & Automation Engineering Lab",
        deptName: "Tech Universities",
        image: "/images/robotics_automation_lab.jpg",
        description: "Explore the exciting field of robotics and automation technologies.",
        capacity: 70,
        booked: 0,
        foundedDate: '',
    },
    {
        name: "Biotechnology Lab",
        deptName: "Various Universities",
        image: "/images/biotechnology_lab.jpg",
        description: "Witness the intersection of biology and technology.",
        capacity: 55,
        booked: 0,
        foundedDate: '',
    },
    {
        name: "Fashion Technology Lab",
        deptName: "Fashion Institutes",
        image: "/images/fashion_technology_lab.jpg",
        description: "Discover the technological advancements in the fashion industry.",
        capacity: 40,
        booked: 0,
        foundedDate: '',
    },
    {
        name: "Information Technology Lab",
        deptName: "Tech Universities",
        image: "/images/information_technology_lab.jpg",
        description: "Explore the management of information systems and data.",
        capacity: 95,
        booked: 0,
        foundedDate: '',
    },
    {
        name: "Textile Technology Lab",
        deptName: "Textile Institutes",
        image: "/images/textile_technology_lab.jpg",
        description: "Learn about the production and processing of textiles.",
        capacity: 65,
        booked: 0,
        foundedDate: '',
    },
    {
        name: "Electrical & Electronics Engineering (Sandwich) Lab",
        deptName: "Engineering Colleges",
        image: "/images/electrical_sandwich_lab.jpg",
        description: "Experience practical industrial training in electrical and electronics.",
        capacity: 50,
        booked: 0,
        foundedDate: '',
    },
    {
        name: "Mechanical Engineering (Sandwich) Workshop",
        deptName: "Engineering Schools",
        image: "/images/mechanical_sandwich_workshop.jpg",
        description: "Engage in industry-focused mechanical engineering practices.",
        capacity: 70,
        booked: 0,
        foundedDate: '',
    },
    {
        name: "Production Engineering (Sandwich) Workshop",
        deptName: "Various Institutions",
        image: "/images/production_sandwich_workshop.jpg",
        description: "Get hands-on with production processes in a real-world setting.",
        capacity: 60,
        booked: 0,
        foundedDate: '',
    },
];

const AdminPage = () => {
    const [labs, setLabs] = useState<Department[]>([]);
    const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
    const [eventSlots, setEventSlots] = useState<EventSlot[]>([]);
    const [isAddLabModalOpen, setIsAddLabModalOpen] = useState(false);
    const [isEditLabModalOpen, setIsEditLabModalOpen] = useState(false);
    const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState<Omit<EventSlot, 'id'>>({
        labId: '',
        date: '',
        capacity: 0,
    });
    const [newLab, setNewLab] = useState<Omit<Department, 'id'>>({
        name: '',
        deptName: '',
        image: '',
        description: '',
        capacity: 0,
        booked: 0,
        foundedDate: '',
    });
    const [editingLab, setEditingLab] = useState<Department | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<'pending' | 'accepted' | 'declined' | 'all' | 'viewLabs'>('pending');
    const [editingLabId, setEditingLabId] = useState<string | null>(null);
    useEffect(() => {
        const storedRequests = localStorage.getItem('openHouseBookingRequests');
        if (storedRequests) {
            setBookingRequests(JSON.parse(storedRequests));
        }
        const storedEvents = localStorage.getItem('openHouseEvents');
        if (storedEvents) {
            setEventSlots(JSON.parse(storedEvents));
        }
        if (activeView === 'viewLabs') {
            const storedLabs = localStorage.getItem('openHouseLabs');
            const addedLabs = storedLabs ? JSON.parse(storedLabs) : [];
            const initialLabsWithId = initialDepartments.map(lab => ({ ...lab, id: `initial-${lab.name.replace(/\s+/g, '-')}` }));
            setLabs([...initialLabsWithId, ...addedLabs]);
        } else {
            setLabs([]);
        }
    }, [activeView]);

    useEffect(() => {
        if (activeView === 'viewLabs') {
            const addedLabsToStore = labs.filter(lab => !lab.id?.startsWith('initial-'));
            localStorage.setItem('openHouseLabs', JSON.stringify(addedLabsToStore));
        }
    }, [labs, activeView]);

    useEffect(() => {
        localStorage.setItem('openHouseBookingRequests', JSON.stringify(bookingRequests));
    }, [bookingRequests]);

    useEffect(() => {
        localStorage.setItem('openHouseEvents', JSON.stringify(eventSlots));
    }, [eventSlots]);

    const openAddLabModal = () => {
        setIsAddLabModalOpen(true);
        setNewLab({ ...newLab, name: '', deptName: '', image: '', description: '', capacity: 0, booked: 0, foundedDate: '' });
        setSelectedImage(null);
        setImageError(null);
    };

    const closeAddLabModal = () => {
        setIsAddLabModalOpen(false);
    };

    const openEditLabModal = (lab: Department) => {
        setEditingLab(lab);
        setIsEditLabModalOpen(true);
        setSelectedImage(null);
        setImageError(null);
    };

    const closeEditLabModal = () => {
        setIsEditLabModalOpen(false);
        setEditingLab(null);
        setSelectedImage(null);
        setImageError(null);
    };

    const openAddEventModal = () => {
        setIsAddEventModalOpen(true);
        setNewEvent({ labId: '', date: '', capacity: 0 });
    };

    const closeAddEventModal = () => {
        setIsAddEventModalOpen(false);
        setNewEvent({ labId: '', date: '', capacity: 0 });
    };

    const handleNewLabChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewLab({ ...newLab, [e.target.name]: e.target.value });
    };

    const handleEditLabChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (editingLab) {
            setEditingLab({ ...editingLab, [e.target.name]: e.target.value });
        }
    };

    const handleNewEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
    };

    const handleAddEventLabChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNewEvent({ ...newEvent, labId: e.target.value });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
                setImageError('Only JPG/JPEG files are allowed.');
                setSelectedImage(null);
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                setImageError('Image size must be less than 2MB.');
                setSelectedImage(null);
                return;
            }
            setImageError(null);
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewLab({ ...newLab, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
                setImageError('Only JPG/JPEG files are allowed.');
                setSelectedImage(null);
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                setImageError('Image size must be less than 2MB.');
                setSelectedImage(null);
                return;
            }
            setImageError(null);
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                if (editingLab) {
                    setEditingLab({ ...editingLab, image: reader.result as string });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddLab = () => {
        const newLabWithId = { ...newLab, id: Date.now().toString() };
        setLabs(prevLabs => [...prevLabs, newLabWithId]);
        closeAddLabModal();
        setActiveView('viewLabs');
    };

    const handleSaveEditedLab = () => {
        if (editingLab) {
            setLabs(prevLabs =>
                prevLabs.map(lab => (lab.id === editingLab.id ? editingLab : lab))
            );
            closeEditLabModal();
        }
    };

    const handleDeleteLab = (labId: string) => {
        setLabs(prevLabs => prevLabs.filter(lab => lab.id !== labId));
    };

    const handleAddEvent = () => {
        if (newEvent.labId) {
            const newEventWithId = { ...newEvent, id: Date.now().toString() };
            setEventSlots(prevEvents => [...prevEvents, newEventWithId]);
            closeAddEventModal();
        } else {
            alert('Please select a lab to add the event to.');
        }
    };

    const handleAcceptRequest = (requestId: string) => {
        setBookingRequests(prevRequests =>
            prevRequests.map(req =>
                req.id === requestId ? { ...req, status: 'accepted' } : req
            )
        );
        const requestToAccept = bookingRequests.find(req => req.id === requestId);
        if (requestToAccept) {
            setLabs(prevLabs =>
                prevLabs.map(lab =>
                    lab.id === requestToAccept.labId
                        ? { ...lab, booked: lab.booked + requestToAccept.students }
                        : lab
                )
            );
        }
    };

    const handleDeclineRequest = (requestId: string) => {
        setBookingRequests(prevRequests =>
            prevRequests.map(req =>
                req.id === requestId ? { ...req, status: 'declined' } : req
            )
        );
    };

    const filteredRequests = bookingRequests.filter(request => {
        if (activeView === 'all') return true;
        return request.status === activeView;
    });

    return (
        <div className="min-h-screen bg-gray-900 text-white flex">
            {/* Left Taskbar */}
            <div className="w-64 bg-gray-800 p-4 flex flex-col space-y-2">
                <button onClick={() => setActiveView('viewLabs')} className={`px-3 py-2 rounded-md font-semibold w-full text-left ${activeView === 'viewLabs' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                    Available Labs ({labs.filter(lab => !lab.id?.startsWith('initial-')).length + initialDepartments.length})
                </button>
            
                <button onClick={openAddEventModal} className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 font-semibold w-full">
                    Add Event
                </button>
                <button onClick={() => setActiveView('pending')} className={`px-3 py-2 rounded-md font-semibold w-full text-left ${activeView === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                    Requests ({bookingRequests.filter(r => r.status === 'pending').length})
                </button>
                <button onClick={() => setActiveView('accepted')} className={`px-3 py-2 rounded-md font-semibold w-full text-left ${activeView === 'accepted' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                    Accepted Requests ({bookingRequests.filter(r => r.status === 'accepted').length})
                </button>
                
            </div>
    
            {/* Main Content Area */}
            <div className="flex-1 p-6">
                <h1 className="text-3xl font-bold mb-6 font-attractive">PSG Open House 2025</h1>
    
                {isAddLabModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-8 rounded-md shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4 font-attractive">Add New Lab</h2>
            <div className="mb-3">
                <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">Lab Name:</label>
                <input type="text" id="name" name="name" value={newLab.name} onChange={handleNewLabChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white font-light" />
            </div>
            <div className="mb-3">
                <label htmlFor="deptName" className="block text-gray-300 text-sm font-bold mb-2">Department Name:</label>
                <input type="text" id="deptName" name="deptName" value={newLab.deptName} onChange={handleNewLabChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white font-light" />
            </div>
            <div className="mb-3">
                <label htmlFor="description" className="block text-gray-300 text-sm font-bold mb-2">Description:</label>
                <input type="text" id="description" name="description" value={newLab.description} onChange={handleNewLabChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white font-light" />
            </div>
            <div className="mb-3">
                <label htmlFor="image" className="block text-gray-300 text-sm font-bold mb-2">Image (JPG/JPEG, &lt; 2MB, Optional):</label>
                <input type="file" id="image" accept="image/jpeg, image/jpg" onChange={handleImageUpload} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white font-light" />
                {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
                {newLab.image && !imageError && typeof newLab.image === 'string' && newLab.image.startsWith('data:image') && (
                    <img src={newLab.image} alt="Preview" className="mt-2 max-h-32 rounded-md" />
                )}
            </div>
            <div className="mb-3">
                <label htmlFor="capacity" className="block text-gray-300 text-sm font-bold mb-2">Capacity:</label>
                <input type="number" id="capacity" name="capacity" value={newLab.capacity} onChange={handleNewLabChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white font-light" />
            </div>
           
            <div className="flex justify-end gap-4">
                <button onClick={closeAddLabModal} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 font-semibold">Cancel</button>
                <button onClick={handleAddLab} disabled={imageError !== null} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 font-semibold disabled:opacity-50">Add Lab</button>
            </div>
        </div>
    </div>
)}
    
    {isEditLabModalOpen && editingLab && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-8 rounded-md shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4 font-attractive">Edit Lab</h2>
            <div className="mb-3">
                <label htmlFor="editName" className="block text-gray-300 text-sm font-bold mb-2">Lab Name:</label>
                <input type="text" id="editName" name="name" value={editingLab.name} onChange={handleEditLabChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white font-light" />
            </div>
            <div className="mb-3">
                <label htmlFor="editDeptName" className="block text-gray-300 text-sm font-bold mb-2">Department Name:</label>
                <input type="text" id="editDeptName" name="deptName" value={editingLab.deptName} onChange={handleEditLabChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white font-light" />
            </div>
            <div className="mb-3">
                <label htmlFor="editDescription" className="block text-gray-300 text-sm font-bold mb-2">Description:</label>
                <input type="text" id="editDescription" name="description" value={editingLab.description} onChange={handleEditLabChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white font-light" />
            </div>
            <div className="mb-3">
                <label htmlFor="editImage" className="block text-gray-300 text-sm font-bold mb-2">Image (JPG/JPEG, &lt; 2MB, Optional):</label>
                <input type="file" id="editImage" accept="image/jpeg, image/jpg" onChange={handleEditImageUpload}
                       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white font-light" />
                {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
                
            </div>
            <div className="mb-3">
                <label htmlFor="editCapacity" className="block text-gray-300 text-sm font-bold mb-2">Capacity:</label>
                <input type="number" id="editCapacity" name="capacity" value={editingLab.capacity} onChange={handleEditLabChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white font-light" />
            </div>
            
            <div className="flex justify-end gap-4">
                <button onClick={closeEditLabModal} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 font-semibold">Cancel</button>
                <button onClick={handleSaveEditedLab} disabled={imageError !== null} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 font-semibold disabled:opacity-50">Save Changes</button>
            </div>
            </div>
    </div>
)}
    
                <h2 className="text-2xl font-bold mt-8 mb-4 font-attractive">
                    {activeView === 'pending' && 'Pending Visit Requests'}
                    {activeView === 'accepted' && 'Accepted Visit Requests'}
        
                    {activeView === 'viewLabs'}
                </h2>
                {activeView !== 'viewLabs' && filteredRequests.length === 0 ? (
                    <p className="text-gray-300">No {activeView.replace('Requests', '')} visit requests.</p>
                ) : (activeView !== 'viewLabs' &&
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
                        {filteredRequests.map(request => (
                            <div key={request.id} className="border rounded-md bg-gray-800 shadow-md p-4">
                                <p><strong className="text-gray-300">Institute:</strong> <span className="text-white font-light">{request.institute}</span></p>
                                <p><strong className="text-gray-300">Name:</strong> <span className="text-white font-light">{request.name}</span></p>
                                <p><strong className="text-gray-300">Email:</strong> <span className="text-white font-light">{request.email}</span></p>
                                <p><strong className="text-gray-300">Students:</strong> <span className="text-white font-light">{request.students}</span></p>
                                <p><strong className="text-gray-300">Date:</strong> <span className="text-white font-light">{request.date}</span></p>
                                <div className="mt-3 flex gap-2">
                                    {request.status === 'pending' && (
                                        <>
                                            <button onClick={() => handleAcceptRequest(request.id)} className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 font-semibold text-sm">Accept</button>
                                            <button onClick={() => handleDeclineRequest(request.id)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 font-semibold text-sm">Decline</button>
                                        </>
                                    )}
                                    <span className={`font-semibold text-sm ${request.status === 'accepted' ? 'text-green-400' : (request.status === 'declined' ? 'text-red-400' : '')}`}>
                                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
    
                    {activeView === 'viewLabs' && (
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold font-attractive">Available Labs</h2>
                        <button onClick={openAddLabModal} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 font-semibold">
                            Add New Lab
                        </button>
                    </div>
                )}
                {activeView === 'viewLabs' && labs.length === 0 ? (
                    <p className="text-gray-300">No labs available.</p>
                ) : (activeView === 'viewLabs' &&
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
                        {labs.map(lab => (
                            <div key={lab.id} className="border rounded-md bg-gray-800 shadow-md p-4 relative flex flex-col">
                                {editingLabId === lab.id ? (
                                    // Render the edit form here
                                    <div className="mb-4">
                                        <h3 className="text-xl font-semibold mb-2 text-white">Edit Lab</h3>
                                        <div className="mb-2">
                                            <label htmlFor={`editName-${lab.id}`} className="block text-gray-300 text-sm font-bold mb-1">Lab Name:</label>
                                            <input type="text" id={`editName-${lab.id}`} name="name" value={editingLab?.name || ''} onChange={handleEditLabChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white font-light" />
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor={`editDeptName-${lab.id}`} className="block text-gray-300 text-sm font-bold mb-1">Department Name:</label>
                                            <input type="text" id={`editDeptName-${lab.id}`} name="deptName" value={editingLab?.deptName || ''} onChange={handleEditLabChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white font-light" />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor={`editDescription-${lab.id}`} className="block text-gray-300 text-sm font-bold mb-1">Description:</label>
                                        <input type="text" id={`editDescription-${lab.id}`} name="description" value={editingLab?.description || ''} onChange={handleEditLabChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white font-light" />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor={`editCapacity-${lab.id}`} className="block text-gray-300 text-sm font-bold mb-1">Capacity:</label>
                                        <input type="number" id={`editCapacity-${lab.id}`} name="capacity" value={editingLab?.capacity || 0} onChange={handleEditLabChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white font-light" />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor={`editFoundedDate-${lab.id}`} className="block text-gray-300 text-sm font-bold mb-1">Founded Date:</label>
                                        <input type="date" id={`editFoundedDate-${lab.id}`} name="foundedDate" value={editingLab?.foundedDate || ''} onChange={handleEditLabChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white font-light" />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button onClick={closeEditLabModal} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 font-semibold text-sm">Cancel</button>
                                        <button onClick={handleSaveEditedLab} className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 font-semibold text-sm">Save</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-semibold mb-1 text-white">{lab.name}</h3>
                                            <p className="text-gray-300 text-sm"><span className="text-white font-light">{lab.deptName}</span></p>
                                        </div>

                                    </div>
                                    <p className="text-gray-300 text-sm mb-2">Department: <span className="text-white font-light">{lab.deptName}</span></p>
                                    <p className="text-gray-300 text-sm mb-2">Description: <span className="text-white font-light">{lab.description}</span></p>
                                    <div className="absolute bottom-2 right-2 flex gap-2">
                                        <button onClick={() => handleDeleteLab(lab.id)} className="text-red-500 hover:text-red-400">
                                            <FaTrash />
                                        </button>


                                        <button onClick={() => openEditLabModal(lab)} className="text-yellow-500 hover:text-yellow-400">
                                            <FaEdit />
                                        </button>


                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                    <div className="border rounded-md bg-gray-800 shadow-md p-4 flex items-center justify-center">
                        <button onClick={openAddLabModal} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 font-semibold">
                            Add New Lab
                        </button>
                    </div>
                </div>
            )}

            {isAddEventModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-800 p-8 rounded-md shadow-lg w-96">
                        <h2 className="text-2xl font-bold mb-4 font-attractive">Add New Event Slot</h2>
                        <div className="mb-3">
                            <label htmlFor="labId" className="block text-gray-300 text-sm font-bold mb-2">Lab:</label>
                            <select id="labId" name="labId" value={newEvent.labId} onChange={handleAddEventLabChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white font-light">
                                <option value="">Select a Lab</option>
                                {labs.map(lab => (
                                    <option key={lab.id} value={lab.id}>{lab.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="date" className="block text-gray-300 text-sm font-bold mb-2">Date:</label>
                            <input type="date" id="date" name="date" value={newEvent.date} onChange={handleNewEventChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white font-light" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="capacity" className="block text-gray-300 text-sm font-bold mb-2">Capacity:</label>
                            <input type="number" id="capacity" name="capacity" value={newEvent.capacity} onChange={handleNewEventChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white font-light" />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button onClick={closeAddEventModal} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 font-semibold">Cancel</button>
                            <button onClick={handleAddEvent} disabled={!newEvent.labId || !newEvent.date || newEvent.capacity <= 0} className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 font-semibold disabled:opacity-50">Add Event</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
);
}
export default AdminPage;