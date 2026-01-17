'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { YCCompany, PaginatedResponse } from '@/types';
import CompanyCard from '@/components/CompanyCard';
import AdvancedFilter, { FilterState } from '@/components/AdvancedFilter';
import Pagination from '@/components/Pagination';

export default function Home() {
  const [companies, setCompanies] = useState<YCCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(100);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Advanced Filters
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
  const [showFilters, setShowFilters] = useState(false);

  // Debounce Effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1); // Reset to page 1 on new search
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

   const handleFilterChange = useCallback((newFilters: FilterState) => {
      setFilters(newFilters);
      setPage(1);
  }, []);

  useEffect(() => {
    async function fetchCompanies() {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            q: debouncedQuery,
            year: filters.year,
            industry: filters.industry,
            region: filters.region,
            stage: filters.stage,
            teamSizeMin: filters.teamSizeMin,
            teamSizeMax: filters.teamSizeMax,
            status: filters.status.join(','),
            topCompany: filters.topCompany.toString(),
            nonprofit: filters.nonprofit.toString(),
            tags: filters.tags.join(','),
            launchedAfter: filters.launchedAfter,
            launchedBefore: filters.launchedBefore,
            subindustry: filters.subindustry
        });
        const response = await axios.get<PaginatedResponse>(`/api/hiring?${queryParams.toString()}`);
        setCompanies(response.data.companies);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch hiring companies.');
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, [page, limit, debouncedQuery, filters]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && companies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950 transition-colors">
        <div className="text-xl text-gray-600 dark:text-neutral-500 animate-pulse">Loading companies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950 transition-colors">
        <div className="text-xl text-red-600 dark:text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-neutral-700 to-neutral-900 dark:from-neutral-300 dark:to-neutral-600">Work at a </span>
              <span className="text-gray-900 dark:text-white">YC Startup</span>
              <span className="text-neutral-400 dark:text-neutral-600">.</span>
            </h1>
            
            <div className="mb-10">
              <p className="text-xl md:text-2xl text-neutral-400 font-medium">
                {total} companies currently hiring
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-10 relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/10 to-orange-600/10 dark:from-orange-500/20 dark:to-orange-600/20 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                
                <div className="relative flex items-center bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-full p-2 shadow-sm dark:shadow-none">
                    <div className="pl-4 text-neutral-400 dark:text-neutral-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, tags, description, industry, region..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none text-gray-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:ring-0 px-4 py-1 text-lg w-full outline-none mr-4"
                    />
                </div>
            </div>

            {/* Filter Controls */}
            <div className="max-w-2xl mx-auto flex justify-between items-center mb-6">
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 text-orange-600 dark:text-orange-500 hover:border-orange-500/30 dark:hover:border-orange-500/50 transition-all font-bold tracking-wider text-sm shadow-sm dark:shadow-none"
                >
                    FILTER RESULTS
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>

                <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] text-neutral-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors text-xs font-bold tracking-wider uppercase shadow-sm dark:shadow-none">
                    <span className="w-2 h-2 rounded-full bg-neutral-200 dark:bg-neutral-700"></span>
                    Hiring Now
                </button>
            </div>

            <AdvancedFilter 
                onFilterChange={handleFilterChange} 
                isOpen={showFilters}
            />
        </div>

        {/* Pagination Controls (Top) */}
        {!loading && companies.length > 0 && (
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={handlePrev}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                        page === 1
                        ? 'bg-gray-200 dark:bg-neutral-900 text-gray-400 dark:text-neutral-600 cursor-not-allowed border border-gray-300 dark:border-neutral-800'
                        : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 border border-gray-300 dark:border-neutral-700 hover:border-gray-400 dark:hover:border-neutral-600 shadow-sm'
                    }`}
                >
                    Previous
                </button>
                <span className="text-gray-600 dark:text-neutral-500 transition-colors">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={handleNext}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                        page === totalPages
                        ? 'bg-gray-200 dark:bg-neutral-900 text-gray-400 dark:text-neutral-600 cursor-not-allowed border border-gray-300 dark:border-neutral-800'
                        : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 border border-gray-300 dark:border-neutral-700 hover:border-gray-400 dark:hover:border-neutral-600 shadow-sm'
                    }`}
                >
                    Next
                </button>
            </div>
        )}

        {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-64 bg-gray-200 dark:bg-neutral-900 rounded-lg border border-gray-300 dark:border-neutral-800"></div>
                ))}
             </div>
        ) : companies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-24 h-24 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-gray-400 dark:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No companies found</h3>
                <p className="text-gray-600 dark:text-neutral-400 text-center max-w-md mb-6">
                    Try adjusting your filters or search terms to find more companies. We have {total} companies available across all filters.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => {
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
                            setSearchQuery('');
                        }}
                        className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Clear All Filters
                    </button>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-6 py-2.5 bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 border border-gray-300 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700 font-medium rounded-lg transition-colors"
                    >
                        Adjust Filters
                    </button>
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
            ))}
            </div>
        )}

        {/* Pagination Controls (Bottom) */}
        {!loading && companies.length > 0 && (
            <div className="flex justify-between items-center mt-8">
                <button
                    onClick={handlePrev}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                        page === 1
                        ? 'bg-gray-200 dark:bg-neutral-900 text-gray-400 dark:text-neutral-600 cursor-not-allowed border border-gray-300 dark:border-neutral-800'
                        : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 border border-gray-300 dark:border-neutral-700 hover:border-gray-400 dark:hover:border-neutral-600 shadow-sm'
                    }`}
                >
                    Previous
                </button>
                <span className="text-gray-600 dark:text-neutral-500 transition-colors">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={handleNext}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                        page === totalPages
                        ? 'bg-gray-200 dark:bg-neutral-900 text-gray-400 dark:text-neutral-600 cursor-not-allowed border border-gray-300 dark:border-neutral-800'
                        : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 border border-gray-300 dark:border-neutral-700 hover:border-gray-400 dark:hover:border-neutral-600 shadow-sm'
                    }`}
                >
                    Next
                </button>
            </div>
        )}
      </div>
    </main>
  );
}
