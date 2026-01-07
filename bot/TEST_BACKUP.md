# Testing Backup Prompt

To test the new backup prompt feature, run:

```bash
npm run bot:scrape -- 2
```

When prompted:
- Type `y` or `yes` to create a backup and start fresh
- Type `n` or `no` to continue appending to existing data

The backup file will be named: `jobs-{timestamp}.json`
