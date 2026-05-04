'use client';

import { useRouter } from 'next/navigation';
import { useScreening } from '@/context/ScreeningContext';
import { getSampleImageDataUrl } from '@/lib/sampleImage';

// ─── Arrow icon ───────────────────────────────────────────────────────────────
const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
  </svg>
);

// ─── Phone mockup showing the live analysis screen ────────────────────────────
function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[220px] sm:w-[250px]">
      {/* Glow */}
      <div className="absolute inset-0 rounded-[2.5rem] bg-brand-500 opacity-20 blur-2xl scale-110" />

      {/* Frame */}
      <div className="relative bg-[#0d1c30] rounded-[2.5rem] p-2.5 shadow-2xl border border-white/10">
        {/* Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#0d1c30] rounded-b-xl z-10" />

        {/* Screen */}
        <div className="bg-[#f8faff] rounded-[2rem] overflow-hidden aspect-[9/19] relative flex flex-col">

          {/* Status bar */}
          <div className="bg-[#0A1628] px-4 pt-6 pb-2 flex items-center justify-between flex-shrink-0">
            <span className="text-white/60 text-[8px] font-mono">9:41</span>
            <div className="w-10 h-1.5 bg-[#0d1c30] rounded-full" />
            <div className="flex gap-1">
              <div className="w-1 h-1.5 rounded-sm bg-white/40" />
              <div className="w-1 h-1.5 rounded-sm bg-white/60" />
              <div className="w-1 h-1.5 rounded-sm bg-white/80" />
            </div>
          </div>

          {/* App bar */}
          <div className="bg-[#0A1628] px-3 pb-3 flex items-center justify-between flex-shrink-0">
            <div className="w-5 h-5 rounded-md bg-brand-500 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/>
              </svg>
            </div>
            <span className="text-white text-[8px] font-bold tracking-wide">ScolioCheck AI</span>
            <span className="text-white/40 text-[7px]">Step 2 of 3</span>
          </div>

          {/* Content */}
          <div className="flex-1 px-2 py-2 flex flex-col min-h-0 overflow-hidden">
            {/* Badges */}
            <div className="flex gap-1 mb-1.5 flex-shrink-0">
              <span className="bg-amber-100 text-amber-700 text-[6px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                Moderate Asymmetry
              </span>
              <span className="bg-blue-50 text-brand-600 text-[6px] font-bold px-1.5 py-0.5 rounded-full">
                Demo
              </span>
            </div>
            <p className="text-[#0A1628] text-[7px] font-bold mb-1.5 flex-shrink-0">Posture analysis complete</p>

            {/* Simulated image + overlay */}
            <div className="relative rounded-xl overflow-hidden mb-2 flex-shrink-0" style={{ height: '88px' }}>
              <svg viewBox="0 0 100 130" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
                <rect width="100" height="130" fill="#e8e2d8"/>
                {/* Body silhouette */}
                <ellipse cx="50" cy="15" rx="10" ry="12" fill="#c4a278"/>
                <rect x="44" y="25" width="12" height="8" rx="2" fill="#c4a278"/>
                <path d="M 22 35 C 22 32 46 30 50 30 C 54 30 78 32 78 35 L 80 50 C 62 47 38 47 20 50 Z" fill="#c4a278"/>
                <path d="M 20 50 C 18 70, 22 90, 24 108 C 38 112, 62 112, 76 108 C 78 90, 82 70, 80 50 C 62 47 38 47 20 50 Z" fill="#c4a278"/>
                {/* Spine guide */}
                <line x1="50" y1="30" x2="51" y2="107" stroke="rgba(255,255,255,0.85)" strokeWidth="1" strokeDasharray="3,2"/>
                {/* Shoulder line – amber (asymmetric) */}
                <line x1="28" y1="35.5" x2="72" y2="33.5" stroke="#D97706" strokeWidth="1.5"/>
                <circle cx="28" cy="35.5" r="2" fill="#D97706" stroke="white" strokeWidth="0.8"/>
                <circle cx="72" cy="33.5" r="2" fill="#D97706" stroke="white" strokeWidth="0.8"/>
                {/* Waist line – cyan */}
                <line x1="24" y1="72" x2="76" y2="70" stroke="#0EA5E9" strokeWidth="1.5"/>
                <circle cx="24" cy="72" r="2" fill="#0EA5E9" stroke="white" strokeWidth="0.8"/>
                <circle cx="76" cy="70" r="2" fill="#0EA5E9" stroke="white" strokeWidth="0.8"/>
                {/* Score badge */}
                <rect x="68" y="6" width="26" height="16" rx="3" fill="rgba(10,22,40,0.85)"/>
                <text x="81" y="16" fontSize="7" fontWeight="bold" fill="#D97706" textAnchor="middle">52</text>
                <text x="81" y="21" fontSize="4" fill="rgba(255,255,255,0.5)" textAnchor="middle">SCORE</text>
                {/* Labels */}
                <rect x="32" y="27" width="22" height="6" rx="2" fill="rgba(10,22,40,0.75)"/>
                <text x="43" y="32" fontSize="4" fill="white" textAnchor="middle">Shoulders</text>
                <rect x="32" y="74" width="16" height="6" rx="2" fill="rgba(10,22,40,0.75)"/>
                <text x="40" y="79" fontSize="4" fill="white" textAnchor="middle">Waist</text>
              </svg>
            </div>

            {/* Metric grid */}
            <div className="grid grid-cols-2 gap-1 mb-2 flex-shrink-0">
              {[
                { label: 'Shoulder', value: '8.4mm', hi: true  },
                { label: 'Waist',    value: '6.2mm', hi: true  },
                { label: 'Trunk',    value: '5.7mm', hi: false },
                { label: 'Score',    value: '52/100',hi: true  },
              ].map(({ label, value, hi }) => (
                <div key={label} className="bg-white rounded-lg p-1.5 border border-[#E2EAF6]">
                  <p className="text-[5px] text-[#6B7FA3] uppercase tracking-wide">{label}</p>
                  <p className={`text-[8px] font-bold ${hi ? 'text-amber-600' : 'text-[#0A1628]'}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-1 flex-shrink-0">
              <div className="flex-1 bg-[#E2EAF6] rounded-lg py-1.5 text-center">
                <span className="text-[#0A1628] text-[6px] font-semibold">Retake</span>
              </div>
              <div className="flex-[2] bg-[#2563EB] rounded-lg py-1.5 text-center">
                <span className="text-white text-[6px] font-semibold">View report →</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating annotation badges */}
      <div className="absolute -left-20 top-[30%] bg-white rounded-xl shadow-lg px-2.5 py-1.5 border border-[#E2EAF6] w-[4.5rem]">
        <p className="text-[8px] font-semibold text-[#0A1628]">🔍 Landmark</p>
        <p className="text-[7px] text-[#6B7FA3]">Shoulder +8.4mm</p>
      </div>
      <div className="absolute -right-16 bottom-[28%] bg-amber-50 rounded-xl shadow-lg px-2.5 py-1.5 border border-amber-200 w-[4rem]">
        <p className="text-[8px] font-semibold text-amber-700">⚠ Asymmetry</p>
        <p className="text-[7px] text-amber-600">Eval suggested</p>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StepPill({ n, label, detail }: { n: number; label: string; detail: string }) {
  return (
    <div className="flex items-start gap-3 bg-white rounded-xl px-4 py-3.5 border border-[var(--border)] shadow-card">
      <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
        {n}
      </span>
      <div>
        <p className="text-navy text-sm font-semibold">{label}</p>
        <p className="text-[var(--text-muted)] text-xs mt-0.5">{detail}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: {
  icon: React.ReactNode; title: string; description: string; delay: string;
}) {
  return (
    <div className="card p-5 animate-fade-up opacity-0" style={{ animationDelay: delay, animationFillMode: 'forwards' }}>
      <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-display font-semibold text-navy text-sm mb-1.5">{title}</h3>
      <p className="text-[var(--text-muted)] text-xs leading-relaxed">{description}</p>
    </div>
  );
}

function StatCard({ value, label, source }: { value: string; label: string; source?: string }) {
  return (
    <div className="text-center">
      <div className="font-display font-bold text-3xl sm:text-4xl text-white mb-1">{value}</div>
      <div className="text-white/60 text-xs leading-snug max-w-[110px] mx-auto">{label}</div>
      {source && <div className="text-white/30 text-[9px] mt-1">{source}</div>}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter();
  const { setImage } = useScreening();

  function startDemo() { router.push('/screen'); }

  function useSampleAndStart() {
    setImage(getSampleImageDataUrl(), true);
    router.push('/analysis');
  }

  return (
    <div className="min-h-dvh bg-[var(--bg)] flex flex-col">

      {/* ── Nav ──────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/>
              </svg>
            </span>
            <span className="font-display font-bold text-navy text-sm">ScolioCheck AI</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline text-[10px] font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
              Early Demo · Not a Medical Device
            </span>
            <button onClick={startDemo} className="btn-primary text-xs py-2 px-4">
              Start Screening
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy pt-14 pb-24 px-5">
        {/* Background decoration */}
        <div className="absolute inset-0 dot-bg opacity-[0.07] pointer-events-none" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-brand-700 opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-cyan-500 opacity-10 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">

            {/* Left: copy */}
            <div className="flex-1 text-center lg:text-left">
              {/* Pill badge */}
              <div
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-medium px-3.5 py-1.5 rounded-full mb-6 animate-fade-in opacity-0"
                style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-soft" />
                AI-Assisted · Privacy-First · Not a Medical Device
              </div>

              <h1
                className="font-display font-extrabold text-white text-4xl sm:text-5xl leading-[1.1] mb-5 animate-fade-up opacity-0"
                style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
              >
                Catch scoliosis risk
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-brand-400">
                  before it goes unnoticed.
                </span>
              </h1>

              <p
                className="text-white/65 text-base sm:text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0 animate-fade-up opacity-0"
                style={{ animationDelay: '0.32s', animationFillMode: 'forwards' }}
              >
                AI-powered posture screening from a single smartphone photo.
                Identifies visible asymmetry and recommends medical evaluation when needed.
              </p>

              <div
                className="flex flex-col sm:flex-row items-center gap-3 mb-8 justify-center lg:justify-start animate-fade-up opacity-0"
                style={{ animationDelay: '0.44s', animationFillMode: 'forwards' }}
              >
                <button onClick={startDemo} className="btn-primary w-full sm:w-auto text-base py-4 px-8">
                  Start Screening Demo <ArrowRight />
                </button>
                <button
                  onClick={useSampleAndStart}
                  className="btn-ghost text-white/60 hover:text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  Skip to demo result →
                </button>
              </div>

              {/* Trust signals */}
              <div
                className="flex flex-wrap items-center gap-4 justify-center lg:justify-start animate-fade-up opacity-0"
                style={{ animationDelay: '0.56s', animationFillMode: 'forwards' }}
              >
                {['🔒 No data stored', '🧠 On-device analysis', '⏱ Under 2 minutes'].map((s) => (
                  <span key={s} className="text-white/50 text-xs font-medium">{s}</span>
                ))}
              </div>
            </div>

            {/* Right: phone mockup */}
            <div
              className="flex-shrink-0 animate-fade-in opacity-0"
              style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
            >
              <PhoneMockup />
            </div>
          </div>

          {/* Stats */}
          <div
            className="mt-16 grid grid-cols-3 gap-4 border-t border-white/10 pt-10 animate-fade-up opacity-0"
            style={{ animationDelay: '0.65s', animationFillMode: 'forwards' }}
          >
            <StatCard value="3–5%" label="adolescents estimated to have undetected spinal curvature" source="Scoliosis Research Society" />
            <StatCard value="~90s" label="complete screening, end to end" />
            <StatCard value="Earlier" label="detection means simpler treatment paths" />
          </div>
        </div>
      </section>

      {/* ── Safety ribbon ────────────────────────────────────────────────────── */}
      <div className="bg-amber-50 border-b border-amber-200 px-5 py-3">
        <p className="text-center text-amber-800 text-xs max-w-2xl mx-auto leading-relaxed">
          <strong>Safety notice:</strong> ScolioCheck AI does not diagnose scoliosis or any medical condition.
          It identifies possible visible asymmetry and encourages professional evaluation.
          Only a qualified clinician can diagnose scoliosis through physical examination and imaging.
        </p>
      </div>

      {/* ── How it works ─────────────────────────────────────────────────────── */}
      <section className="py-16 px-5">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-brand-600 text-xs font-bold uppercase tracking-widest mb-2">Simple process</p>
            <h2 className="font-display font-bold text-navy text-2xl">Four steps to a screening result</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Follow photo guidelines',     detail: 'Fitted clothing, good lighting, camera at shoulder height' },
              { label: 'Upload your back-view photo', detail: 'Processed entirely in your browser — never transmitted' },
              { label: 'AI maps posture landmarks',   detail: 'Shoulder height, waist symmetry, and trunk alignment' },
              { label: 'Receive your screening report', detail: 'Copyable, printable, with clear next steps' },
            ].map((step, i) => (
              <StepPill key={i} n={i + 1} label={step.label} detail={step.detail} />
            ))}
          </div>
        </div>
      </section>

      {/* ── What we analyse ──────────────────────────────────────────────────── */}
      <section className="py-4 pb-16 px-5 bg-white border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 pt-12">
            <p className="text-brand-600 text-xs font-bold uppercase tracking-widest mb-2">Posture signals</p>
            <h2 className="font-display font-bold text-navy text-2xl">What the screening looks for</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FeatureCard
              delay="0.1s"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                  <path strokeLinecap="round" d="M3 12h18M3 6.5h18M3 17.5h18"/>
                </svg>
              }
              title="Shoulder Height"
              description="Detects left-vs-right shoulder height differences — often the first visible sign families notice in the mirror."
            />
            <FeatureCard
              delay="0.18s"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                  <path strokeLinecap="round" d="M12 3v18M7 8l5-5 5 5M7 16l5 5 5-5"/>
                </svg>
              }
              title="Waist Symmetry"
              description="Assesses whether waist creases appear level on both sides — a key early visual indicator of spinal curvature."
            />
            <FeatureCard
              delay="0.26s"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                  <path strokeLinecap="round" d="M12 3c0 9 0 9 0 18M8.5 6.5c1.5 1 3.5 2 3.5 5.5s-2 5-3.5 5.5"/>
                </svg>
              }
              title="Trunk Alignment"
              description="Evaluates whether the trunk midline deviates from centre — a key scoliosis indicator known as trunk shift."
            />
          </div>
        </div>
      </section>

      {/* ── Why This Matters (YC section) ────────────────────────────────────── */}
      <section className="py-16 px-5 bg-[var(--bg)] border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-navy text-white uppercase tracking-wide">Why This Matters</span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 uppercase tracking-wide">YC Demo Context</span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wide">Demo Data</span>
          </div>

          <h2 className="font-display font-bold text-navy text-2xl sm:text-3xl leading-tight mb-5">
            Most teens with scoliosis go unscreened until the window for easy intervention has closed.
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-[var(--text-muted)] leading-relaxed text-sm mb-4">
                Many teenagers and parents notice uneven shoulders, waist imbalance, or posture changes —
                but don't know whether they warrant medical attention.
                School screening programmes are inconsistent, and paediatricians rarely have time for
                systematic posture assessment during routine visits.
              </p>
              <p className="text-[var(--text-muted)] leading-relaxed text-sm">
                The window for non-surgical intervention narrows as adolescents grow.
                <strong className="text-navy"> Earlier detection correlates with simpler, less invasive treatment.</strong>
              </p>
            </div>
            <div className="card p-5 space-y-3">
              <h3 className="font-display font-semibold text-navy text-sm mb-1">The opportunity</h3>
              {[
                { label: 'Accessible',  desc: 'Any smartphone — no special hardware required' },
                { label: 'Private',     desc: 'On-device analysis, zero data storage or transmission' },
                { label: 'Actionable',  desc: 'Clear signal: see a doctor now, or monitor and recheck' },
                { label: 'Responsible', desc: 'Built-in safety language, strict disclaimers throughout' },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-[var(--text-muted)]">
                    <strong className="text-navy">{label}:</strong> {desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Roadmap */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {[
              { phase: 'Now',   label: 'Demo prototype',             dot: 'bg-brand-500', text: 'text-brand-700', bg: 'bg-brand-50',  border: 'border-brand-200' },
              { phase: 'Next',  label: 'Paediatric clinical study',  dot: 'bg-cyan-500',  text: 'text-cyan-700',  bg: 'bg-cyan-50',   border: 'border-cyan-200'  },
              { phase: 'Later', label: 'FDA De Novo clearance path', dot: 'bg-slate-400', text: 'text-slate-600', bg: 'bg-slate-50',  border: 'border-slate-200' },
            ].map(({ phase, label, dot, text, bg, border }) => (
              <div key={phase} className={`rounded-xl px-4 py-3.5 border ${bg} ${border} flex items-center gap-3`}>
                <span className={`w-2 h-2 rounded-full ${dot} flex-shrink-0`} />
                <div>
                  <div className={`text-[10px] font-bold uppercase tracking-wide ${text}`}>{phase}</div>
                  <div className="text-navy text-sm font-medium">{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Demo data disclaimer */}
          <div className="disclaimer-box flex gap-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600">
              <path strokeLinecap="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
            </svg>
            <span>
              <strong>Demo Data Notice:</strong> This is an early-stage prototype. All analysis results are
              simulated for demonstration purposes and are not clinical measurements. No image data is
              stored or transmitted. This is not a medical device, diagnostic tool, or clinical software.
            </span>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────────── */}
      <section className="py-14 px-5 bg-navy text-center">
        <p className="text-brand-300 text-xs font-bold uppercase tracking-widest mb-3">Try the demo</p>
        <h2 className="font-display font-bold text-white text-2xl sm:text-3xl mb-3">
          Run a screening in under 2 minutes.
        </h2>
        <p className="text-white/50 text-sm mb-8 max-w-sm mx-auto">
          No account. No data stored. Upload a photo or use the sample image.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={startDemo} className="btn-primary text-base py-4 px-8 w-full sm:w-auto">
            Start Screening Demo <ArrowRight />
          </button>
          <button
            onClick={useSampleAndStart}
            className="btn-ghost text-white/50 hover:text-white hover:bg-white/10 w-full sm:w-auto"
          >
            Skip to sample result →
          </button>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-navy border-t border-white/10 px-5 py-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-white/30 text-xs">
          <span>© 2026 ScolioCheck AI · Early-Stage Prototype</span>
          <span>Not a medical device · Not for clinical use · Demonstration purposes only</span>
        </div>
      </footer>
    </div>
  );
}
