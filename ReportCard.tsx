'use client';

import type { AnalysisResult } from '@/lib/types';
import { RISK_LABELS, RISK_DESCRIPTIONS, RISK_NEXT_STEP } from '@/lib/analysis';

// ─── ReportCard ───────────────────────────────────────────────────────────────
// Renders the full screening report. When `forPrint` is true, the layout is
// optimised for printing (no buttons, no animations, full-width text).
// ─────────────────────────────────────────────────────────────────────────────

interface ReportCardProps {
  result:   AnalysisResult;
  forPrint?: boolean;
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

const RISK_META = {
  low: {
    emoji:  '✓',
    label:  'No Significant Asymmetry Detected',
    color:  'text-emerald-700',
    bg:     'bg-emerald-50',
    border: 'border-emerald-300',
    bar:    'bg-emerald-500',
  },
  moderate: {
    emoji:  '!',
    label:  'Moderate Asymmetry — Evaluation Suggested',
    color:  'text-amber-700',
    bg:     'bg-amber-50',
    border: 'border-amber-300',
    bar:    'bg-amber-500',
  },
  high: {
    emoji:  '!!',
    label:  'Notable Asymmetry — Evaluation Recommended',
    color:  'text-red-700',
    bg:     'bg-red-50',
    border: 'border-red-300',
    bar:    'bg-red-500',
  },
} as const;

export function ReportCard({ result, forPrint = false }: ReportCardProps) {
  const meta = RISK_META[result.riskLevel];

  return (
    <div
      id="report-card"
      className={`bg-white rounded-3xl border border-[var(--border)] overflow-hidden ${forPrint ? 'print-card' : 'shadow-card-lg'}`}
    >
      {/* ── Report header ──────────────────────────────────────────────── */}
      <div className="bg-navy px-6 pt-6 pb-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-5 h-5 rounded bg-brand-500 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/>
                </svg>
              </span>
              <span className="text-white/60 text-xs font-semibold tracking-wide">SCOLIOCHECK AI</span>
            </div>
            <h2 className="font-display font-bold text-white text-lg leading-tight">
              Posture Screening Report
            </h2>
            <p className="text-white/50 text-xs mt-0.5">{formatDate(result.date)}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">Report ID</p>
            <p className="font-mono text-white/70 text-xs">{result.id}</p>
            {result.isDemoMode && (
              <span className="inline-block mt-2 text-[9px] font-bold bg-amber-400/20 text-amber-400 px-2 py-0.5 rounded-full uppercase tracking-wide">
                Demo Data
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Result banner ──────────────────────────────────────────────── */}
      <div className={`px-6 py-4 border-b ${meta.bg} ${result.riskLevel === 'low' ? 'border-emerald-100' : result.riskLevel === 'moderate' ? 'border-amber-100' : 'border-red-100'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-display font-bold text-sm ${meta.bg} border-2 ${meta.border} ${meta.color}`}>
            {meta.emoji}
          </div>
          <div>
            <p className={`font-display font-bold text-sm ${meta.color}`}>{meta.label}</p>
            <p className={`text-xs ${meta.color} opacity-70`}>{RISK_LABELS[result.riskLevel]}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">

        {/* ── Asymmetry score ─────────────────────────────────────────── */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest">
              Overall Asymmetry Score
            </span>
            <span className={`font-display font-bold text-lg ${meta.color}`}>
              {result.asymmetryScore}<span className="text-xs text-[var(--text-muted)] font-normal ml-1">/ 100</span>
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${meta.bar}`}
              style={{ width: `${result.asymmetryScore}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-emerald-600">Low</span>
            <span className="text-[10px] text-amber-600">Moderate</span>
            <span className="text-[10px] text-red-600">High</span>
          </div>
        </div>

        {/* ── Metric table ─────────────────────────────────────────────── */}
        <div>
          <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-3">
            Observed Visual Signals
          </h3>
          <div className="rounded-xl border border-[var(--border)] overflow-hidden">
            {[
              {
                label:  'Shoulder Height Difference',
                value:  `${result.shoulderHeightDiff} mm`,
                flag:   result.shoulderHeightDiff > 10,
                detail: 'Vertical height difference between left and right shoulder landmarks',
              },
              {
                label:  'Waist Imbalance',
                value:  `${result.waistImbalance} mm`,
                flag:   result.waistImbalance > 8,
                detail: 'Asymmetry in waist crease elevation',
              },
              {
                label:  'Trunk Shift',
                value:  `${result.trunkShift} mm`,
                flag:   result.trunkShift > 6,
                detail: 'Lateral deviation of the trunk midline from vertical centre',
              },
              {
                label:  'Risk Classification',
                value:  RISK_LABELS[result.riskLevel],
                flag:   result.riskLevel !== 'low',
                detail: 'Derived from combined asymmetry indicators',
              },
            ].map(({ label, value, flag, detail }, i, arr) => (
              <div
                key={label}
                className={`flex items-start justify-between gap-4 px-4 py-3 ${i < arr.length - 1 ? 'border-b border-[var(--border)]' : ''}`}
              >
                <div className="min-w-0">
                  <p className="text-navy text-xs font-medium">{label}</p>
                  <p className="text-[var(--text-muted)] text-[10px] leading-snug mt-0.5">{detail}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className={`text-sm font-semibold ${flag ? 'text-amber-600' : 'text-navy'}`}>
                    {value}
                  </span>
                  {flag && (
                    <span className="block text-[9px] text-amber-600 font-semibold mt-0.5">↑ Elevated</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Observation summary ──────────────────────────────────────── */}
        <div>
          <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-2">
            What Was Observed
          </h3>
          <p className="text-navy text-sm leading-relaxed">
            {RISK_DESCRIPTIONS[result.riskLevel]}
          </p>
        </div>

        {/* ── Recommended next step ────────────────────────────────────── */}
        <div className={`rounded-xl p-4 border ${meta.bg} ${meta.border}`}>
          <h3 className={`text-xs font-bold uppercase tracking-widest mb-2 ${meta.color}`}>
            Recommended Next Step
          </h3>
          <p className={`text-sm leading-relaxed ${meta.color}`}>
            {RISK_NEXT_STEP[result.riskLevel]}
          </p>
        </div>

        {/* ── Clinical disclaimer ──────────────────────────────────────── */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
          <div className="flex gap-2.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
              className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
            </svg>
            <div className="text-slate-600 text-[11px] leading-relaxed">
              <strong className="block text-slate-700 mb-0.5">Clinical Disclaimer</strong>
              ScolioCheck AI does not diagnose scoliosis or any other medical condition.
              Only a qualified clinician — such as a paediatrician, orthopaedic surgeon, or
              physiotherapist — can diagnose scoliosis, typically through physical examination
              and imaging (X-ray). This report is a demo screening tool only and must not be used
              for any medical decision. All values are simulated indicators for demonstration purposes.
            </div>
          </div>
        </div>

        {/* ── Report footer ─────────────────────────────────────────────── */}
        <div className="border-t border-[var(--border)] pt-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-[var(--text-muted)]">ScolioCheck AI · Early Prototype</p>
            <p className="text-[10px] text-[var(--text-muted)]">Not a medical device · Not for clinical use</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[var(--text-muted)]">scoliocheck.ai</p>
            <p className="text-[9px] text-[var(--text-muted)] opacity-60">demo · 2026</p>
          </div>
        </div>

      </div>
    </div>
  );
}
