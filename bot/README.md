# YC Job Scraper Bot - Usage Guide

## Basic Usage

Scrape a specific number of companies:
```bash
npm run bot:scrape -- 10
```

## Advanced Filtering

You can now use the same filters available in the web UI:

### Filter by Year
```bash
npm run bot:scrape -- 20 --year=2024
```

### Filter by Industry
```bash
npm run bot:scrape -- 15 --industry=AI
```

### Filter by Region
```bash
npm run bot:scrape -- 10 --region="San Francisco"
```

### Filter by Stage
```bash
npm run bot:scrape -- 10 --stage=Early
```

### Search Query
```bash
npm run bot:scrape -- 10 --query=fintech
# or use shorthand
npm run bot:scrape -- 10 --q=fintech
```

### Combine Multiple Filters
```bash
npm run bot:scrape -- 50 --year=2024 --industry=AI --region=SF --stage=Early
```

## Examples

Scrape all AI companies from 2024:
```bash
npm run bot:scrape -- 100 --year=2024 --industry=AI
```

Scrape fintech startups in San Francisco:
```bash
npm run bot:scrape -- 30 --industry=fintech --region="San Francisco"
```

Search for companies with "healthcare" in their description:
```bash
npm run bot:scrape -- 20 --query=healthcare
```

## Output

Results are saved to `bot/results/jobs.json` incrementally (after each company).
Backups are stored in `bot/results/backup/` when you choose to backup existing data.
