export const colors = {
  ivory: '#FFFFF0',
  moonYellow: '#F6D365',
  moonIvory: '#FFFDF3',
  moonSnow: '#FFFAFA',
  navy00: '#04050f',
  navy10: '#0B1020',
  psychedelicPink: '#f6a6c1',
  psychedelicPurple: '#9b5de5',
  psychedelicTeal: '#00f5d4',
  noonBlue: '#7ec8e3',
  sunsetCrimson: '#e63946',
  sunsetOrange: '#ff8c42',
  dawnLavender: '#b8a1ff',
  dawnRose: '#ffc0cb',
  highlightIvory: '#fffae5',
  gridLine: 'rgba(255, 255, 240, 0.2)',
  textPrimary: '#F1F5F9',
  textMuted: '#B6C2CF'
} as const;

export type ColorName = keyof typeof colors;
