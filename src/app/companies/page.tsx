'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { YCCompany, PaginatedResponse } from '@/types';
import CompanyCard from '@/components/CompanyCard';

export default function CompaniesPage() {
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

  useEffect(() => {
    async function fetchCompanies() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<PaginatedResponse>(`/api/hiring?page=${page}&limit=${limit}&q=${encodeURIComponent(debouncedQuery)}`);
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
  }, [page, limit, debouncedQuery]);

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
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-neutral-100 sm:text-4xl tracking-tight transition-colors">
            All Hiring Companies
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-neutral-400 mb-6 transition-colors">
            {total} companies found
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
                <input
                    type="text"
                    placeholder="Search by name, industry, region, stage, year (e.g. 2021)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-neutral-100 placeholder-gray-500 dark:placeholder-neutral-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
            </div>
        </div>

        {/* Pagination Controls (Top) */}
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

        {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-64 bg-gray-200 dark:bg-neutral-900 rounded-lg border border-gray-300 dark:border-neutral-800"></div>
                ))}
             </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
            ))}
            </div>
        )}

        {/* Pagination Controls (Bottom) */}
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
      </div>
    </main>
  );
}
