export const colors = {
  primary: '#D96B9E',        // rosa vibrante principal
  primaryDark: '#B84F80',
  primaryLight: '#F0A0C8',
  accent: '#B57BEA',         // lilás/roxo

  accentOrange: '#F4845F',   // coral suave
  accentPurple: '#B57BEA',   // lilás
  accentBlue: '#89A8E0',     // azul acinzentado
  accentPink: '#F472B6',     // rosa claro

  background: '#0D0B0E',     // preto com toque quente
  surface: '#141118',
  card: '#1C1720',
  cardLight: '#231D28',

  text: '#F8F0F5',
  textSecondary: '#A090A8',
  textMuted: '#5A4F62',

  success: '#7ECBA0',
  warning: '#E8B870',
  error: '#E87878',

  border: '#2C2233',
  overlay: 'rgba(13,11,14,0.85)',
};

export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const borderRadius = {
  sm: 8, md: 12, lg: 16, xl: 24, full: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700' as const },
  h3: { fontSize: 18, fontWeight: '600' as const },
  h4: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  small: { fontSize: 12, fontWeight: '400' as const },
  caption: { fontSize: 11, fontWeight: '400' as const },
};
