// Validated chart palette (see the dataviz skill's reference palette).
// Every chart in this app is a single-series magnitude chart, so only the
// sequential blue ramp + chart chrome tokens are needed — no categorical
// hue assignment or CVD pairlist validation is required for a single hue.

export const CHART_COLORS = {
  seriesBlue: "#3D6D95",
  seriesBlueSoft: "#a9c5d8",
  gridline: "#e1e0d9",
  axis: "#c3c2b7",
  mutedInk: "#898781",
  secondaryInk: "#52514e",
  primaryInk: "#0b0b0b",
  surface: "#fcfcfb",
} as const;
