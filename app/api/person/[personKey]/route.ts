import { NextResponse } from 'next/server';
import { getPersonData } from '@/lib/googleSheets';

export async function GET(
  request: Request,
  { params }: { params: { personKey: string } }
) {
  try {
    const personKey = decodeURIComponent(params.personKey);
    const data = await getPersonData(personKey);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching person data:', error);
    return NextResponse.json({ error: 'Failed to fetch person data' }, { status: 500 });
  }
}

export const revalidate = 300;
