import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as { files?: unknown } | null;
  const files = Array.isArray(payload?.files) ? payload?.files.filter((file): file is string => typeof file === 'string') : [];

  return NextResponse.json(
    {
      report: {
        caseId: 'TR-20481',
        status: 'Investigation complete',
        riskScore: 87,
        linkedAccounts: 14,
        policyHits: 7,
        reviewTime: '4m 12s',
        confidence: '92%',
        recommendation:
          'Escalate to manual review. Place withdrawal hold on the related accounts and request supporting documentation before releasing funds.',
        timeline: [
          { time: '09:12', event: 'Alert triggered', detail: 'Withdrawal cluster detected within a 14-minute window.' },
          { time: '09:14', event: 'Identity and device checks', detail: 'Device fingerprints, login history, and session data were pulled.' },
          { time: '09:18', event: 'Pattern analysis completed', detail: 'The system compared activity against prior incidents and policy rules.' },
          { time: '09:21', event: 'Review packet prepared', detail: 'Evidence, findings, and recommended actions were assembled into the case.' }
        ],
        evidence: [
          'Withdrawal requests matched against shared device fingerprints.',
          'Account funding came from a narrow set of payment sources.',
          'Trading activity showed synchronized order timing across linked profiles.',
          files.length > 0
            ? `Processed ${files.length} uploaded file${files.length === 1 ? '' : 's'} as part of the investigation.`
            : 'Processed the default demo dataset provided by Trintus Risk.'
        ],
        metrics: [
          { label: 'Linked accounts', value: '14' },
          { label: 'Policy violations', value: '7' },
          { label: 'Trade clusters', value: '3' },
          { label: 'Review time', value: '4m 12s' }
        ]
      }
    },
    { status: 200 }
  );
}
