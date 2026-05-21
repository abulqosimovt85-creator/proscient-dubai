import { useState } from 'react'

const steps = [
  { label: 'Industry', field: 'industry' },
  { label: 'Requirement', field: 'requirement' },
  { label: 'Budget', field: 'budget' },
]

export default function LeadForm() {
  const [activeStep, setActiveStep] = useState(0)
  const [form, setForm] = useState({ industry: '', requirement: '', budget: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (key: 'industry' | 'requirement' | 'budget', value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleContinue = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1)
      return
    }
    setSubmitted(true)
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Request quote</p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-950">Tell us about your lab requirement</h3>
        </div>
        <span className="rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white">Step {activeStep + 1} / {steps.length}</span>
      </div>
      <div className="mt-8 space-y-6">
        {submitted ? (
          <div className="rounded-3xl bg-teal-50 p-6 text-slate-900">
            <p className="font-semibold">Thank you!</p>
            <p className="mt-2 text-sm text-slate-600">Your inquiry has been received. Our team will contact you within one business day.</p>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700">{steps[activeStep].label}</label>
              <input
                type="text"
                value={form[steps[activeStep].field as keyof typeof form]}
                onChange={e => handleChange(steps[activeStep].field as 'industry' | 'requirement' | 'budget', e.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-700 focus:ring-2 focus:ring-brand-100"
                placeholder={steps[activeStep].label === 'Budget' ? 'AED 100k - 300k' : 'Describe your need'}
              />
            </div>
            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex items-center justify-center rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
            >
              {activeStep < steps.length - 1 ? 'Continue' : 'Submit request'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
