'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  CalendarDays, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Map, 
  AlertCircle 
} from 'lucide-react'
import { saveAttendee } from '@/lib/storage'
import { AttendeeRole, AttendeeCategory } from '@/lib/types'
import { CONFERENCE_INFO } from '@/lib/conference-data'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'Young Person' as AttendeeRole,
    category: 'Delegate' as AttendeeCategory,
    unitOrCampus: '',
    stateOrRegion: 'Lagos State',
    accommodationNeeded: false,
    dietaryOrNotes: ''
  })

  const roles: AttendeeRole[] = [
    'Youth Pastor / Minister',
    'Worker',
    'Campus Fellowship Leader',
    'Young Person',
    'Volunteer / Usher'
  ]

  const states = [
    'Lagos State',
    'Ogun State',
    'Oyo State',
    'Osun State',
    'Ondo State',
    'Ekiti State',
    'Edo / Delta',
    'Abuja (FCT)',
    'Rivers / South-South',
    'Enugu / South-East',
    'Kwara / North-Central',
    'Other State / International Delegation'
  ]

  function validateStep1() {
    if (!formData.fullName.trim()) {
      setError('Please provide your full legal name.')
      return false
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid email address for your digital pass link.')
      return false
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      setError('Please enter a valid phone number.')
      return false
    }
    if (!formData.unitOrCampus.trim()) {
      setError('Please enter your Campus Fellowship, Youth Church, or MFM Branch.')
      return false
    }
    setError('')
    return true
  }

  function handleProceedToReview(e: React.FormEvent) {
    e.preventDefault()
    if (validateStep1()) {
      setStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function handleFinalSubmit() {
    setIsSubmitting(true)
    try {
      let assignedCategory: AttendeeCategory = 'Delegate'
      if (formData.role === 'Campus Fellowship Leader') assignedCategory = 'Campus Leader'
      else if (formData.role === 'Youth Pastor / Minister') assignedCategory = 'Youth Pastor'
      else if (formData.role === 'Volunteer / Usher') assignedCategory = 'Usher / Protocol'

      const notes = formData.accommodationNeeded 
        ? `Accommodation requested. ${formData.dietaryOrNotes}`
        : formData.dietaryOrNotes

      const newAttendee = saveAttendee({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        role: formData.role,
        category: assignedCategory,
        unitOrCampus: formData.unitOrCampus.trim(),
        stateOrRegion: formData.stateOrRegion,
        dietaryOrNotes: notes
      })

      // Redirect directly to success page with generated code
      router.push(`/register/success?code=${encodeURIComponent(newAttendee.reference)}`)
    } catch (err) {
      setError('An unexpected error occurred while saving your registration. Please retry.')
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#041d24] px-4 py-8 text-[#f4efe4] selection:bg-[#efbd3b] selection:text-[#062d31] sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mx-auto flex max-w-4xl items-center justify-between border-b border-white/10 pb-5">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-white/70 hover:text-white transition"
        >
          <ArrowLeft className="size-4" />
          <span>Back to SOAR 2026 Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-[#efbd3b]" />
          <span className="text-xs font-black uppercase tracking-wider text-[#ffd66a]">
            Fast Registration · Free Admission
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-4xl py-10 sm:py-14">
        {/* Progress Stepper */}
        <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <span className={`flex size-8 items-center justify-center rounded-full text-xs font-black ${
              step >= 1 ? 'bg-[#efbd3b] text-[#062d31]' : 'bg-white/10 text-white/40'
            }`}>
              1
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Attendee Information
            </span>
          </div>
          <div className="h-px w-12 sm:w-24 bg-white/20" />
          <div className="flex items-center gap-3">
            <span className={`flex size-8 items-center justify-center rounded-full text-xs font-black ${
              step === 2 ? 'bg-[#efbd3b] text-[#062d31]' : 'bg-white/10 text-white/40'
            }`}>
              2
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-white/60">
              Review & Confirmation
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-red-500/40 bg-red-950/40 p-4 text-xs font-semibold text-red-200">
            <AlertCircle className="size-5 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: ATTENDEE INFORMATION FORM */}
        {step === 1 && (
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#efbd3b]">
                Step 01
              </span>
              <h1 className="mt-3 text-4xl sm:text-5xl font-black tracking-[-0.04em] leading-tight text-white">
                Your place at <br />
                <span className="font-serif font-normal italic text-gold-gradient">
                  the gathering.
                </span>
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                Join thousands of youth pastors, campus fellowship delegates, and young believers for four consecrated days at MFM Prayer City.
              </p>

              <div className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-[#062d31]/60 p-5 text-xs text-white/70">
                <div className="flex items-start gap-3">
                  <CalendarDays className="size-4 text-[#efbd3b] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">10–13 December 2026</strong>
                    <p className="text-white/50">Daily Sessions · 9:00 AM – 5:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="size-4 text-[#efbd3b] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">MFM Prayer City</strong>
                    <p className="text-white/50">KM 12 Lagos–Ibadan Expressway, Nigeria</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="size-4 text-[#22c55e] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Instant Scannable QR Pass</strong>
                    <p className="text-white/50">No gate queues · Offline badge supported</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <form 
                onSubmit={handleProceedToReview}
                className="rounded-3xl border border-white/15 bg-gradient-to-b from-[#0b3b3e]/80 to-[#062d31]/95 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5"
              >
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                    Full Legal Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 size-4 text-white/40" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Emmanuel Tolu Adeyemi"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-[#041d24] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/25 focus:border-[#efbd3b] focus:outline-none focus:ring-1 focus:ring-[#efbd3b]"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 size-4 text-white/40" />
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-white/15 bg-[#041d24] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/25 focus:border-[#efbd3b] focus:outline-none focus:ring-1 focus:ring-[#efbd3b]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                      WhatsApp / Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 size-4 text-white/40" />
                      <input
                        type="tel"
                        required
                        placeholder="+234 803 000 0000"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-xl border border-white/15 bg-[#041d24] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/25 focus:border-[#efbd3b] focus:outline-none focus:ring-1 focus:ring-[#efbd3b]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                      I Am Registering As *
                    </label>
                    <select
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value as AttendeeRole })}
                      className="w-full rounded-xl border border-white/15 bg-[#041d24] px-4 py-3.5 text-sm text-white focus:border-[#efbd3b] focus:outline-none focus:ring-1 focus:ring-[#efbd3b]"
                    >
                      {roles.map(r => (
                        <option key={r} value={r} className="bg-[#041d24] text-white">
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                      State / Region *
                    </label>
                    <select
                      value={formData.stateOrRegion}
                      onChange={e => setFormData({ ...formData, stateOrRegion: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-[#041d24] px-4 py-3.5 text-sm text-white focus:border-[#efbd3b] focus:outline-none focus:ring-1 focus:ring-[#efbd3b]"
                    >
                      {states.map(s => (
                        <option key={s} value={s} className="bg-[#041d24] text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                    Campus Fellowship, Youth Church or MFM Unit *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-4 top-3.5 size-4 text-white/40" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. UNILAG Fellowship, MFM Yaba Youth Church, FUTA Chapter"
                      value={formData.unitOrCampus}
                      onChange={e => setFormData({ ...formData, unitOrCampus: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-[#041d24] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/25 focus:border-[#efbd3b] focus:outline-none focus:ring-1 focus:ring-[#efbd3b]"
                    />
                  </div>
                </div>

                {/* Accommodation Toggle */}
                <div className="rounded-xl border border-white/10 bg-[#041d24]/60 p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.accommodationNeeded}
                      onChange={e => setFormData({ ...formData, accommodationNeeded: e.target.checked })}
                      className="size-4 rounded accent-[#efbd3b]"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-white">Request Prayer City Hostel / Dormitory Bed</p>
                      <p className="text-white/50 text-[11px]">Recommended for delegates travelling from outside Lagos/Ogun state.</p>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
                    Additional Notes / Dietary Accommodations (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Any health notes or volunteer team interest..."
                    value={formData.dietaryOrNotes}
                    onChange={e => setFormData({ ...formData, dietaryOrNotes: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-[#041d24] p-3 text-xs text-white placeholder:text-white/25 focus:border-[#efbd3b] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ffd66a] via-[#efbd3b] to-[#d49a1d] py-4 text-sm font-black text-[#062d31] shadow-lg hover:brightness-110 active:scale-98 transition"
                >
                  <span>Review & Complete Registration</span>
                  <ArrowRight className="size-4" />
                </button>
                <p className="text-center text-[11px] text-white/40">
                  Admission is free. Your scannable turnstile pass will be issued instantly upon review.
                </p>
              </form>
            </div>
          </div>
        )}

        {/* STEP 2: REVIEW & CONFIRM */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-3xl border border-[#efbd3b]/30 bg-[#062d31] p-6 sm:p-10 shadow-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#efbd3b]">
                Step 02 · Final Review
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">
                Confirm your <span className="font-serif font-normal italic text-[#ffd66a]">credentials.</span>
              </h2>
              <p className="mt-2 text-xs text-white/60">
                Please verify your details. Your official digital pass will be bound to this registration.
              </p>

              <div className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/15 bg-[#041d24] p-5 text-xs">
                <div className="py-3 flex justify-between">
                  <span className="text-white/50">Full Name</span>
                  <span className="font-bold text-white text-right">{formData.fullName}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-white/50">Email Address</span>
                  <span className="font-mono text-white text-right">{formData.email}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-white/50">WhatsApp / Phone</span>
                  <span className="font-mono text-white text-right">{formData.phone}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-white/50">Role Category</span>
                  <span className="font-bold text-[#ffd66a] text-right">{formData.role}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-white/50">Campus / Youth Unit</span>
                  <span className="font-bold text-white text-right">{formData.unitOrCampus}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-white/50">State / Region</span>
                  <span className="text-white text-right">{formData.stateOrRegion}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-white/50">Accommodation Requested</span>
                  <span className={`font-bold ${formData.accommodationNeeded ? 'text-[#22c55e]' : 'text-white/40'}`}>
                    {formData.accommodationNeeded ? 'Yes (Hostel Requested)' : 'No'}
                  </span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-white/50">Registration Fee</span>
                  <span className="font-bold text-[#22c55e]">FREE (Complimentary Delegate)</span>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto rounded-full border border-white/20 px-6 py-3.5 text-xs font-bold text-white/80 hover:text-white"
                >
                  Edit Details
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="w-full flex-1 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ffd66a] via-[#efbd3b] to-[#d49a1d] py-4 text-sm font-black text-[#062d31] shadow-xl hover:brightness-110 active:scale-98 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Issuing Your Digital Pass...</span>
                  ) : (
                    <>
                      <span>Complete Registration & Generate Pass</span>
                      <Check className="size-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
