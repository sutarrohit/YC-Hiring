import { scrapeJobs } from './scraper-lib';

interface ScrapeOptions {
    limit?: number;
    year?: string;
    industry?: string;
    region?: string;
    stage?: string;
    query?: string;
}

// Handle command line arguments
// Usage: npm run bot:scrape -- [limit] --year=2024 --industry=AI --region=SF --stage=Early --query=search
const args = process.argv.slice(2);
const options: ScrapeOptions = {};

// First argument without -- is the limit
const limitArg = args.find(arg => !arg.startsWith('--') && !isNaN(Number(arg)));
if (limitArg) {
    options.limit = parseInt(limitArg);
}

// Parse flag arguments
args.forEach(arg => {
    if (arg.startsWith('--')) {
        const [key, value] = arg.slice(2).split('=');
        if (value) {
            switch(key) {
                case 'year':
                    options.year = value;
                    break;
                case 'industry':
                    options.industry = value;
                    break;
                case 'region':
                    options.region = value;
                    break;
                case 'stage':
                    options.stage = value;
                    break;
                case 'query':
                case 'q':
                    options.query = value;
                    break;
            }
        }
    }
});

scrapeJobs(options);
