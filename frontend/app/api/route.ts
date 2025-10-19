import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
  const res = await fetch(`${base}/arbitrage`, { cache: 'no-store' });
  const data = await res.json();
  return new Response(JSON.stringify(data), { headers: { 'content-type': 'application/json' } });
}