'use client';

// import { useState } from 'react';
// import { motion } from 'framer-motion';
const departments = [
  {
    name: "Applied Mathematics and Computational Sciences",
    location: "Stony Brook University",
    image: "url_to_image_applied_mathematics.jpg",
    description: "Focuses on mathematical modeling, computational techniques, and data analysis to solve complex problems in various fields."
  },
  {
    name: "Applied Science",
    location: "Various Institutions",
    image: "url_to_image_applied_science.jpg",
    description: "Integrates scientific principles with practical applications to address real-world challenges."
  },
  {
    name: "Apparel and Fashion Design",
    location: "Fashion Institutes",
    image: "url_to_image_apparel_fashion.jpg",
    description: "Covers the design, production, and marketing of clothing and accessories, emphasizing creativity and innovation."
  },
  {
    name: "Automobile Engineering",
    location: "Engineering Colleges",
    image: "url_to_image_automobile_engineering.jpg",
    description: "Focuses on the design, development, and manufacturing of vehicles, including cars, trucks, and motorcycles."
  },
  {
    name: "Biomedical Engineering",
    location: "Various Universities",
    image: "url_to_image_biomedical_engineering.jpg",
    description: "Combines engineering principles with medical and biological sciences to improve healthcare and medical devices."
  },
  {
    name: "Civil Engineering",
    location: "Engineering Schools",
    image: "url_to_image_civil_engineering.jpg",
    description: "Involves the design, construction, and maintenance of infrastructure such as roads, bridges, and buildings."
  },
  {
    name: "Computer Science & Engineering",
    location: "Tech Universities",
    image: "url_to_image_computer_science.jpg",
    description: "Focuses on the theory, development, and application of computer systems and software."
  },
  {
    name: "Computer Applications",
    location: "Various Institutions",
    image: "url_to_image_computer_applications.jpg",
    description: "Covers the use of computer software and systems to solve practical problems in various fields."
  },
  {
    name: "Electrical & Electronics Engineering",
    location: "Engineering Colleges",
    image: "url_to_image_electrical_engineering.jpg",
    description: "Focuses on the study and application of electricity, electronics, and electromagnetism."
  },
  {
    name: "Electronics & Communication Engineering",
    location: "Tech Universities",
    image: "url_to_image_electronics_communication.jpg",
    description: "Involves the design and development of electronic devices and communication systems."
  },
  {
    name: "Instrumentation & Control Engineering",
    location: "Engineering Schools",
    image: "url_to_image_instrumentation_control.jpg",
    description: "Focuses on the design and management of instruments and control systems used in industrial processes."
  },
  {
    name: "MBA",
    location: "Business Schools",
    image: "url_to_image_mba.jpg",
    description: "A graduate degree focusing on business management, leadership, and strategic decision-making."
  },
  {
    name: "Mechanical Engineering",
    location: "Engineering Colleges",
    image: "url_to_image_mechanical_engineering.jpg",
    description: "Involves the design, analysis, and manufacturing of mechanical systems and devices."
  },
  {
    name: "Metallurgical Engineering",
    location: "Engineering Schools",
    image: "url_to_image_metallurgical_engineering.jpg",
    description: "Focuses on the study of metals and their properties, including extraction, processing, and application."
  },
  {
    name: "Production Engineering",
    location: "Various Institutions",
    image: "url_to_image_production_engineering.jpg",
    description: "Involves the design and management of production processes and systems in manufacturing."
  },
  {
    name: "Robotics & Automation Engineering",
    location: "Tech Universities",
    image: "url_to_image_robotics_automation.jpg",
    description: "Focuses on the design and development of robotic systems and automation technologies."
  },
  {
    name: "Biotechnology",
    location: "Various Universities",
    image: "url_to_image_biotechnology.jpg",
    description: "Combines biology and technology to develop products and processes for healthcare, agriculture, and industry."
  },
  {
    name: "Fashion Technology",
    location: "Fashion Institutes",
    image: "url_to_image_fashion_technology.jpg",
    description: "Focuses on the technological aspects of fashion design, production, and marketing."
  },
  {
    name: "Information Technology",
    location: "Tech Universities",
    image: "url_to_image_information_technology.jpg",
    description: "Involves the use of computers and software to manage information systems and data."
  },
  {
    name: "Textile Technology",
    location: "Textile Institutes",
    image: "url_to_image_textile_technology.jpg",
    description: "Focuses on the production and processing of textiles, including fibers, fabrics, and garments."
  },
  {
    name: "Electrical & Electronics Engineering (Sandwich)",
    location: "Engineering Colleges",
    image: "url_to_image_electrical_sandwich.jpg",
    description: "A variant of Electrical & Electronics Engineering that includes practical training in industry."
  },
  {
    name: "Mechanical Engineering (Sandwich)",
    location: "Engineering Schools",
    image: "url_to_image_mechanical_sandwich.jpg",
    description: "A variant of Mechanical Engineering that incorporates work placements in industry."
  },
  {
    name: "Production Engineering (Sandwich)",
    location: "Various Institutions",
    image: "url_to_image_production_sandwich.jpg",
    description: "A variant of Production Engineering that includes practical training in manufacturing settings."
  }
];


// export default function HomePage() {
//   const [search, setSearch] = useState('');
//   const [selectedDepartment, setSelectedDepartment] = useState('');

//   const filteredDepartments = departments.filter((dept) =>
//     (dept.toLowerCase().includes(search.toLowerCase()) || search === '') &&
//     (selectedDepartment === '' || dept === selectedDepartment)
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       {/* Title and Register Now */}
//       <motion.h1 
//         initial={{ opacity: 0, y: -50 }} 
//         animate={{ opacity: 1, y: 0 }} 
//         transition={{ duration: 0.8 }}
//         className="text-4xl font-bold text-center mb-6"
//       >
//         College Open House 2025
//       </motion.h1>
      
//       <motion.button 
//         initial={{ scale: 0 }} 
//         animate={{ scale: 1 }} 
//         transition={{ duration: 0.5 }}
//         className="block mx-auto bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700"
//       >
//         Register Now
//       </motion.button>

//       {/* Search and Filter */}
//       <div className="mt-6 flex justify-center gap-4">
//         <input 
//           type="text" 
//           placeholder="Search by department..." 
//           value={search} 
//           onChange={(e) => setSearch(e.target.value)}
//           className="p-2 border border-gray-300 rounded-md"
//         />
//         <select 
//           value={selectedDepartment} 
//           onChange={(e) => setSelectedDepartment(e.target.value)}
//           className="p-2 border border-gray-300 rounded-md"
//         >
//           <option value="">All Departments</option>
//           {departments.map((dept) => (
//             <option key={dept} value={dept}>{dept}</option>
//           ))}
//         </select>
//       </div>

//       {/* Department Cards */}
//       <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredDepartments.map((dept) => (
//           <motion.div 
//             key={dept} 
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5 }}
//             className="bg-white p-4 rounded-lg shadow-md"
//           >
//             {/* <img src={dept} alt={dept.name} className="w-full h-40 object-cover rounded-md" /> */}
//             {/* <h2 className="text-xl font-bold mt-4">{dept.name}</h2>
//             <p className="text-gray-600 mt-2">{dept.location}</p>
//             <p className="text-gray-800 mt-2">{dept.description}</p> */}
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    institute: '',
    name: '',
    email: '',
    students: '',
    date: ''
  });

  const handleInputChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    alert('Registration submitted!');
    setIsModalOpen(false);
  };
  const verifyEmail = () => {
    alert('Verification email sent! Please check your inbox.');
  };

  const filteredDepartments = departments.filter((dept) =>
    (dept.name.toLowerCase().includes(search.toLowerCase()) || search === '') &&
    (selectedDepartment === '' || dept.name === selectedDepartment)
  );

  return (
    <div className="relative min-h-screen bg-black text-white p-6">
      {/* Background Video */}
      <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover opacity-50">
        <source src="open-house\public\videos\v1.mp4" type="video/mp4" />
      </video>
      
      <div className="relative z-10">
        {/* Title and Register Now */}
        <motion.h1 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold text-center mb-6"
        >
          PSG Open House 2025
        </motion.h1>
        
        <motion.button 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ duration: 0.5 }}
          onClick={() => setIsModalOpen(true)}
          className="block mx-auto bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
        >
          Register Now
        </motion.button>

        {/* Registration Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-900 p-10 rounded-lg shadow-md w-120 h-120">
              <h2 className="text-2xl font-bold mb-4">Register</h2>
              <input type="text" name="institute" placeholder="Institute Name" value={formData.institute} onChange={handleInputChange} className="w-full p-2 mb-2 rounded bg-gray-800 text-white" />
              <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleInputChange} className="w-full p-2 mb-2 rounded bg-gray-800 text-white" />
              <div className="flex gap-2">
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="w-full p-2 rounded bg-gray-800 text-white" />
                <button onClick={verifyEmail} className="bg-yellow-500 text-white px-4 py-2 rounded">Verify</button>
              </div>
              <input type="number" name="students" placeholder="No. of Students" value={formData.students} onChange={handleInputChange} className="w-full p-2 mt-2 mb-2 rounded bg-gray-800 text-white" />
              <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full p-2 mb-4 rounded bg-gray-800 text-white" />
              <div className="flex justify-between">
                <button onClick={() => setIsModalOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded">Cancel</button>
                <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mt-6 flex justify-center gap-4">
          <input 
            type="text" 
            placeholder="Search by department..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border border-gray-300 rounded-md bg-gray-800 text-white"
          />
          <select 
            value={selectedDepartment} 
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="p-2 border border-gray-300 rounded-md bg-gray-800 text-white"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.name} value={dept.name}>{dept.name}</option>
            ))}
          </select>
        </div>

        {/* Department Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((dept) => (
            <motion.div 
              key={dept.name} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900 p-4 rounded-lg shadow-md"
            >
              <img src={dept.image} alt={dept.name} className="w-full h-40 object-cover rounded-md" />
              <h2 className="text-xl font-bold mt-4">{dept.name}</h2>
              <p className="text-gray-400 mt-2">{dept.location}</p>
              <p className="text-gray-300 mt-2">{dept.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}


