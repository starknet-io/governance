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
      minHeight: "44px",
      svg: {
        boxSize: "20px",
      },
    },
    condensed: {
      minWidth: "36px",
      px: "condensed.lg",
      borderRadius: "condensed.base",
      py: "condensed.sm",
      minHeight: "36px",
      maxWidth: "100%",
      svg: {
        boxSize: "20px",
      },
    },
    withBadgeCondensed: {
      minWidth: "36px",
      paddingLeft: "condensed.lg!important",
      paddingRight: "40px!important",
      borderRadius: "condensed.base",
      py: "condensed.sm",
      minHeight: "36px",
      maxWidth: "100%",
      svg: {
        boxSize: "20px",
      },
    },
    withBadgeStandard: {
      minWidth: "44px",
      paddingLeft: "condensed.lg!important",
      paddingRight: "40px!important",
      borderRadius: "condensed.base",
      py: "condensed.sm",
      minHeight: "44px",
      maxWidth: "100%",
      svg: {
        boxSize: "20px",
      },
    },
    navLink: {
      minWidth: "auto",
      px: "standard.sm",
      borderRadius: "standard.md",
      py: "standard.xs",
      minHeight: "36px",
      maxWidth: "100%",
      justifyContent: "flex-start",
      svg: {
        boxSize: "24px",
      },
    },
  },
  variants: {
    primary: {
      bg: "surface.accent.default",
      color: "content.onSurfaceInverted.default",
      svg: {
        fill: "content.onSurfaceInverted.default",
      },
      _hover: {
        bg: "surface.accent.hover",
        svg: {
          fill: "content.onSurfaceInverted.default",
        },
      },
      _active: {
        outlineWidth: 0,
        bg: "surface.accent.selected",
        svg: {
          fill: "content.onSurfaceInverted.default",
        },
      },
      _disabled: {
        bg: "surface.accent.disabled",
        color: "content.onSurfaceInverted.default",
        svg: {
          fill: "content.onSurfaceInverted.default",
        },
        pointerEvents: "none",
        _hover: {
          bg: "surface.accent.disabled",
          color: "content.onSurfaceInverted.default",
          svg: {
            fill: "content.onSurfaceInverted.default",
          },
        },
      },
    },
    secondary: {
      borderWidth: "1px",
      borderColor: "border.forms",
      bg: "surface.forms.default",
      color: "content.default.default",
      svg: {
        fill: "content.default.default",
      },
      boxShadow: " 0px 1px 1px 0px rgba(0, 0, 0, 0.05)",
      _hover: {
        bg: "surface.forms.hover",
        svg: {
          fill: "content.default.default",
        },
      },
      _active: {
        outlineWidth: 0,
        bg: "surface.forms.default",
        svg: {
          fill: "content.default.default",
        },
      },
      _disabled: {
        bg: "surface.accent.disabled",
        color: "content.onSurfaceInverted.default",
        svg: {
          fill: "content.onSurfaceInverted.default",
        },
        pointerEvents: "none",
        _hover: {
          bg: "surface.accent.disabled",
          color: "content.onSurfaceInverted.default",
          svg: {
            fill: "content.onSurfaceInverted.default",
          },
        },
      },
    },
    outline: {
      borderWidth: "1px",
      borderColor: "border.forms!important",
      bg: "surface.forms.default",
      color: "content.default.default",
      svg: {
        fill: "content.default.default",
      },
      _hover: {
        bg: "surface.forms.hover",
        svg: {
          fill: "content.default.default",
        },
      },
      _active: {
        outlineWidth: 0,
        bg: "surface.forms.default",
        svg: {
          fill: "content.default.default",
        },
      },
      _disabled: {
        bg: "surface.accent.disabled",
        color: "content.onSurfaceInverted.default",
        svg: {
          fill: "content.onSurfaceInverted.default",
        },
        pointerEvents: "none",
        _hover: {
          bg: "surface.accent.disabled",
          color: "content.onSurfaceInverted.default",
          svg: {
            fill: "content.onSurfaceInverted.default",
          },
        },
      },
    },
    ghost: {
      borderColor: "transparent",
      color: "content.default.default",
      svg: {
        fill: "content.default.default",
      },
      bg: "transparent",
      _hover: {
        bg: "surface.forms.hover",
        svg: {
          fill: "content.default.default",
        },
      },
      _active: {
        outlineWidth: 0,
        bg: "surface.forms.selected",
        color: "content.default.selected",
        svg: {
          fill: "content.default.selected",
        },
      },
      _disabled: {
        bg: "surface.accent.disabled",
        color: "content.onSurfaceInverted.default",
        svg: {
          fill: "content.onSurfaceInverted.default",
        },
        pointerEvents: "none",
        _hover: {
          bg: "surface.accent.disabled",
          color: "content.onSurfaceInverted.default",
          svg: {
            fill: "content.onSurfaceInverted.default",
          },
        },
      },
    },
    danger: {
      borderColor: "border.forms",
      bg: "surface.forms.default",
      color: "content.danger.default",
      svg: {
        fill: "content.danger.default",
      },
      boxShadow: " 0px 1px 1px 0px rgba(0, 0, 0, 0.05)",
      _hover: {
        bg: "surface.danger.default",
        color: "content.onSurfaceInverted.default",
        svg: {
          fill: "content.onSurfaceInverted.default",
        },
      },
      _active: {
        outlineWidth: 0,
        bg: "surface.danger.default",
        color: "content.onSurfaceInverted.default",
        svg: {
          fill: "content.onSurfaceInverted.default",
        },
      },
      _disabled: {
        bg: "surface.forms.disabled",
        color: "content.default.disabled",
        svg: {
          fill: "content.default.disabled",
        },

        pointerEvents: "none",
        _hover: {
          bg: "surface.accent.disabled",
          color: "content.onSurfaceInverted.default",
          svg: {
            fill: "content.onSurfaceInverted.default",
          },
        },
      },
    },
    navLink: {
      borderWidth: "1px",
      borderColor: "transparent",
      bg: "transparent",
      color: "content.default.default",
      svg: {
        fill: "content.default.default",
      },
      boxShadow: " 0px 1px 1px 0px rgba(0, 0, 0, 0)",
      _hover: {
        bg: "surface.forms.hover",
        color: "content.default.hover",
        svg: {
          fill: "content.default.hover",
        },
      },
      _active: {
        outlineWidth: 0,
        bg: "surface.forms.selected",
        color: "content.default.selected",
        svg: {
          fill: "content.default.selected",
        },
      },
      _disabled: {
        bg: "surface.forms.disabled",
        color: "content.default.disabled",
        svg: {
          fill: "content.default.disabled",
        },

        pointerEvents: "none",
        _hover: {
          bg: "surface.accent.disabled",
          color: "content.onSurfaceInverted.default",
          svg: {
            fill: "content.onSurfaceInverted.default",
          },
        },
      },
    },
    feedback: {
      borderColor: "border.link",
      bg: "surface.forms.default",
      color: "content.links.default",
      svg: {
        fill: "content.links.default",
      },

      _hover: {
        //toDo no styles for feedback other than default
        opacity: 0.8,
        bg: "surface.forms.default",
        color: "content.links.default",
        svg: {
          fill: "content.links.default",
        },
      },
      _active: {
        outlineWidth: 0,
        bg: "surface.forms.default",
        color: "content.links.default",
        svg: {
          fill: "content.links.default",
        },
      },
      _disabled: {
        bg: "surface.forms.disabled",
        color: "content.default.disabled",
        svg: {
          fill: "content.default.disabled",
        },

        pointerEvents: "none",
        _hover: {
          bg: "surface.accent.disabled",
          color: "content.onSurfaceInverted.default",
          svg: {
            fill: "content.onSurfaceInverted.default",
          },
        },
      },
    },
    special: {
      borderColor: "border.forms",
      minHeight: "72px",
      px: "standard.xl",
      py: "standard.sm",
      bg: "surface.forms.default",
      color: "content.default.default",
      boxShadow: "0px 1px 1px 0px rgba(0, 0, 0, 0.05)",
      svg: {
        width: "24px!important",
        height: "24px!important",
      },

      _hover: {
        color: "content.default.hover",
      },
      _active: {
        bg: "surface.forms.selected",
        borderColor: "border.forms",
        color: "content.default.selected",
      },
      _disabled: {
        bg: "surface.forms.default",

        boxShadow: "0px 1px 1px 0px rgba(0, 0, 0, 0.05)",
        pointerEvents: "none",
        opacity: 1,
      },
      _focusVisible: {
        boxShadow: "0px 0px 0px 4px #3F8CFF, 0px 0px 0px 1px #F9F9FB",
      },
    },
  },
  defaultProps: { size: "standard", variant: "primary" },
};
