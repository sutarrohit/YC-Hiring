'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

interface Job {
  title: string;
  location: string;
  salary: string;
  equity: string;
  url: string;
}

interface CompanyResult {
  id: number;
  name: string;
  slug: string;
  url: string;
  jobs: Job[];
  scraped_at: string;
}

export default function ScraperPage() {
  const [limit, setLimit] = useState('10');
  const [year, setYear] = useState('');
  const [industry, setIndustry] = useState('');
  const [region, setRegion] = useState('');
  const [stage, setStage] = useState('');
  const [query, setQuery] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const [results, setResults] = useState<any>(null);
  const [scrapedData, setScrapedData] = useState<CompanyResult[]>([]);
  const [isLoadingExisting, setIsLoadingExisting] = useState(true);
  const [resultsSearchQuery, setResultsSearchQuery] = useState('');
  const eventSourceRef = useRef<EventSource | null>(null);

  // Load existing data on mount
  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const response = await axios.get('/api/scraper/results');
      if (response.data.data && response.data.data.length > 0) {
        setScrapedData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load existing data:', error);
    } finally {
      setIsLoadingExisting(false);
    }
  };

  const handleStartScraper = async () => {
    setIsRunning(true);
    setProgress(['Starting scraper...']);
    setResults(null);

    // Build query parameters
    const params = new URLSearchParams({
      limit: limit || '10',
      ...(year && { year }),
      ...(industry && { industry }),
      ...(region && region !== 'any' && { region }),
      ...(stage && stage !== 'any' && { stage }),
      ...(query && { query })
    });

    // Create EventSource for Server-Sent Events
    const eventSource = new EventSource(`/api/scraper/stream?${params.toString()}`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'complete') {
        setProgress(prev => [...prev, '\n✅ Scraping completed!']);
        setResults(data);
        if (data.results) {
          setScrapedData(data.results);
        }
        eventSource.close();
        setIsRunning(false);
      } else if (data.type === 'error') {
        setProgress(prev => [...prev, `\n❌ Error: ${data.message}`]);
        eventSource.close();
        setIsRunning(false);
      } else if (data.message) {
        setProgress(prev => [...prev, data.message]);
      }
    };

    eventSource.onerror = () => {
      setProgress(prev => [...prev, '\n❌ Connection error']);
      eventSource.close();
      setIsRunning(false);
    };
  };

  const handleStop = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      setIsRunning(false);
      setProgress(prev => [...prev, '\n⚠️ Scraping stopped by user']);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-neutral-700 to-neutral-900 dark:from-neutral-300 dark:to-neutral-600">Job Scraper </span>
            <span className="text-gray-900 dark:text-white">Control Panel</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Configure and run the YC job scraper with custom filters
          </p>
        </div>

        {/* Scraper Configuration */}
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-neutral-300">
                Search by Company Name
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isRunning}
                className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none disabled:opacity-50"
                placeholder="e.g., Stripe, Airbnb"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-neutral-300 flex justify-between">
                Number of Companies
                <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setLimit(limit === 'all' ? '10' : 'all')}>
                  <div className={`w-8 h-4 rounded-full transition-colors relative ${limit === 'all' ? 'bg-orange-600' : 'bg-gray-300 dark:bg-neutral-700'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${limit === 'all' ? 'left-4.5' : 'left-0.5'}`} style={{ left: limit === 'all' ? '18px' : '2px' }} />
                  </div>
                  <span className="text-xs">All Companies</span>
                </div>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={limit === 'all' ? '' : limit}
                  onChange={(e) => setLimit(e.target.value)}
                  disabled={isRunning || limit === 'all'}
                  className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none disabled:opacity-50"
                  placeholder={limit === 'all' ? '' : '10'}
                  min="1"
                />
                {limit === 'all' && (
                  <div className="absolute inset-0 flex items-center px-4 pointer-events-none text-white  ">
                    All Companies
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-neutral-300">
                Year
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                disabled={isRunning}
                className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none disabled:opacity-50"
                placeholder="e.g., 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-neutral-300">
                Industry
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                disabled={isRunning}
                className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none disabled:opacity-50"
                placeholder="e.g., AI, Fintech"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-neutral-300">
                REGION
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                disabled={isRunning}
                className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none disabled:opacity-50 appearance-none cursor-pointer"
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

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-neutral-300">
                STAGE
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                disabled={isRunning}
                className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none disabled:opacity-50 appearance-none cursor-pointer"
              >
                <option value="">Any Stage</option>
                <option value="Early">Early</option>
                <option value="Growth">Growth</option>
                <option value="Late">Late</option>
                <option value="Public">Public</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleStartScraper}
              disabled={isRunning}
              className="flex-1 bg-orange-600 hover:bg-orange-500 disabled:bg-neutral-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {isRunning ? 'Scraping...' : 'Start Scraper'}
            </button>
            {isRunning && (
              <button
                onClick={handleStop}
                className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Stop
              </button>
            )}
          </div>
        </div>

        {/* Progress */}
        {progress.length > 0 && (
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isRunning ? 'Live Progress' : 'Status'}
              </h2>
              {isRunning && (
                <div className="flex items-center gap-2 text-orange-500">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Running</span>
                </div>
              )}
            </div>
            
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
              {progress.map((msg, idx) => (
                <div key={idx} className="text-gray-900 dark:text-neutral-300 mb-1">
                  {msg}
                </div>
              ))}
            </div>

            {results && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-700 dark:text-green-400 font-bold mb-2">
                  ✓ Scraping completed successfully!
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-neutral-400">Companies scraped:</span>
                    <span className="ml-2 font-bold text-gray-900 dark:text-white">{results.companiesScraped}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-neutral-400">Jobs found:</span>
                    <span className="ml-2 font-bold text-gray-900 dark:text-white">{results.jobsFound}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

           {/* Info Box */}
        <div className="my-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Note:</strong> Results are saved incrementally to <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">bot/results/jobs.json</code> after each company is scraped.
          </p>
        </div>

        {/* Scraped Data Display */}
        {isLoadingExisting ? (
          <div className="text-center py-8 text-gray-500 dark:text-neutral-500">
            Loading existing data...
          </div>
        ) : scrapedData.length > 0 ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {results ? 'Latest Results' : 'Previously Scraped Data'}
                </h2>
                {!results && (
                  <span className="text-sm text-gray-500 dark:text-neutral-500">
                    {scrapedData.length} {scrapedData.length === 1 ? 'company' : 'companies'}
                  </span>
                )}
              </div>
              
              {/* Search Bar for Results */}
              <div className="w-full md:w-96">
                <input
                  type="text"
                  value={resultsSearchQuery}
                  onChange={(e) => setResultsSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Filter by company or job title..."
                />
              </div>
            </div>

            <div className="border border-gray-200 dark:border-neutral-800 rounded-lg overflow-y-auto max-h-[2000px] p-4 space-y-6">
              {scrapedData
                .map(company => {
                  if (!resultsSearchQuery) return company;
                  const query = resultsSearchQuery.toLowerCase();
                  
                  // If company name matches, we show the company
                  const companyMatches = company.name.toLowerCase().includes(query);
                  
                  // Filter jobs that match the query
                  const matchingJobs = company.jobs.filter(job => 
                    job.title.toLowerCase().includes(query)
                  );
                  
                  // If company matches OR has matching jobs, return it with potentially filtered jobs
                  if (companyMatches || matchingJobs.length > 0) {
                    return {
                      ...company,
                      // If company name matches, show all jobs, otherwise only showing matching jobs
                      jobs: companyMatches ? company.jobs : matchingJobs
                    };
                  }
                  
                  return null;
                })
                .filter((company): company is CompanyResult => company !== null)
                .map((company) => (
              <div key={company.id} className="bg-white dark:bg-neutral-900 border border-orange-800 rounded-xl p-6">
                {/* Company Header */}
                <div className="mb-4 pb-4 border-b border-gray-200 dark:border-neutral-800">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    <span className="text-gray-600 dark:text-neutral-400">Name : </span> <span className="font-bold text-orange-500">{company.name}</span>
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-neutral-400">
                    <a 
                      href={company.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-orange-500 transition-colors"
                    >
                      View on YC →
                    </a>
                    <span>•</span>
                    <span>{company.jobs.length} {company.jobs.length === 1 ? 'job' : 'jobs'} found</span>
                    <span>•</span>
                    <span className="text-xs">
                      Scraped {new Date(company.scraped_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Jobs List */}
                {company.jobs.length > 0 ? (
                  <div className="space-y-4">
                    {company.jobs.map((job, idx) => (
                      <div key={idx} className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {job.title}
                          </h4>
                          <a 
                            href={job.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:text-orange-500 text-sm font-medium whitespace-nowrap ml-4"
                          >
                            Apply →
                          </a>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-neutral-400">
                          {job.location && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">📍</span>
                              <span>{job.location}</span>
                            </div>
                          )}
                          {job.salary && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">💰</span>
                              <span>{job.salary}</span>
                            </div>
                          )}
                          {job.equity && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">📈</span>
                              <span>{job.equity}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-neutral-500 italic">
                    No jobs currently posted for this company.
                  </p>
                )}
              </div>
            ))}
            
            {scrapedData.filter(company => {
              if (!resultsSearchQuery) return true;
              const query = resultsSearchQuery.toLowerCase();
              if (company.name.toLowerCase().includes(query)) return true;
              return company.jobs.some(job => job.title.toLowerCase().includes(query));
            }).length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-neutral-500">
                No results match your search query.
              </div>
            )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg">
            <p className="text-gray-500 dark:text-neutral-500 mb-2">
              No scraped data available yet.
            </p>
            <p className="text-sm text-gray-400 dark:text-neutral-600">
              Configure filters above and click "Start Scraper" to begin.
            </p>
          </div>
        )}

     
      </div>
    </main>
  );
}
