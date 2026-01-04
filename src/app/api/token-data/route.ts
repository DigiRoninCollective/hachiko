import { NextResponse } from 'next/server';
import { searchByToken } from '@/lib/dexscreener';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address') || 'HACH1Ko11111111111111111111111111111111';

  try {
    // For now, defaulting to Solana as per the branding
    const data = await searchByToken(address, 'solana');
    
    // If no data found for the vanity address, maybe return mock data or specific error
    // But for now just return what we find
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
