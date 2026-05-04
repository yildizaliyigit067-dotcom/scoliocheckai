// ─── Shared types for ScolioCheck AI ───────────────────────────────────────
// These types define the core data model. In a production version, `Landmarks`
// would be populated by a real pose-detection model (MediaPipe, TensorFlow.js,
// or a server-side CV API). The coordinates use 0-1 fractions of image size.

export type RiskLevel = 'low' | 'moderate' | 'high';

export interface Landmark {
  /** Fraction of image width (0 = left edge, 1 = right edge) */
  x: number;
  /** Fraction of image height (0 = top edge, 1 = bottom edge) */
  y: number;
}

export interface Landmarks {
  leftShoulder:  Landmark;
  rightShoulder: Landmark;
  leftWaist:     Landmark;
  rightWaist:    Landmark;
  spineTop:      Landmark;
  spineBottom:   Landmark;
}

export interface AnalysisMetrics {
  /** Apparent vertical height difference between shoulders (in display mm-equivalents) */
  shoulderHeightDiff: number;
  /** Apparent vertical difference at the waist level */
  waistImbalance:     number;
  /** Horizontal trunk shift from center */
  trunkShift:         number;
  /** Composite score 0-100 */
  asymmetryScore:     number;
}

export interface AnalysisResult extends AnalysisMetrics {
  id:          string;
  date:        string;   // ISO-8601
  riskLevel:   RiskLevel;
  landmarks:   Landmarks;
  isDemoMode:  boolean;
}

export interface ScreeningState {
  imageDataUrl: string | null;
  result:       AnalysisResult | null;
  isDemoMode:   boolean;
}
