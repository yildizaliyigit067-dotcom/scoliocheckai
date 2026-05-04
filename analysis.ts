import type { AnalysisResult, Landmarks, RiskLevel } from './types';

// ─── Demo landmarks (YC demo mode) ──────────────────────────────────────────
const DEMO_LANDMARKS: Landmarks = {
  leftShoulder:  { x: 0.31, y: 0.225 },
  rightShoulder: { x: 0.69, y: 0.195 },
  leftWaist:     { x: 0.275, y: 0.580 },
  rightWaist:    { x: 0.715, y: 0.555 },
  spineTop:      { x: 0.500, y: 0.220 },
  spineBottom:   { x: 0.516, y: 0.730 },
};

const DEMO_METRICS = {
  shoulderHeightDiff: 8.4,
  waistImbalance:     6.2,
  trunkShift:         5.7,
  asymmetryScore:     52,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function scoreToRisk(score: number): RiskLevel {
  if (score < 28) return 'low';
  if (score < 58) return 'moderate';
  return 'high';
}

// ─── Claude Haiku vision call ─────────────────────────────────────────────────
// Uses claude-haiku — cheapest model, ~$0.0004 per image analysis.
async function analyseWithClaude(imageDataUrl: string) {
  const base64 = imageDataUrl.split(',')[1];
  const mimeMatch = imageDataUrl.match(/data:(image\/[a-z]+);base64/);
  const mediaType = (mimeMatch?.[1] ?? 'image/jpeg') as
    'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY ?? '',
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64 },
          },
          {
            type: 'text',
            text: `Analyse this back-view photo for posture asymmetry. Estimate landmark positions as fractions (0.0–1.0) of image width/height, 0,0 = top-left.

Return ONLY valid JSON, no explanation:
{
  "leftShoulder":  {"x":0.0,"y":0.0},
  "rightShoulder": {"x":0.0,"y":0.0},
  "leftWaist":     {"x":0.0,"y":0.0},
  "rightWaist":    {"x":0.0,"y":0.0},
  "spineTop":      {"x":0.0,"y":0.0},
  "spineBottom":   {"x":0.0,"y":0.0},
  "shoulderHeightDiff": 0.0,
  "waistImbalance": 0.0,
  "trunkShift": 0.0,
  "asymmetryScore": 0
}

shoulderHeightDiff = |leftShoulder.y - rightShoulder.y| × 280
waistImbalance = |leftWaist.y - rightWaist.y| × 220
trunkShift = |spineBottom.x - spineTop.x| × 160
asymmetryScore = 0–100 integer (0=perfectly symmetric)

If not a clear back photo, return best estimate with asymmetryScore 0.`,
          },
        ],
      }],
    }),
  });

  if (!res.ok) throw new Error(`API ${res.status}`);

  const data = await res.json();
  const text = data.content
    .filter((b: {type: string}) => b.type === 'text')
    .map((b: {text: string}) => b.text)
    .join('');

  const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());

  return {
    landmarks: {
      leftShoulder:  parsed.leftShoulder,
      rightShoulder: parsed.rightShoulder,
      leftWaist:     parsed.leftWaist,
      rightWaist:    parsed.rightWaist,
      spineTop:      parsed.spineTop,
      spineBottom:   parsed.spineBottom,
    } as Landmarks,
    shoulderHeightDiff: +Number(parsed.shoulderHeightDiff).toFixed(1),
    waistImbalance:     +Number(parsed.waistImbalance).toFixed(1),
    trunkShift:         +Number(parsed.trunkShift).toFixed(1),
    asymmetryScore:     Math.min(100, Math.max(0, Math.round(parsed.asymmetryScore))),
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────
export async function runAnalysis(
  imageDataUrl: string,
  isDemoMode: boolean,
): Promise<AnalysisResult> {
  // Demo mode: instant, no API call
  if (isDemoMode) {
    await new Promise(r => setTimeout(r, 2400));
    return {
      id:        `SCK-${Date.now().toString(36).toUpperCase()}`,
      date:      new Date().toISOString(),
      riskLevel: scoreToRisk(DEMO_METRICS.asymmetryScore),
      isDemoMode: true,
      landmarks: DEMO_LANDMARKS,
      ...DEMO_METRICS,
    };
  }

  // Real photo: call Claude Haiku (~$0.0004 per analysis)
  try {
    const result = await analyseWithClaude(imageDataUrl);
    return {
      id:        `SCK-${Date.now().toString(36).toUpperCase()}`,
      date:      new Date().toISOString(),
      riskLevel: scoreToRisk(result.asymmetryScore),
      isDemoMode: false,
      ...result,
    };
  } catch {
    // Fallback to demo data if API fails (no key etc.)
    return {
      id:        `SCK-${Date.now().toString(36).toUpperCase()}`,
      date:      new Date().toISOString(),
      riskLevel: scoreToRisk(DEMO_METRICS.asymmetryScore),
      isDemoMode: true,
      landmarks: DEMO_LANDMARKS,
      ...DEMO_METRICS,
    };
  }
}

// ─── Copy helpers ─────────────────────────────────────────────────────────────
export const RISK_LABELS: Record<RiskLevel, string> = {
  low:      'Low Visible Asymmetry',
  moderate: 'Moderate Visible Asymmetry',
  high:     'Higher Visible Asymmetry',
};

export const RISK_DESCRIPTIONS: Record<RiskLevel, string> = {
  low:      'Postural landmarks appear largely symmetrical. No significant visible asymmetry was detected in shoulder height, waist level, or trunk alignment.',
  moderate: 'Some visible differences in shoulder height and waist alignment were observed. A medical evaluation may be worthwhile to assess spinal alignment.',
  high:     'Notable visible differences in shoulder height, waist alignment, and trunk positioning were observed. Consultation with a healthcare professional is advisable.',
};

export const RISK_NEXT_STEP: Record<RiskLevel, string> = {
  low:      'Continue routine posture monitoring. Repeat screening in 6–12 months or sooner if visible changes occur.',
  moderate: 'Consider scheduling an evaluation with a paediatrician or family doctor to discuss these findings.',
  high:     'We recommend consulting a qualified clinician (paediatrician, orthopaedic specialist, or physiotherapist) as soon as conveniently possible.',
};
