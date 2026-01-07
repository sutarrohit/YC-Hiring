import { NextRequest } from 'next/server';
import { scrapeJobs } from '../../../../../bot/scraper-lib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const limitParam = searchParams.get('limit');
  const limitValue = limitParam === 'all' ? ('all' as const) : parseInt(limitParam || '10');

  const options = {
    limit: limitValue,
    year: searchParams.get('year') || undefined,
    industry: searchParams.get('industry') || undefined,
    region: searchParams.get('region') || undefined,
    stage: searchParams.get('stage') || undefined,
    query: searchParams.get('query') || undefined,
  };

  // Create a readable stream for Server-Sent Events
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      const progressCallback = (message: string) => {
        const data = `data: ${JSON.stringify({ message })}\n\n`;
        controller.enqueue(encoder.encode(data));
      };

      try {
        const result = await scrapeJobs({ ...options, progressCallback });
        
        // Send final result
        const finalData = `data: ${JSON.stringify({ 
          type: 'complete',
          ...result 
        })}\n\n`;
        controller.enqueue(encoder.encode(finalData));
        
      } catch (error: any) {
        const errorData = `data: ${JSON.stringify({ 
          type: 'error',
          message: error.message 
        })}\n\n`;
        controller.enqueue(encoder.encode(errorData));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
