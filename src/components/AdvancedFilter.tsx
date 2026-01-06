'use client';

import { useState, useEffect } from 'react';

interface AdvancedFilterProps {
  onFilterChange: (filters: { year: string; industry: string; region: string; stage: string }) => void;
  className?: string;
  isOpen: boolean;
}

export default function AdvancedFilter({ onFilterChange, className, isOpen }: AdvancedFilterProps) {
  const [year, setYear] = useState('');
  const [industry, setIndustry] = useState('');
  const [region, setRegion] = useState('');
  const [stage, setStage] = useState('');

  // Debounce effects to prevent too many API calls
  useEffect(() => {
    const handler = setTimeout(() => {
        onFilterChange({ year, industry, region, stage });
    }, 500);
    return () => clearTimeout(handler);
  }, [year, industry, region, stage, onFilterChange]);


  if (!isOpen) return null;

  return (
    <div className={`w-full max-w-4xl mx-auto mb-6 ${className || ''}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 shadow-sm animate-in fade-in zoom-in-95 duration-200">
            {/* Year Filter */}
            <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-neutral-500 uppercase">Year</label>
                <input
                    type="text"
                    placeholder="e.g. 2024"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-md bg-gray-50 dark:bg-neutral-950 border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
            </div>

            {/* Industry Filter */}
            <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-neutral-500 uppercase">Industry</label>
                <input
                    type="text"
                    placeholder="e.g. AI, B2B"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-md bg-gray-50 dark:bg-neutral-950 border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
            </div>

             {/* Region Filter */}
             <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-neutral-500 uppercase">Region</label>
                <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-md bg-gray-50 dark:bg-neutral-950 border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                    <option value="">Any Region</option>
                    <option value="United States">United States</option>
                    <option value="Remote">Remote</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia">Asia</option>
                    <option value="India">India</option>
                    <option value="Canada">Canada</option>
                    <option value="San Francisco">San Francisco</option>
                    <option value="New York">New York</option>
                </select>
            </div>

            {/* Stage Filter */}
            <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-neutral-500 uppercase">Stage</label>
                 <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-md bg-gray-50 dark:bg-neutral-950 border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                    <option value="">Any Stage</option>
                    <option value="Early">Early</option>
                    <option value="Growth">Growth</option>
                    <option value="Scale">Scale</option>
                </select>
            </div>
        </div>
      </div>

  );
}
