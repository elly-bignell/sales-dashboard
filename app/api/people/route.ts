import { NextResponse } from 'next/server';
import { getAllPeopleData } from '@/lib/googleSheets';

export async function GET() {
  try {
    const people = await getAllPeopleData();
    return NextResponse.json(people);
  } catch (error) {
    console.error('Error fetching people:', error);
    return NextResponse.json({ error: 'Failed to fetch people' }, { status: 500 });
  }
}

export const revalidate = 300;
