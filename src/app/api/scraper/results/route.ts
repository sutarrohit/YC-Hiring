import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  try {
    const jobsFilePath = path.join(process.cwd(), 'bot', 'results', 'jobs.json');
    
    if (!fs.existsSync(jobsFilePath)) {
      return NextResponse.json({ data: [] });
    }

    const fileContent = fs.readFileSync(jobsFilePath, 'utf8');
    
    if (!fileContent || fileContent.trim() === '') {
      return NextResponse.json({ data: [] });
    }

    const data = JSON.parse(fileContent);
    return NextResponse.json({ data });

  } catch (error: any) {
    console.error('Error reading jobs.json:', error);
    return NextResponse.json({ data: [], error: error.message }, { status: 500 });
  }
}
