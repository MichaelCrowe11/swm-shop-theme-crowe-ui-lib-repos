'use client'

import { useState } from 'react'

const prompts = [
  'Help me plan a lion’s mane production batch',
  'What information should I collect to troubleshoot slow colonization?',
  'Calculate substrate ingredients for a 20-bag run',
]

const modules = [
  { number: '01', title: 'Cultivation knowledge', detail: 'Species guidance, reviewed SOPs, substrate references, and source-linked answers.' },
  { number: '02', title: 'Crop troubleshooting', detail: 'A structured case record for symptoms, environmental readings, timelines, and images.' },
  { number: '03', title: 'Farm operations', detail: 'Batch records, production schedules, ingredient calculations, and harvest planning.' },
]

export default function MycologyAIPage() {
  const [question, setQuestion] = useState('')
  const [notice, setNotice] = useState('The pilot workspace is being assembled. The AI knowledge service is not connected yet.')

  function submitPreview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!question.trim()) return
    setNotice('Your question has been captured in this local preview only. No AI request was sent and no farm data was stored.')
  }

  return (
    <main className="mx-auto max-w-6xl space-y-10 pb-16">
      <section className="border-b border-white/10 pb-8">
        <p className="text-xs uppercase tracking-[0.24em] text-[#C6A351]">Southwest Mushrooms · Powered by Crowe Logic</p>
        <div className="mt-5 grid gap-8 md:grid-cols-[1.35fr_0.65fr] md:items-end">
          <div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-[#F4F1E8] md:text-6xl">Mycology intelligence for the work of growing.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#C8C4BA]">A practical workspace for cultivation knowledge, crop troubleshooting, and commercial farm operations—grounded in reviewed mycology sources and your own production records.</p>
          </div>
          <div className="border border-[#C6A351]/40 bg-[#C6A351]/[0.06] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[#C6A351]">Pilot status</p>
            <p className="mt-2 text-xl font-medium text-[#F4F1E8]">Foundation in progress</p>
            <p className="mt-2 text-sm leading-6 text-[#B8B3A8]">This is a product preview, not a live cultivation advisor. Knowledge sources, customer accounts, and billing must be connected before paid access.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {modules.map((module) => (
          <article key={module.number} className="border border-white/10 bg-black/10 p-5">
            <p className="font-mono text-xs text-[#C6A351]">{module.number}</p>
            <h2 className="mt-4 text-xl font-medium text-[#F4F1E8]">{module.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[#B8B3A8]">{module.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="border border-white/10 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#C6A351]">Mycology assistant</p>
          <h2 className="mt-3 text-2xl font-medium text-[#F4F1E8]">Start with the question behind the work.</h2>
          <p className="mt-2 text-sm leading-6 text-[#B8B3A8]">The production assistant will cite the approved source material used in its answer and identify missing context instead of guessing.</p>
          <form onSubmit={submitPreview} className="mt-6 space-y-3">
            <label htmlFor="mycology-question" className="block text-sm text-[#E2DED4]">Your cultivation question</label>
            <textarea id="mycology-question" value={question} onChange={(event) => setQuestion(event.target.value)} rows={4} placeholder="Describe the species, substrate, process stage, and what you are trying to solve…" className="w-full resize-y border border-white/15 bg-[#100F0C] p-4 text-sm text-[#F4F1E8] placeholder:text-[#77736A] focus:border-[#C6A351] focus:outline-none" />
            <button type="submit" className="border border-[#C6A351] bg-[#C6A351] px-5 py-3 text-sm font-medium text-[#17140E] transition hover:bg-[#D5B66D]">Preview question capture</button>
          </form>
          <p aria-live="polite" className="mt-4 border-l-2 border-[#C6A351] pl-3 text-sm leading-6 text-[#B8B3A8]">{notice}</p>
          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-xs uppercase tracking-[0.16em] text-[#8E897F]">Example workflows</p>
            <ul className="mt-3 space-y-2">
              {prompts.map((prompt) => <li key={prompt}><button type="button" onClick={() => setQuestion(prompt)} className="text-left text-sm text-[#D8D2C6] underline decoration-white/20 underline-offset-4 hover:text-[#C6A351]">{prompt}</button></li>)}
            </ul>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="border border-white/10 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#C6A351]">Designed for growers</p>
            <h2 className="mt-3 text-2xl font-medium text-[#F4F1E8]">From first grow to commercial production.</h2>
            <div className="mt-5 space-y-4 text-sm">
              <div><p className="text-[#F4F1E8]">Hobby growers</p><p className="mt-1 text-[#AFA99E]">Clear species-specific learning paths and guided troubleshooting.</p></div>
              <div><p className="text-[#F4F1E8]">Serious growers</p><p className="mt-1 text-[#AFA99E]">Reusable SOPs, calculations, and saved crop cases.</p></div>
              <div><p className="text-[#F4F1E8]">Commercial farms</p><p className="mt-1 text-[#AFA99E]">Batch tracking, schedules, reporting, and approval-gated integrations.</p></div>
            </div>
          </div>
          <div className="border border-white/10 bg-white/[0.025] p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#C6A351]">Trust by design</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[#B8B3A8]">
              <li>Answers linked to reviewed source material.</li>
              <li>Clear uncertainty when evidence is incomplete.</li>
              <li>Private farm workspaces with tenant-level access controls.</li>
              <li>Human approval before external or irreversible actions.</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  )
}
