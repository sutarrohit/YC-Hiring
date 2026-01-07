import { chromium } from 'playwright';
import axios from 'axios';
import { CONFIG } from './config';
import { saveToJson, loadFromJson } from './utils';
import { YCCompany } from '../src/types';
import * as fs from 'fs';
import * as path from 'path';

interface ScrapeOptions {
    limit?: number | 'all';
    year?: string;
    industry?: string;
    region?: string;
    stage?: string;
    query?: string;
    progressCallback?: (message: string) => void;
}

export async function scrapeJobs(options: ScrapeOptions = {}) {
    const log = (message: string) => {
        console.log(message);
        if (options.progressCallback) {
            options.progressCallback(message);
        }
    };

    log('--- YC Job Scraper Bot started ---');
    
    const { limit, year, industry, region, stage, query } = options;
    
    // 1. Fetch company list from /api/hiring with filters
    const companiesLimit = limit === 'all' ? 2000 : (limit || CONFIG.DEFAULT_LIMIT);
    
    // Build query parameters
    const queryParams = new URLSearchParams({
        limit: companiesLimit.toString(),
        ...(query && { q: query }),
        ...(year && { year }),
        ...(industry && { industry }),
        ...(region && { region }),
        ...(stage && { stage })
    });
    
    log(`Fetching ${companiesLimit} companies from ${CONFIG.API_URL}...`);
    if (year || industry || region || stage || query) {
        log(`Filters: ${queryParams.toString()}`);
    }
    
    let companies: YCCompany[] = [];
    try {
        log(`Trying local API: ${CONFIG.API_URL}...`);
        const response = await axios.get(`${CONFIG.API_URL}?${queryParams.toString()}`);
        companies = response.data.companies;
    } catch (error: any) {
        log('Local API failed, falling back to static YC data source...');
        try {
            const fallbackUrl = 'https://yc-oss.github.io/api/companies/hiring.json';
            const response = await axios.get(fallbackUrl);
            // Apply filters manually for fallback
            let filteredCompanies = response.data;
            
            if (year) {
                const yearLower = year.toLowerCase();
                filteredCompanies = filteredCompanies.filter((c: YCCompany) => {
                    const batch = c.batch?.toLowerCase() || '';
                    if (/^\d{4}$/.test(yearLower)) {
                        const shortYear = yearLower.substring(2);
                        return batch.includes(yearLower) || 
                               batch.includes(`w${shortYear}`) || 
                               batch.includes(`s${shortYear}`) ||
                               batch.endsWith(` ${shortYear}`) ||
                               batch === shortYear;
                    }
                    return batch.includes(yearLower);
                });
            }
            if (industry) {
                filteredCompanies = filteredCompanies.filter((c: YCCompany) => 
                    c.industries?.some(i => i.toLowerCase().includes(industry.toLowerCase()))
                );
            }
            if (region) {
                filteredCompanies = filteredCompanies.filter((c: YCCompany) => 
                    c.all_locations?.toLowerCase().includes(region.toLowerCase())
                );
            }
            if (stage) {
                filteredCompanies = filteredCompanies.filter((c: YCCompany) => 
                    c.stage?.toLowerCase().includes(stage.toLowerCase())
                );
            }
            if (query) {
                const q = query.toLowerCase();
                filteredCompanies = filteredCompanies.filter((c: YCCompany) => 
                    c.name?.toLowerCase().includes(q)
                );
            }
            
            companies = filteredCompanies.slice(0, companiesLimit);
        } catch (fallbackError: any) {
            log('All data sources failed: ' + fallbackError.message);
            return { success: false, error: fallbackError.message };
        }
    }

    log(`Found ${companies.length} companies. Starting scrape...`);
    
    // If user searched for a specific company name, only scrape that company
    if (query && companies.length > 0) {
        log(`Searching for company: "${query}"`);
        const matchedCompany = companies.find(c => 
            c.name?.toLowerCase() === query.toLowerCase()
        );
        
        if (matchedCompany) {
            companies = [matchedCompany];
            log(`Found exact match: ${matchedCompany.name}`);
        } else {
            // Partial match - take first result
            companies = [companies[0]];
            log(`Using closest match: ${companies[0].name}`);
        }
    }

    const browser = await chromium.launch({ headless: CONFIG.HEADLESS });
    const context = await browser.newContext();
    
    // Check if jobs.json exists and has data
    let results: any[] = [];
    const existingData = loadFromJson(CONFIG.JOBS_FILE);
    
    if (existingData && existingData.length > 0) {
        log(`⚠️  Found ${existingData.length} existing records in jobs.json`);
        
        // Automatically create backup with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const backupFile = `${CONFIG.RESULTS_DIR}/backup/jobs-${timestamp}.json`;
        saveToJson(existingData, backupFile);
        log(`✅ Backup created: ${backupFile}`);
        log('Starting fresh scrape...');
    } else {
        log('No existing data found. Starting fresh scrape...');
    }

    let totalJobs = 0;

    for (let i = 0; i < companies.length; i++) {
        const company = companies[i];
        const jobUrl = `${company.url}/jobs`;
        log(`[${i + 1}/${companies.length}] Scraping ${company.name}...`);

        const page = await context.newPage();
        try {
            await page.goto(jobUrl, { waitUntil: 'networkidle', timeout: 30000 });

            const noJobsText = await page.locator('text=No jobs at').count();
            
            const companyJobs: any[] = [];

            if (noJobsText === 0) {
                const jobCards = await page.locator('div.flex.w-full.flex-row.items-start.justify-between.py-4').all();
                
                for (const card of jobCards) {
                    try {
                        const titleElement = card.locator('.ycdc-with-link-color a');
                        const title = await titleElement.textContent();
                        const jobLink = await titleElement.getAttribute('href');
                        
                        const detailsContainer = card.locator('div.justify-left.flex.flex-row.flex-wrap');
                        const detailElements = await detailsContainer.locator('div.capitalize').allTextContents();
                        
                        let location = '';
                        let salary = '';
                        let equity = '';
                        
                        for (const detail of detailElements) {
                            const trimmed = detail.trim();
                            if (trimmed.includes('$') || trimmed.includes('£') || trimmed.includes('€') || trimmed.includes('K')) {
                                salary = trimmed;
                            } else if (trimmed.includes('%')) {
                                equity = trimmed;
                            } else if (!location && trimmed.length > 0) {
                                location = trimmed;
                            }
                        }
                        
                        companyJobs.push({
                            title: title?.trim() || '',
                            location: location,
                            salary: salary,
                            equity: equity,
                            url: jobLink ? `https://www.ycombinator.com${jobLink}` : ''
                        });
                    } catch (cardError: any) {
                        log(`   Warning: Failed to parse a job card: ${cardError.message}`);
                    }
                }
            }

            const companyResult = {
                id: company.id,
                name: company.name,
                slug: company.slug,
                url: company.url,
                jobs: companyJobs,
                scraped_at: new Date().toISOString()
            };

            results.push(companyResult);
            totalJobs += companyJobs.length;
            
            saveToJson(results, CONFIG.JOBS_FILE);
            log(`   ✓ Found ${companyJobs.length} jobs. Saved to file.`);

        } catch (err: any) {
            log(`   ✗ Failed to scrape ${company.name}: ${err.message}`);
            const errorResult = {
                id: company.id,
                name: company.name,
                url: company.url,
                jobs: [],
                error: err.message,
                scraped_at: new Date().toISOString()
            };
            results.push(errorResult);
            saveToJson(results, CONFIG.JOBS_FILE);
        } finally {
            await page.close();
        }
    }

    await browser.close();

    log(`\n✅ Scraping complete!`);
    log(`Total companies scraped: ${results.length}`);
    log(`Total jobs found: ${totalJobs}`);
    log(`Results saved to ${CONFIG.JOBS_FILE}`);
    
    return { 
        success: true, 
        companiesScraped: results.length, 
        jobsFound: totalJobs,
        results 
    };
}
