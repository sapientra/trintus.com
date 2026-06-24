import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { createClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';

const requiredFields = ['name', 'company', 'position', 'email'] as const;
const submissionsTable = 'pilot_access_submissions';

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!payload) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  for (const field of requiredFields) {
    if (typeof payload[field] !== 'string' || payload[field].trim().length === 0) {
      return NextResponse.json({ error: `Missing required field: ${field}.` }, { status: 400 });
    }
  }

  const submission = {
    reference_id: `TR-${Math.floor(100000 + Math.random() * 900000)}`,
    submitted_at: new Date().toISOString(),
    name: String(payload.name).trim(),
    company: String(payload.company).trim(),
    position: String(payload.position).trim(),
    email: String(payload.email).trim(),
  };

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from(submissionsTable).insert(submission);

  if (error) {
    return NextResponse.json(
      { error: 'Could not save your submission right now. Please try again.' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      referenceId: submission.reference_id,
      nextSteps:
        'We review every application carefully. If your firm is a fit for the pilot, someone from our team will be in touch within 3 business days.'
    },
    { status: 201 }
  );
}
