export const buttonTheme = {
  baseStyle: {
    fontWeight: "500",
    letterSpacing: "0.004rem",
    lineHeight: "1.25rem",

    fontSize: "sm",
    borderWidth: "1px",
    borderColor: "transparent",
    _focusVisible: {
      borderColor: "content.onSurfaceInverted.default",
      borderWidth: "1px",
      boxShadow: "0px 0px 0px 4px #4343D1",
    },
  },
  sizes: {
    standard: {
      minWidth: "44px",
      px: "standard.lg",
      borderRadius: "standard.base",
      py: "standard.sm",
    },
    condensed: {
      minWidth: "36px",
      px: "condensed.lg",
      borderRadius: "condensed.base",
      py: "condensed.sm",
    },
  },
  variants: {
    primary: {
      bg: "surface.accent.default",
      color: "content.onSurfaceInverted.default",
      _hover: { bg: "surface.accent.hover" },
      _active: { outlineWidth: 0, bg: "surface.accent.selected" },
      _disabled: {
        bg: "surface.accent.disabled",
        color: "content.onSurfaceInverted.default",
        pointerEvents: "none",
        _hover: {
          bg: "surface.accent.disabled",
          color: "content.onSurfaceInverted.default",
        },
      },
    },
    secondary: {
      borderWidth: "1px",
      borderColor: "border.forms",
      bg: "surface.forms.default",
      color: "content.default.default",
      boxShadow: " 0px 1px 1px 0px rgba(0, 0, 0, 0.05)",
      _hover: { bg: "surface.forms.hover" },
      _active: { outlineWidth: 0, bg: "surface.forms.default" },
      _disabled: {
        bg: "surface.accent.disabled",
        color: "content.onSurfaceInverted.default",
        pointerEvents: "none",
        _hover: {
          bg: "surface.accent.disabled",
          color: "content.onSurfaceInverted.default",
        },
      },
    },
    outline: {
      borderWidth: "1px",
      borderColor: "border.forms!important",
      bg: "surface.forms.default",
      color: "content.default.default",
      _hover: { bg: "surface.forms.hover" },
      _active: { outlineWidth: 0, bg: "surface.forms.default" },
      _disabled: {
        bg: "surface.accent.disabled",
        color: "content.onSurfaceInverted.default",
        pointerEvents: "none",
        _hover: {
          bg: "surface.accent.disabled",
          color: "content.onSurfaceInverted.default",
        },
      },
    },
    ghost: {
      borderColor: "transparent",
      color: "content.default.default",
      bg: "transparent",
      _hover: { bg: "surface.forms.hover" },
      _active: {
        outlineWidth: 0,
        bg: "surface.forms.selectedInverted",
        color: "content.default.selectedInverted",
      },
      _disabled: {
        bg: "surface.accent.disabled",
        color: "content.onSurfaceInverted.default",
        pointerEvents: "none",
        _hover: {
          bg: "surface.accent.disabled",
          color: "content.onSurfaceInverted.default",
        },
      },
    },
    danger: {
      borderColor: "border.forms",
      bg: "surface.forms.default",
      color: "content.danger.default",
      boxShadow: " 0px 1px 1px 0px rgba(0, 0, 0, 0.05)",
      _hover: {
        bg: "surface.danger.default",
        color: "content.onSurfaceInverted.default",
      },
      _active: {
        outlineWidth: 0,
        bg: "surface.danger.default",
        color: "content.onSurfaceInverted.default",
      },
      _disabled: {
        bg: "surface.forms.disabled",
        color: "content.default.disabled",
        pointerEvents: "none",
        _hover: {
          bg: "surface.accent.disabled",
          color: "content.onSurfaceInverted.default",
        },
      },
    },
  },
  defaultProps: { size: "standard", variant: "primary" },
};
