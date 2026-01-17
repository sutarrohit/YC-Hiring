'use client';

import { useState, useEffect } from 'react';

export interface FilterState {
  year: string;
  industry: string;
  region: string;
  stage: string;
  teamSizeMin: string;
  teamSizeMax: string;
  status: string[];
  topCompany: boolean;
  nonprofit: boolean;
  tags: string[];
  launchedAfter: string;
  launchedBefore: string;
  subindustry: string;
}

interface AdvancedFilterProps {
  onFilterChange: (filters: FilterState) => void;
  className?: string;
  isOpen: boolean;
}

export default function AdvancedFilter({ onFilterChange, className, isOpen }: AdvancedFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    year: '',
    industry: '',
    region: '',
    stage: '',
    teamSizeMin: '',
    teamSizeMax: '',
    status: [],
    topCompany: false,
    nonprofit: false,
    tags: [],
    launchedAfter: '',
    launchedBefore: '',
    subindustry: ''
  });

  // Debounce effects to prevent too many API calls
  useEffect(() => {
    const handler = setTimeout(() => {
        onFilterChange(filters);
    }, 500);
    return () => clearTimeout(handler);
  }, [filters, onFilterChange]);


if (!isOpen) return null;

  // Helper functions for filter updates
  const updateFilter = (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const updateStatus = (status: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      status: checked 
        ? [...prev.status, status]
        : prev.status.filter(s => s !== status)
    }));
  };

  const updateTags = (tag: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      tags: checked
        ? [...prev.tags, tag]
        : prev.tags.filter(t => t !== tag)
    }));
  };

  const commonTags = ['AI', 'SaaS', 'FinTech', 'HealthTech', 'B2B', 'B2C', 'Mobile', 'Web', 'DevTools', 'E-commerce'];
  const statusOptions = ['Active', 'Acquired', 'Public', 'Inactive'];
  const yearRange = Array.from({ length: 21 }, (_, i) => 2025 - i);

  const getActiveFiltersCount = () => {
    return [
      filters.year,
      filters.industry,
      filters.region,
      filters.stage,
      filters.teamSizeMin || filters.teamSizeMax,
      filters.status.length > 0,
      filters.topCompany,
      filters.nonprofit,
      filters.tags.length > 0,
      filters.launchedAfter || filters.launchedBefore,
      filters.subindustry
    ].filter(Boolean).length;
  };

  const clearAllFilters = () => {
    setFilters({
      year: '',
      industry: '',
      region: '',
      stage: '',
      teamSizeMin: '',
      teamSizeMax: '',
      status: [],
      topCompany: false,
      nonprofit: false,
      tags: [],
      launchedAfter: '',
      launchedBefore: '',
      subindustry: ''
    });
  };

  return (
    <div className={`w-full max-w-7xl mx-auto mb-6 ${className || ''}`}>
      {/* Basic Filters Section */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm">
        <div className="p-4 border-b border-gray-100 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Quick Filters</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-neutral-500">
                {getActiveFiltersCount()} active
              </span>
              <button
                onClick={clearAllFilters}
                className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Year Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Batch Year</label>
              <input
                type="text"
                placeholder="e.g. 2024, S24"
                value={filters.year}
                onChange={(e) => updateFilter('year', e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>

            {/* Industry Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Industry</label>
              <input
                type="text"
                placeholder="e.g. AI, SaaS, B2B"
                value={filters.industry}
                onChange={(e) => updateFilter('industry', e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>

            {/* Region Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Location</label>
              <select
                value={filters.region}
                onChange={(e) => updateFilter('region', e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              >
                <option value="">All Locations</option>
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Company Stage</label>
              <select
                value={filters.stage}
                onChange={(e) => updateFilter('stage', e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              >
                <option value="">All Stages</option>
                <option value="Early">Early Stage</option>
                <option value="Growth">Growth Stage</option>
                <option value="Scale">Scale Up</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Section */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm mt-4">
        <button
          onClick={() => {
            const details = document.getElementById('advanced-filters');
            details?.toggleAttribute('open');
          }}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors rounded-t-xl"
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Advanced Options</h3>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        <div id="advanced-filters" className="border-t border-gray-100 dark:border-neutral-800">
          <div className="p-4 space-y-6">
            {/* Company Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team Size */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Team Size Range</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Minimum"
                      value={filters.teamSizeMin}
                      onChange={(e) => updateFilter('teamSizeMin', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>
                  <span className="text-gray-400 dark:text-neutral-500">to</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Maximum"
                      value={filters.teamSizeMax}
                      onChange={(e) => updateFilter('teamSizeMax', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Company Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Company Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map(status => (
                    <label key={status} className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-neutral-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(status)}
                        onChange={(e) => updateStatus(status, e.target.checked)}
                        className="rounded border-gray-300 dark:border-neutral-700 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-neutral-300">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Preferences Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Toggles */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Quick Preferences</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-neutral-700">
                    <span className="text-sm text-gray-700 dark:text-neutral-300">Top Companies Only</span>
                    <button
                      onClick={() => updateFilter('topCompany', !filters.topCompany)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        filters.topCompany ? 'bg-orange-600' : 'bg-gray-200 dark:bg-neutral-700'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        filters.topCompany ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-neutral-700">
                    <span className="text-sm text-gray-700 dark:text-neutral-300">Nonprofit Organizations</span>
                    <button
                      onClick={() => updateFilter('nonprofit', !filters.nonprofit)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        filters.nonprofit ? 'bg-orange-600' : 'bg-gray-200 dark:bg-neutral-700'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        filters.nonprofit ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Popular Tags</label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {commonTags.map(tag => (
                    <label key={tag} className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-neutral-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.tags.includes(tag)}
                        onChange={(e) => updateTags(tag, e.target.checked)}
                        className="rounded border-gray-300 dark:border-neutral-700 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-neutral-300">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeline Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Launch Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Founded Between</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <select
                      value={filters.launchedAfter}
                      onChange={(e) => updateFilter('launchedAfter', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    >
                      <option value="">From Year</option>
                      {yearRange.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <span className="text-gray-400 dark:text-neutral-500">and</span>
                  <div className="flex-1">
                    <select
                      value={filters.launchedBefore}
                      onChange={(e) => updateFilter('launchedBefore', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    >
                      <option value="">To Year</option>
                      {yearRange.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Subindustry */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Subindustry</label>
                <input
                  type="text"
                  placeholder="e.g. FinTech, AI/ML, HealthTech"
                  value={filters.subindustry}
                  onChange={(e) => updateFilter('subindustry', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
