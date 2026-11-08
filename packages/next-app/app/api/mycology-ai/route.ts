import { NextResponse } from 'next/server'

/**
 * Deliberately disabled until authentication, tenant isolation, approved
 * knowledge retrieval, rate limits, and server-side provider configuration
 * are implemented and tested. Do not wire a public UI to an ungrounded
 * general-purpose model and present it as a cultivation expert.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: 'MYCOLOGY_AI_NOT_CONFIGURED',
      message:
        'The Mycology AI service is not available yet. The pilot requires approved knowledge sources and account protections before answering cultivation questions.',
    },
    { status: 503, headers: { 'Cache-Control': 'no-store' } },
  )
}
