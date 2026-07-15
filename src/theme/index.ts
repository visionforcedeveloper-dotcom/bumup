export const colors = {
  primary: '#FF2D6B',
  primaryDark: '#C4144E',
  primaryLight: '#FF6B9D',

  accent: '#FF2D6B',
  accentOrange: '#FF6B35',
  accentPurple: '#9B5DE5',
  accentBlue: '#4CC9F0',
  accentPink: '#FF2D6B',

  background: '#0A0A0F',
  surface: '#111118',
  card: '#18181F',
  cardLight: '#1E1E28',

  text: '#FFFFFF',
  textSecondary: '#8A8A9A',
  textMuted: '#4A4A5A',

  success: '#00D9A3',
  warning: '#FFB830',
  error: '#FF4444',

  border: '#222230',
  overlay: 'rgba(10,10,15,0.85)',
};

export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const borderRadius = {
  sm: 8, md: 14, lg: 20, xl: 28, full: 999,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '900' as const, letterSpacing: -1 },
  h2: { fontSize: 24, fontWeight: '800' as const, letterSpacing: -0.5 },
  h3: { fontSize: 18, fontWeight: '700' as const },
  h4: { fontSize: 16, fontWeight: '700' as const },
  body: { fontSize: 14, fontWeight: '400' as const, lineHeight: 22 },
  small: { fontSize: 12, fontWeight: '400' as const },
  caption: { fontSize: 11, fontWeight: '500' as const },
};
