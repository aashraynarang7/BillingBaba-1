"use client"
import React, { useState, useEffect } from 'react';
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  experience: string;
  type: string;
}

type GroupedJobs = {
  [key: string]: Job[];
};

const allJobs: Job[] = [
  { id: 1, title: 'Admin - Executive', department: 'Admin', location: 'Bengaluru', experience: '1 Year', type: 'Full Time' },
  { id: 2, title: 'Customer Support Executive', department: 'Customer Experience-Inbound', location: 'Bengaluru', experience: '0-4yrs', type: 'Full Time' },
  { id: 3, title: 'Customer Success Specialist', department: 'Customer Experience-Success', location: 'Bengaluru', experience: '1 - 4 Yrs', type: 'Full Time' },
  { id: 4, title: 'IPT - Inside Sales Partner Team - Bangalore', department: 'Distribution (Partner)', location: 'Bengaluru', experience: '1 - 3 Yrs', type: 'Full Time' },
  { id: 5, title: 'Inside Sales Executive', department: 'Inside Sales Team', location: 'Delhi', experience: '0-2yrs', type: 'Full Time' },
  { id: 6, title: 'Field Sales Manager', department: 'Field Sales Team', location: 'Ahmedabad', experience: '2 - 5 Yrs', type: 'Full Time' },
  { id: 7, title: 'HR Operations Specialist', department: 'HR - Operation', location: 'Gurugram', experience: '2+ Yrs', type: 'Full Time' },
  { id: 8, title: 'Marketing Manager', department: 'Marketing', location: 'Noida', experience: '3+ Yrs', type: 'Part Time' },
  { id: 9, title: 'Senior Software Engineer', department: 'Product', location: 'Pune', experience: '4+ Yrs', type: 'Full Time' },
  { id: 10, title: 'SEO Analyst', department: 'Search Engine Optimization', location: 'Mumbai', experience: '1 - 2 Yrs', type: 'Full Time' },
  { id: 11, title: 'Data Scientist', department: 'Growth & Strategy', location: 'Hyderabad', experience: '3+ Yrs', type: 'Full Time' },
];

const JobSearch = () => {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(allJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [department, setDepartment] = useState('');
  const [jobType, setJobType] = useState('');

  useEffect(() => {
    let jobs: Job[] = [...allJobs];
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    if (lowercasedSearchTerm) {
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(lowercasedSearchTerm) ||
        job.location.toLowerCase().includes(lowercasedSearchTerm)
      );
    }
    if (location) {
      jobs = jobs.filter(job => job.location === location);
    }
    if (department) {
      jobs = jobs.filter(job => job.department === department);
    }
    if (jobType) {
      jobs = jobs.filter(job => job.type === jobType);
    }

    setFilteredJobs(jobs);
  }, [searchTerm, location, department, jobType]);

  const locations = [...new Set(allJobs.map(job => job.location))].sort();
  const departments = [...new Set(allJobs.map(job => job.department))].sort();
  const jobTypes = [...new Set(allJobs.map(job => job.type))].sort();

  const groupedJobs = filteredJobs.reduce<GroupedJobs>((acc, job) => {
    const key = job.department;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(job);
    return acc;
  }, {});

  return (
    <section className="flex flex-col h-screen bg-white px-10 md:px-20">
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input 
                type="text"
                placeholder="Search by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            
            <select value={location} onChange={(e) => setLocation(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 px-4 py-2.5 transition">
              <option value="">All Locations</option>
              {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
            
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 px-4 py-2.5 transition">
              <option value="">All Departments</option>
              {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
            </select>
            
            <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 px-4 py-2.5 transition">
              <option value="">All Job Types</option>
              {jobTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="container mx-auto p-6 space-y-10">
          {Object.keys(groupedJobs).length > 0 ? (
            Object.keys(groupedJobs).map(dept => (
              <div key={dept}>
                <h2 className="text-xl font-bold text-gray-800 mb-4">{dept}</h2>
                <div className="space-y-4">
                  {groupedJobs[dept].map(job => (
                    <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-blue-500 transition-all duration-300 cursor-pointer">
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-gray-500 mt-1">
                        {job.location} &bull; {job.experience} &bull; {job.type}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No open positions found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobSearch;