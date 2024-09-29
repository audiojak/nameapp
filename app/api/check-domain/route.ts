import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { name } = await req.json();
  const domains = ['.com', '.ai', '.io'];
  const results: Record<string, any> = {};

  for (const domain of domains) {
    const url = `https://${name}${domain}`;
    try {
      console.log(`Checking domain: ${url}`);
      const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
      results[domain] = {
        isAvailable: false, // If we can reach the site, it's not available
        statusCode: response.status,
        error: null
      };
    } catch (error) {
      console.error(`Error checking domain ${url}:`, error);
      results[domain] = {
        isAvailable: true, // If we can't reach the site, it might be available
        statusCode: 'ERROR',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  console.log('Final results:', JSON.stringify(results, null, 2));
  return NextResponse.json(results);
}