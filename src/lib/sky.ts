import { colors } from '../constants/colors';

export function skyGradient(minute: number) {
  const t = minute / 1440; // 0..1
  if (t < 0.25) return `linear-gradient(${colors.navy00}, ${colors.dawnLavender})`;
  if (t < 0.5) return `linear-gradient(${colors.dawnRose}, ${colors.noonBlue})`;
  if (t < 0.75) return `linear-gradient(${colors.sunsetCrimson}, ${colors.sunsetOrange})`;
  return `linear-gradient(${colors.navy10}, ${colors.navy00})`;
}
