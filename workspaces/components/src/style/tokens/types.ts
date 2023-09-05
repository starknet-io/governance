interface Color {
  content?: string;
  surface?: string;
  disabled?: string;
  default?: string;
  selected?: string;
  selectedInverted?: string;
  hover?: string;
}

interface ComponentTokens {
  tag: {
    closed: Color;
    pending: Color;
    living: Color;
    withdrawn: Color;
    final: Color;
    lastCall: Color;
    review: Color;
    draft: Color;
    stagnant: Color;
    idea: Color;
    active: Color;
  };
}

interface ContentTokens {
  accent: Color;
  success: Color;
  default: Color;
  onSurface: Color;
  danger: Color;
  support: Color;
  links: Color;
  onSurfaceInverted: Color;
}

interface SurfaceTokens {
  overlay: string;
  accentSecondary: Color;
  onBg: Color;
  forms: Color;
  accent: Color;
  danger: Color;
  bgPage: string;
  cards: Color;
  success: Color;
}

interface BorderTokens {
  link: string;
  accent: string;
  forms: string;
  danger: string;
  light: string;
  dividers: string;
}

export interface ColorTokens {
  component: ComponentTokens;
  content: ContentTokens;
  surface: SurfaceTokens;
  border: BorderTokens;
}
