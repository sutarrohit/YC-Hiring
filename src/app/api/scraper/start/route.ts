import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { limit, year, industry, region, stage, query } = body;

    // Build command with filters
    let command = `npm run bot:scrape -- ${limit || 10}`;
    
    if (year) command += ` --year=${year}`;
    if (industry) command += ` --industry="${industry}"`;
    if (region) command += ` --region="${region}"`;
    if (stage) command += ` --stage="${stage}"`;
    if (query) command += ` --query="${query}"`;

    console.log('Executing scraper command:', command);

    // Execute the scraper in the background
    // Note: This is a fire-and-forget approach
    exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        console.error('Scraper error:', error);
        return;
      }
      console.log('Scraper output:', stdout);
      if (stderr) console.error('Scraper stderr:', stderr);
    });

    return NextResponse.json({
      message: 'Scraper started successfully! Check the terminal for progress.',
      command,
      status: 'running'
    });

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to start scraper', details: error.message },
      { status: 500 }
    );
  }
}
